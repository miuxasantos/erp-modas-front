import { Routes } from "@angular/router";
import { adminGuard } from '@core/guards/admin.guard';

export const categoriaRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./categoria-list/categoria-list.component')
                .then(c => c.CategoriaListComponent),
    },
]