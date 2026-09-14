import { Routes } from "@angular/router";

export const marcasRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./marca-list/marca-list.component')
                .then(c => c.MarcaListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./marca-detalhe/marca-detalhe.component')
                .then(c => c.MarcaDetalheComponent)
    }
]