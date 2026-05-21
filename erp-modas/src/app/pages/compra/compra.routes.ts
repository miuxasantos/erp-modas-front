import { Routes } from '@angular/router';

export const comprasRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./compra-list/compra-list.component')
            .then(c => c.CompraListComponent),
    },
    {
        path: 'nova',
        loadComponent: () =>
        import('./compra-form/compra-form.component')
            .then(c => c.CompraFormComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
        import('./compra-detalhe/compra-detalhe.component')
            .then(c => c.CompraDetalheComponent),
    },
    {
        path: ':id/editar',
        loadComponent: () =>
        import('./compra-form/compra-form.component')
            .then(c => c.CompraFormComponent),
    },
];