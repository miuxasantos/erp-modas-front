import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

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
        canActivate: [adminGuard],
        loadComponent: () =>
        import('./venda-form/venda-form.component')
            .then(c => c.VendaFormComponent),
    },
];