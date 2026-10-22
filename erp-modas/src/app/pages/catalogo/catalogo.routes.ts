import { Routes } from "@angular/router";

export const catalogoRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./catalogo-list/catalogo-list.component')
                .then(c => c.CatalogoListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./catalogo-detalhe/catalogo-detalhe.component')
                .then(c => c.CatalogoDetalheComponent),
    }
]