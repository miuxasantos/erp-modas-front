import { Routes } from "@angular/router";

export const catalogoRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./catalogo-list/catalogo-list.component')
                .then(c => c.CatalogoListComponent),
    },
]