import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { CurrencyPipe } from "@angular/common";
import { ProdutoApiService } from "@core/services/produto/produto-api.service";
import { ProdutoResponseDto } from "@core/dtos/produto/produto-response.dto";
import { forkJoin } from "rxjs";
import { CategoriaApiService } from "@core/services/categoria-api.service";

@Component({
    selector: 'app-produto-list',
    imports: [
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        CurrencyPipe,
        PageHeaderComponent,
    ],
    templateUrl: './produto-list.component.html'
})

export class ProdutoListComponent implements OnInit {
    private readonly produtoApi = inject(ProdutoApiService);
    private readonly categoriaApi = inject(CategoriaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);

    produtos: ProdutoResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    produtoEditando: ProdutoResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Produtos'},
    ];

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        forkJoin({
            produtos: this.produtoApi.getAll(),
            categorias: this.categoriaApi.getAll(),
        }).subscribe({
            next: ({ produtos, categorias }) => {
                 console.log('PRODUTOS', produtos);
        console.log('CATEGORIAS', categorias);
                this.produtos = produtos.map(produto => ({
                    ...produto,
                    categoria: categorias.find(c => c.id === produto.categoriaId)!,
                }));
            },
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/produtos', id]);
    }

    novo(): void {
        this.router.navigate(['/produtos/novo']);
    }

    editar(id: number): void {
        this.router.navigate(['/produtos', id, 'editar']);
    }

    gerenciarVariacoes(id: number): void {
        this.router.navigate(['/produtos', id, 'variacoes']);
    }

    confirmarExclusao(id: number): void {
        console.log('confirmarExclusao chamado', id); 
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este produto?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.produtoApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Produto excluído com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}