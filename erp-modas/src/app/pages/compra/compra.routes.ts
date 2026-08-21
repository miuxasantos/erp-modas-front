import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

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
        canActivate: [adminGuard],
        loadComponent: () =>
        import('./compra-form/compra-form.component')
            .then(c => c.CompraFormComponent),
    },
];