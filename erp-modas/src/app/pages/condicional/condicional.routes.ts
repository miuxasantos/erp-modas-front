import { Routes } from '@angular/router';

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
        loadComponent: () =>
        import('./condicional-form/condicional-form.component')
            .then(c => c.CondicionalFormComponent),
    },
];