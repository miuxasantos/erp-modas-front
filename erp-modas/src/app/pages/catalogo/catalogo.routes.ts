import { Routes } from "@angular/router";

export const categoriaRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./catalogo-list/catalogo-list.component')
                .then(c => c.CatalogoListComponent),
    },
]