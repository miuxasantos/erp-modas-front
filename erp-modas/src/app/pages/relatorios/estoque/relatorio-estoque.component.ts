import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BotaoExportarComponent } from '@shared/components/bota-exportar/botao-exportar.component';
import { RelatorioApiService } from '@core/services/relatorio-api.service';
import { EstoqueGeralResponseDto } from '@core/dtos/relatorios/estoque/estoque-geral-response.dto';
import { EstoqueProdutoResponseDto } from '@core/dtos/relatorios/estoque/estoque-produto-response.dto';
import { FiltroEstoqueDto } from '@core/dtos/relatorios/estoque/filtro-estoque.dto';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';
import { baixarArquivo } from '@core/utils/baixar-aquivo.utils';

interface LinhaEstoque extends EstoqueProdutoResponseDto {
    variacoesZeradas: number;
}

/**
 * Estoque não tem período: é uma "foto" do momento. Por isso o único filtro é
 * "apenas ativos", e a página carrega direto ao abrir.
 */
@Component({
    selector: 'app-relatorio-estoque',
    imports: [
        ReactiveFormsModule, ButtonModule, CheckboxModule, IconFieldModule, InputIconModule,
        InputTextModule, TableModule, TagModule,
        CurrencyPipe,
        PageHeaderComponent, BotaoExportarComponent,
    ],
    templateUrl: './relatorio-estoque.component.html',
})
export class RelatorioEstoqueComponent implements OnInit {
    private readonly relatorioApi = inject(RelatorioApiService);
    private readonly fb = inject(FormBuilder);

    // Trecho da URL de exportação no backend: /relatorios/{CAMINHO}/exportar
    private readonly CAMINHO_EXPORTACAO = 'estoque';

    breadcrumbs: MenuItem[] = [
        { label: 'Home', routerLink: '/home' },
        { label: 'Relatórios' },
        { label: 'Estoque' },
    ];

    form = this.fb.nonNullable.group({
        apenasAtivos: [false],
    });

    geral            = signal<EstoqueGeralResponseDto | null>(null);
    produtos         = signal<EstoqueProdutoResponseDto[]>([]);
    filtrosAplicados = signal<FiltroEstoqueDto | null>(null);
    carregando       = signal(false);
    exportando       = signal(false);

    // Objeto { [id]: true } que o p-table usa para saber quais linhas estão abertas.
    // É um objeto comum (não signal) porque o próprio p-table o altera ao clicar na seta.
    expandidos: Record<number, boolean> = {};

    linhas = computed<LinhaEstoque[]>(() =>
        this.produtos().map(produto => ({
            ...produto,
            variacoesZeradas: produto.variacoes.filter(v => v.quantidade <= 0).length,
        }))
    );

    margemPotencial = computed(() => {
        const geral = this.geral();
        return geral ? geral.valorEstoqueVenda - geral.valorEstoqueCusto : 0;
    });

    ngOnInit(): void {
        this.gerar();
    }

    gerar(): void {
        const filtros: FiltroEstoqueDto = this.form.getRawValue();
        this.carregando.set(true);

        // Os totais vêm do /geral (a regra de "sem estoque" fica no backend);
        // a lista vem do /produtos. As duas chamadas em paralelo.
        forkJoin({
            geral:    this.relatorioApi.estoqueGeral(filtros),
            produtos: this.relatorioApi.estoqueProdutos(filtros),
        })
            .pipe(finalize(() => this.carregando.set(false)))
            .subscribe({
                next: ({ geral, produtos }) => {
                    this.geral.set(geral);
                    this.produtos.set(produtos);
                    this.filtrosAplicados.set(filtros);
                    this.expandidos = {};
                },
            });
    }

    expandirTodos(): void {
        this.expandidos = Object.fromEntries(
            this.produtos()
                .filter(produto => produto.variacoes.length > 0)
                .map(produto => [produto.id, true])
        );
    }

    recolherTodos(): void {
        this.expandidos = {};
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