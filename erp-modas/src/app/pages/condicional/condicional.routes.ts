import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const condicionaisRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./condicional-list/condicional-list.component')
            .then(c => c.CondicionalListComponent),
    },
    {
        path: 'nova',
        loadComponent: () =>
        import('./condicional-form/condicional-form.component')
            .then(c => c.CondicionalFormComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
        import('./condicional-detalhe/condicional-detalhe.component')
            .then(c => c.CondicionalDetalheComponent),
    },
    {
        path: ':id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
        import('./condicional-form/condicional-form.component')
            .then(c => c.CondicionalFormComponent),
    },
];