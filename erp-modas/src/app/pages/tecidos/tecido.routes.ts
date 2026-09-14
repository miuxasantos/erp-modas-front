import { Routes } from "@angular/router";

export const tecidosRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tecido-list/tecido-list.component')
                .then(c => c.TecidoListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./tecido-detalhe/tecido-detalhe.component')
                .then(c => c.TecidoDetalheComponent)
    }
]