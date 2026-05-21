// pages/produtos/produtos.routes.ts
import { Routes } from '@angular/router';

export const produtosRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./produto-list/produto-list.component')
            .then(c => c.ProdutoListComponent),
    },
    {
        path: 'novo',
        loadComponent: () =>
        import('./produto-form/produto-form.component')
            .then(c => c.ProdutoFormComponent),
    },
    {
        path: ':id/editar',
        loadComponent: () =>
        import('./produto-form/produto-form.component')
            .then(c => c.ProdutoFormComponent),
    },
    {
        path: ':id/variacoes',
        loadComponent: () =>
        import('./variacoes-produto/variacoes-produto.component')
            .then(c => c.VariacoesProdutoComponent),
    },
];