import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { FaturamentoPeriodoResponseDto } from '@core/dtos/relatorios/financeiro/faturamento-periodo-response.dto';
import { ContasPeriodoResponseDto } from '@core/dtos/relatorios/financeiro/contas-periodo.response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

interface ResumoFinanceiro {
    faturamento: FaturamentoPeriodoResponseDto;
    contasReceber: ContasPeriodoResponseDto;
    contasPagar: ContasPeriodoResponseDto;
}

/** As duas seções de contas têm o mesmo layout; só mudam os textos */
interface SecaoContas {
    titulo: string;
    rotuloQuitado: string;
    contas: ContasPeriodoResponseDto;
    percentualQuitado: number;
}

/**
 * Resumo financeiro = os três endpoints de resumo do backend juntos
 * (o mesmo agrupamento que o PDF "Resumo Financeiro" faz).
 */
@Component({
    selector: 'app-relatorio-financeiro',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule,
        CurrencyPipe, PercentPipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-financeiro.component.html',
})
export class RelatorioFinanceiroComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'financeiro/resumo';

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Relatórios' },
        { label: 'Financeiro' },
    ];

    // Datas obrigatórias: os três endpoints do backend validam inicio e fim
    form = this.fb.nonNullable.group({
        inicio: [primeiroDiaDoMesISO(), Validators.required],
        fim:    [dataLocalISO(), Validators.required],
    }, { validators: periodoValidoValidator() });

    resumo           = signal<ResumoFinanceiro | null>(null);
    filtrosAplicados = signal<FiltroPeriodoDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    secoesContas = computed<SecaoContas[]>(() => {
        const resumo = this.resumo();
        if (!resumo) return [];

        return [
            this.montarSecao('Contas a receber', 'Recebido', resumo.contasReceber),
            this.montarSecao('Contas a pagar', 'Pago', resumo.contasPagar),
        ];
    });

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroPeriodoDto = this.form.getRawValue();
        this.carregando.set(true);

        forkJoin({
            faturamento:   this.relatorioApi.faturamento(filtros),
            contasReceber: this.relatorioApi.contasAReceber(filtros),
            contasPagar:   this.relatorioApi.contasAPagar(filtros),
        })
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: resumo => {
                    this.resumo.set(resumo);
                    this.filtrosAplicados.set(filtros);
                },
            });
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

    private montarSecao(titulo: string, rotuloQuitado: string, contas: ContasPeriodoResponseDto): SecaoContas {
        return {
            titulo,
            rotuloQuitado,
            contas,
            // Sem contas no período, evita divisão por zero
            percentualQuitado: contas.valorTotal > 0 ? contas.valorPago / contas.valorTotal : 0,
        };
    }
}