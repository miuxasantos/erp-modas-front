import { Routes } from "@angular/router";

export const categoriaRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./categoria-list/categoria-list.component')
                .then(c => c.CategoriaListComponent),
    },
]