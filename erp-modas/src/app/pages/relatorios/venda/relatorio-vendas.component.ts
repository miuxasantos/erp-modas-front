import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { RelatorioVendasResponseDto } from '@core/dtos/relatorios/vendas/relatorio-vendas-response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

/**
 * MODELO das páginas de relatório:
 *  1. formulário de filtros  →  "Gerar" busca o JSON e mostra na tela
 *  2. "Exportar" baixa PDF/CSV usando os filtros que GERARAM o resultado (filtrosAplicados),
 *     não os que estão no formulário agora — assim o arquivo sempre bate com o que está na tela
 *
 * Estado local (signals no componente): relatório é somente leitura e não é
 * compartilhado entre telas, então não precisa de service com estado.
 */
@Component({
    selector: 'app-relatorio-vendas',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule, TableModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-vendas.component.html',
})
export class RelatorioVendasComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'vendas';

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Relatórios' },
        { label: 'Vendas' },
    ];

    form = this.fb.nonNullable.group({
        inicio: [primeiroDiaDoMesISO(), Validators.required],
        fim:    [dataLocalISO(), Validators.required],
    }, { validators: periodoValidoValidator() });

    relatorio        = signal<RelatorioVendasResponseDto | null>(null);
    filtrosAplicados = signal<FiltroPeriodoDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    ngOnInit(): void {
        // Abre já com o mês atual carregado
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroPeriodoDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.vendas(filtros)
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: relatorio => {
                    this.relatorio.set(relatorio);
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
}