import { Routes } from "@angular/router";

export const coresRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./cor-list/cor-list.component')
                .then(c => c.CorListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./cor-detalhe/cor-detalhe.component')
                .then(c => c.CorDetalheComponent)
    }
]