import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { RelatorioComprasResponseDto } from '@core/dtos/relatorios/compras/relatorio-compras-response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

@Component({
    selector: 'app-relatorio-compras',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule, TableModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-compras.component.html',
})
export class RelatorioComprasComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'compras/periodo';

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Relatórios' },
        { label: 'Compras' },
    ];

    // Datas obrigatórias: no backend, /compras/periodo exige inicio e fim
    form = this.fb.nonNullable.group({
        inicio: [primeiroDiaDoMesISO(), Validators.required],
        fim:    [dataLocalISO(), Validators.required],
    }, { validators: periodoValidoValidator() });

    relatorio        = signal<RelatorioComprasResponseDto | null>(null);
    filtrosAplicados = signal<FiltroPeriodoDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    // O DTO do backend não traz o total de unidades; é a mesma soma que o PDF faz na linha de total
    totalUnidades = computed(() =>
        (this.relatorio()?.compras ?? []).reduce((soma, compra) => soma + compra.unidadesAdicionadas, 0)
    );

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroPeriodoDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.compras(filtros)
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