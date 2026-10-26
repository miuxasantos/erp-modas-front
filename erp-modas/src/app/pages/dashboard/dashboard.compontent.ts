import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ApexAxisChartSeries, ApexChart, ApexNonAxisChartSeries, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { AuthService } from '@core/services/auth/auth.service';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { RelatorioVendasResponseDto } from '@core/dtos/relatorios/vendas/relatorio-vendas-response.dto';
import { VendaAgrupadaResponseDto } from '@core/dtos/relatorios/vendas/venda-agrupada-response.dto';
import { ContasPeriodoResponseDto } from '@core/dtos/relatorios/financeiro/contas-periodo.response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { AgrupamentoVenda } from '@core/enums/agrupamento-venda.enum';
import { dataLocalISO } from '@core/utils/data.utils';
import { formatarMoeda } from '@core/config/apexcharts.config';
import { TempoSaidaResponseDto } from '@core/dtos/relatorios/estoque/tempo-saida-response.dto';

interface DadosDashboard {
    vendas: RelatorioVendasResponseDto;
    produtos: VendaAgrupadaResponseDto[];
    categorias: VendaAgrupadaResponseDto[];
    contasReceber: ContasPeriodoResponseDto;
    contasPagar: ContasPeriodoResponseDto;
    tempoSaida: TempoSaidaResponseDto;
}

const COR_PRINCIPAL = '#10b981';
const CORES_CATEGORICAS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];


@Component({
    selector: 'app-dashboard',
    imports: [ChartComponent, ButtonModule, TooltipModule, CurrencyPipe, DatePipe, DecimalPipe, RouterLink],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    readonly auth = inject(AuthService);

    mes = signal(primeiroDia(new Date()));
    dados = signal<DadosDashboard | null>(null);
    carregando = signal(false);

    ehMesAtual = computed(() => this.mes().getTime() === primeiroDia(new Date()).getTime());

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CONFIGURAÇÃO FIXA DOS GRÁFICOS (o que muda com os dados fica nos computed abaixo)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    readonly moeda: ApexYAxis = { labels: { formatter: formatarMoeda } };
    readonly tooltipMoeda: ApexTooltip = { y: { formatter: formatarMoeda } };

    readonly chartFaturamento: ApexChart = { type: 'area', height: 280 };
    readonly chartProdutos: ApexChart = { type: 'bar', height: 280 };
    readonly chartFormas: ApexChart = { type: 'donut', height: 280 };
    readonly chartCategorias: ApexChart = { type: 'bar', height: 280 };

    readonly barrasHorizontais: ApexPlotOptions = { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } };
    readonly colunas: ApexPlotOptions = { bar: { borderRadius: 4, columnWidth: '50%' } };
    readonly corPrincipal = [COR_PRINCIPAL];
    readonly coresCategoricas = CORES_CATEGORICAS;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SÉRIES (derivadas das respostas da API)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * O backend só devolve os dias que tiveram venda. Aqui todos os dias do mês
     * (até hoje, se for o mês atual) entram no eixo, com zero nos dias sem venda,
     * senão o gráfico "liga" dois dias de venda como se o meio também tivesse vendido.
     */
    faturamentoPorDia = computed(() => {
        const vendas = this.dados()?.vendas;
        const totalPorData = new Map((vendas?.vendasPorDia ?? []).map(d => [d.data, d.total]));
        const dias = diasDoPeriodo(this.mes());

        return {
            series: [{ name: 'Faturamento', data: dias.map(d => totalPorData.get(d) ?? 0) }] as ApexAxisChartSeries,
            xaxis: {
                categories: dias.map(d => d.substring(8, 10)),   // "2026-10-05" -> "05"
                tickAmount: 10,
                labels: { rotate: 0 },
            } as ApexXAxis,
        };
    });

    /** Top 5 por peças vendidas (o backend já devolve ordenado por quantidade) */
    topProdutos = computed(() => {
        const top = (this.dados()?.produtos ?? []).slice(0, 5);
        return {
            series: [{ name: 'Peças vendidas', data: top.map(p => p.quantidade) }] as ApexAxisChartSeries,
            xaxis: { categories: top.map(p => p.nome) } as ApexXAxis,
        };
    });

    /** Soma o valor das vendas por forma de pagamento a partir da lista de vendas do mês */
    porFormaPagamento = computed(() => {
        const totais = new Map<string, number>();
        for (const venda of this.dados()?.vendas.vendas ?? []) {
            totais.set(venda.formaPagamento, (totais.get(venda.formaPagamento) ?? 0) + venda.valorTotal);
        }
        const ordenado = [...totais.entries()].sort((a, b) => b[1] - a[1]);
        return {
            series: ordenado.map(([, total]) => total) as ApexNonAxisChartSeries,
            labels: ordenado.map(([forma]) => forma),
        };
    });

    porCategoria = computed(() => {
        const categorias = [...(this.dados()?.categorias ?? [])].sort((a, b) => b.faturamento - a.faturamento);
        return {
            series: [{ name: 'Faturamento', data: categorias.map(c => c.faturamento) }] as ApexAxisChartSeries,
            xaxis: { categories: categorias.map(c => c.nome) } as ApexXAxis,
        };
    });

    ngOnInit(): void {
        // Vendedor não tem acesso aos relatórios: nem chama a API
        if (this.auth.isProprietario()) {
            this.carregar();
        }
    }

    mudarMes(deslocamento: number): void {
        const atual = this.mes();
        this.mes.set(new Date(atual.getFullYear(), atual.getMonth() + deslocamento, 1));
        this.carregar();
    }

    carregar(): void {
        const filtro = periodoDoMes(this.mes());
        this.carregando.set(true);

        forkJoin({
            vendas:        this.relatorioApi.vendas(filtro),
            produtos:      this.relatorioApi.vendasAgrupadas({ agrupamento: AgrupamentoVenda.PRODUTOS, ...filtro }),
            categorias:    this.relatorioApi.vendasAgrupadas({ agrupamento: AgrupamentoVenda.CATEGORIAS, ...filtro }),
            contasReceber: this.relatorioApi.contasAReceber(filtro),
            contasPagar:   this.relatorioApi.contasAPagar(filtro),
            tempoSaida:    this.relatorioApi.tempoSaida(filtro),
        })
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: dados => this.dados.set(dados),
            });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Funções de data (sem estado, por isso fora da classe)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function primeiroDia(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), 1);
}

/** Do dia 1 ao último dia do mês; no mês atual, só até hoje */
function periodoDoMes(mes: Date): FiltroPeriodoDto {
    const ultimoDia = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
    const hoje = new Date();
    const fim = ultimoDia > hoje ? hoje : ultimoDia;
    return { inicio: dataLocalISO(mes), fim: dataLocalISO(fim) };
}

/** Lista "yyyy-MM-dd" de cada dia do período do mês */
function diasDoPeriodo(mes: Date): string[] {
    const { fim } = periodoDoMes(mes);
    const dias: string[] = [];
    for (let d = new Date(mes); dataLocalISO(d) <= fim; d.setDate(d.getDate() + 1)) {
        dias.push(dataLocalISO(d));
    }
    return dias;
}