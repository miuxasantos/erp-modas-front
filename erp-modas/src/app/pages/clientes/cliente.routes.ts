import { Routes } from "@angular/router";

export const clientesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./cliente-list/cliente-list.component')
                .then(c => c.ClienteListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./cliente-detalhe/cliente-detalhe.component')
                .then(c => c.ClienteDetalheComponent)
    }
]