import { Routes } from "@angular/router";

export const tamanhosRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tamanho-list/tamanho-list.component')
                .then(c => c.TamanhoListComponent),
    }
]