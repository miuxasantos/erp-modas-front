import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { DiaFiscalDto } from '@core/dtos/relatorios/fiscal/dia-fiscal.dto';
import { RelatorioFiscalResponseDto } from '@core/dtos/relatorios/fiscal/relatorio-fiscal-response.dto';
import { FiltroFiscalDto } from '@core/dtos/relatorios/fiscal/filtro-fiscal.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

type CampoValor = Exclude<keyof DiaFiscalDto, 'data'>;

interface ColunaFiscal {
    campo: CampoValor;
    rotulo: string;
    total?: boolean;
}

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/**
 * Livro diário do mês: uma linha por dia (inclusive os sem movimento),
 * entradas e saídas separadas por forma de pagamento, total e saldo de cada dia
 * e a linha de totais do mês. Cada conta entra no dia da venda/compra que a gerou,
 * com o valor cheio, confirmada ou não (regra definida no backend).
 */
@Component({
    selector: 'app-relatorio-fiscal',
    imports: [
        ReactiveFormsModule, ButtonModule, InputNumberModule, SelectModule, TableModule, TooltipModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-fiscal.component.html',
})
export class RelatorioFiscalComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'financeiro/fiscal';

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Relatórios' },
        { label: 'Fiscal mensal' },
    ];

    readonly opcoesMes = MESES.map((nome, indice) => ({ label: nome, value: indice + 1 }));

    // As colunas da tabela vêm daqui: o template não repete 10 células iguais
    readonly colunasEntrada: ColunaFiscal[] = [
        { campo: 'entradaDinheiro', rotulo: 'Dinheiro' },
        { campo: 'entradaPix',      rotulo: 'Pix' },
        { campo: 'entradaCartao',   rotulo: 'Cartão' },
        { campo: 'entradaOutros',   rotulo: 'Outros' },
        { campo: 'totalEntradas',   rotulo: 'Total', total: true },
    ];

    readonly colunasSaida: ColunaFiscal[] = [
        { campo: 'saidaDinheiro', rotulo: 'Dinheiro' },
        { campo: 'saidaPix',      rotulo: 'Pix' },
        { campo: 'saidaCartao',   rotulo: 'Cartão' },
        { campo: 'saidaOutros',   rotulo: 'Outros' },
        { campo: 'totalSaidas',   rotulo: 'Total', total: true },
    ];

    form = this.fb.nonNullable.group({
        mes: [new Date().getMonth() + 1, Validators.required],
        ano: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    });

    relatorio        = signal<RelatorioFiscalResponseDto | null>(null);
    filtrosAplicados = signal<FiltroFiscalDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    /** Primeiro dia do mês aplicado, só para exibir "outubro de 2026" com o DatePipe */
    competencia = computed(() => {
        const filtros = this.filtrosAplicados();
        return filtros ? new Date(filtros.ano, filtros.mes - 1, 1) : null;
    });

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroFiscalDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.fiscal(filtros)
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: relatorio => {
                    this.relatorio.set(relatorio);
                    this.filtrosAplicados.set(filtros);
                },
            });
    }

    /** Setas de mês anterior/próximo: o Date resolve a virada de ano (mês 0 → dezembro do ano anterior) */
    mudarMes(deslocamento: number): void {
        const { ano, mes } = this.form.getRawValue();
        const novaData = new Date(ano, mes - 1 + deslocamento, 1);

        this.form.setValue({ mes: novaData.getMonth() + 1, ano: novaData.getFullYear() });
        this.gerar();
    }

    semMovimento(dia: DiaFiscalDto): boolean {
        return dia.totalEntradas === 0 && dia.totalSaidas === 0;
    }

    exportar(formato: FormatoExportacao): void {
        const filtros = this.filtrosAplicados();
        if (!filtros) return;

        this.exportando.set(true);

        this.relatorioApi.exportar(this.CAMINHO_EXPORTACAO, formato, { ...filtros })
            .pipe(finalize(() => this.exportando.set(false)))
            .subscribe({
                next: arquivo => baixarArquivo(arquivo.blob, arquivo.nomeArquivo),
            });
    }
}