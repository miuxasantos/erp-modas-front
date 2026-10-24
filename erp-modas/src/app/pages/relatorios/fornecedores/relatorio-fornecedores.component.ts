import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { FornecedorComprasResponseDto } from '@core/dtos/relatorios/fornecedores/fornecedor-compras-response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

/** Posição fixada na ordem do backend (mais compras primeiro), para não mudar quando o usuário reordena */
interface LinhaFornecedor extends FornecedorComprasResponseDto {
    posicao: number;
}

@Component({
    selector: 'app-relatorio-fornecedores',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule, TableModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-fornecedores.component.html',
})
export class RelatorioFornecedoresComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'compras/fornecedores';

    breadcrumbs: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Relatórios' },
        { label: 'Fornecedores' },
    ];

    // Datas sem Validators.required: vazias = todo o histórico (o backend trata ausência como "sem limite")
    form = this.fb.nonNullable.group({
        inicio: [primeiroDiaDoMesISO()],
        fim:    [dataLocalISO()],
    }, { validators: periodoValidoValidator() });

    fornecedores     = signal<FornecedorComprasResponseDto[] | null>(null);
    filtrosAplicados = signal<FiltroPeriodoDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    linhas = computed<LinhaFornecedor[]>(() =>
        (this.fornecedores() ?? []).map((fornecedor, indice) => ({ ...fornecedor, posicao: indice + 1 }))
    );

    totalCompras  = computed(() => this.linhas().reduce((soma, f) => soma + f.quantidadeCompras, 0));
    totalUnidades = computed(() => this.linhas().reduce((soma, f) => soma + f.unidadesAdicionadas, 0));
    totalValor    = computed(() => this.linhas().reduce((soma, f) => soma + f.valorTotal, 0));

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroPeriodoDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.fornecedores(filtros)
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: fornecedores => {
                    this.fornecedores.set(fornecedores);
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

        this.exportando.set(true);

        this.relatorioApi.exportar(this.CAMINHO_EXPORTACAO, formato, { ...filtros })
            .pipe(finalize(() => this.exportando.set(false)))
            .subscribe({
                next: arquivo => baixarArquivo(arquivo.blob, arquivo.nomeArquivo),
            });
    }
}