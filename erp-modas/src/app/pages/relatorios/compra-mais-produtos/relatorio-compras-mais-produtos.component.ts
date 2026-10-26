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
import { CompraResumoResponseDto } from '@core/dtos/relatorios/compras/compra-resumo-response.dto';
import { FiltroPeriodoDto } from '@core/dtos/relatorios/filtro-periodo.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { dataLocalISO, periodoValidoValidator, primeiroDiaDoMesISO } from '@core/utils/data.utils';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

/** Posição fixada na ordem do backend (mais unidades primeiro), para não mudar quando o usuário reordena */
interface LinhaCompra extends CompraResumoResponseDto {
    posicao: number;
}

@Component({
    selector: 'app-relatorio-compras-mais-produtos',
    imports: [
        ReactiveFormsModule, ButtonModule, InputTextModule, TableModule,
        CurrencyPipe, DatePipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-compras-mais-produtos.component.html',
})
export class RelatorioComprasMaisProdutosComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'compras/mais-produtos';

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Relatórios' },
        { label: 'Compras com mais produtos' },
    ];

    // Datas sem Validators.required: vazias = todo o histórico (o backend trata ausência como "sem limite")
    form = this.fb.nonNullable.group({
        inicio: [primeiroDiaDoMesISO()],
        fim:    [dataLocalISO()],
    }, { validators: periodoValidoValidator() });

    compras          = signal<CompraResumoResponseDto[] | null>(null);
    filtrosAplicados = signal<FiltroPeriodoDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    linhas = computed<LinhaCompra[]>(() =>
        (this.compras() ?? []).map((compra, indice) => ({ ...compra, posicao: indice + 1 }))
    );

    totalUnidades = computed(() => this.linhas().reduce((soma, c) => soma + c.unidadesAdicionadas, 0));
    totalValor    = computed(() => this.linhas().reduce((soma, c) => soma + c.valorTotal, 0));

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        if (this.form.invalid) return;

        const filtros: FiltroPeriodoDto = this.form.getRawValue();
        this.carregando.set(true);

        this.relatorioApi.comprasMaisProdutos(filtros)
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: compras => {
                    this.compras.set(compras);
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