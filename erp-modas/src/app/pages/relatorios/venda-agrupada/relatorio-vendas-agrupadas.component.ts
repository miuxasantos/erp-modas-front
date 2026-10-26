import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { VendaAgrupadaResponseDto } from '@core/dtos/relatorios/vendas/venda-agrupada-response.dto';
import { FiltroVendasAgrupadasDto } from '@core/dtos/relatorios/vendas/filtro-vendas-agrupadas.dto';
import { AgrupamentoVenda } from '@core/enums/agrupamento-venda.enum';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

interface ConfigAgrupamento {
    label: string;            // opção do select e rótulo do card de contagem
    rotuloGrupo: string;      // cabeçalho da coluna do nome
    rotuloQuantidade: string; // cabeçalho da coluna de quantidade
    ranking: boolean;         // mostra a coluna "#"
    observacao?: string;      // nota extra abaixo da tabela
}

/**
 * Mesmos textos que o RelatorioVendaExportacaoService usa no PDF/CSV.
 * Clientes e estações: o backend soma 1 por VENDA; os demais somam as PEÇAS de cada item.
 * Estações vêm em ordem cronológica, então não faz sentido numerar como ranking.
 */
const AGRUPAMENTOS: Record<AgrupamentoVenda, ConfigAgrupamento> = {
    [AgrupamentoVenda.PRODUTOS]:   { label: 'Produtos',             rotuloGrupo: 'Produto',   rotuloQuantidade: 'Peças vendidas', ranking: true },
    [AgrupamentoVenda.CATALOGO]:   { label: 'Produtos do catálogo', rotuloGrupo: 'Produto',   rotuloQuantidade: 'Peças vendidas', ranking: true,
                                     observacao: 'Apenas produtos ativos marcados para o catálogo.' },
    [AgrupamentoVenda.CATEGORIAS]: { label: 'Categorias',           rotuloGrupo: 'Categoria', rotuloQuantidade: 'Peças vendidas', ranking: true },
    [AgrupamentoVenda.CORES]:      { label: 'Cores',                rotuloGrupo: 'Cor',       rotuloQuantidade: 'Peças vendidas', ranking: true },
    [AgrupamentoVenda.TAMANHOS]:   { label: 'Tamanhos',             rotuloGrupo: 'Tamanho',   rotuloQuantidade: 'Peças vendidas', ranking: true },
    [AgrupamentoVenda.CLIENTES]:   { label: 'Clientes',             rotuloGrupo: 'Cliente',   rotuloQuantidade: 'Vendas',         ranking: true },
    [AgrupamentoVenda.ESTACOES]:   { label: 'Estações',             rotuloGrupo: 'Estação',   rotuloQuantidade: 'Vendas',         ranking: false },
};

/** Linha da tabela: a posição é fixada na ordem do backend, para não mudar quando o usuário reordena */
interface LinhaAgrupada extends VendaAgrupadaResponseDto {
    posicao: number;
}

@Component({
    selector: 'app-relatorio-vendas-agrupadas',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TableModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-vendas-agrupadas.component.html',
})
export class RelatorioVendasAgrupadasComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Relatórios' },
        { label: 'Vendas agrupadas' },
    ];

    // Ordem do select segue a ordem de declaração do AGRUPAMENTOS
    readonly opcoesAgrupamento = Object.entries(AGRUPAMENTOS).map(([valor, config]) => ({
        label: config.label,
        value: valor as AgrupamentoVenda,
    }));

    // Datas sem Validators.required: vazias = todo o histórico (o backend trata ausência como "sem limite")
    form = this.fb.nonNullable.group({
        agrupamento: [AgrupamentoVenda.PRODUTOS, Validators.required],
        inicio:      [primeiroDiaDoMesISO()],
        fim:         [dataLocalISO()],
    }, { validators: periodoValidoValidator() });

    grupos           = signal<VendaAgrupadaResponseDto[] | null>(null);
    filtrosAplicados = signal<FiltroVendasAgrupadasDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    // Tudo que é exibido deriva dos filtros APLICADOS: trocar o select sem clicar em
    // "Gerar" não muda os cabeçalhos de um resultado que foi gerado com outro agrupamento
    config = computed(() => {
        const filtros = this.filtrosAplicados();
        return filtros ? AGRUPAMENTOS[filtros.agrupamento] : null;
    });

    linhas = computed<LinhaAgrupada[]>(() =>
        (this.grupos() ?? []).map((grupo, indice) => ({ ...grupo, posicao: indice + 1 }))
    );

    totalQuantidade  = computed(() => this.linhas().reduce((soma, g) => soma + g.quantidade, 0));
    totalFaturamento = computed(() => this.linhas().reduce((soma, g) => soma + g.faturamento, 0));

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroVendasAgrupadasDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.vendasAgrupadas(filtros)
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: grupos => {
                    this.grupos.set(grupos);
                    this.filtrosAplicados.set(filtros);
                },
            });
    }

    /** Limpa as datas: o próximo "Gerar" considera todo o histórico */
    limparPeriodo(): void {
        this.form.patchValue({ inicio: '', fim: '' });
    }

    exportar(formato: FormatoExportacao): void {
        const filtros = this.filtrosAplicados();
        if (!filtros) return;

        const { agrupamento, ...periodo } = filtros;
        this.exportando.set(true);

        this.relatorioApi.exportar(`vendas/${agrupamento}`, formato, periodo)
            .pipe(finalize(() => this.exportando.set(false)))
            .subscribe({
                next: arquivo => baixarArquivo(arquivo.blob, arquivo.nomeArquivo),
            });
    }
}