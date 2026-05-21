import { Routes } from "@angular/router";

export const fornecedorRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./fornecedor-list/fornecedor-list.component')
                .then(c => c.FornecedorListComponent),
    },
]