import { Routes } from "@angular/router";

export const clientesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./categoria-list/categoria-list.component')
                .then(c => c.CategoriaListComponent),
    },
]