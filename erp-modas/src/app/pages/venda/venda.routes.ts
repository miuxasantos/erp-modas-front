import { Routes } from '@angular/router';

export const vendasRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./venda-list/venda-list.component')
            .then(c => c.VendaListComponent),
    },
    {
        path: 'nova',
        loadComponent: () =>
        import('./venda-form/venda-form.component')
            .then(c => c.VendaFormComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
        import('./venda-detalhe/venda-detalhe.component')
            .then(c => c.VendaDetalheComponent),
    },
    {
        path: ':id/editar',
        loadComponent: () =>
        import('./venda-form/venda-form.component')
            .then(c => c.VendaFormComponent),
    },
];