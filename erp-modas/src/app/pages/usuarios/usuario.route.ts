import { Routes } from "@angular/router";

export const usuariosRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./usuario-list/usuario-list.component')
                .then(c => c.UsuarioListComponent),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./usuario-detalhe/usuario-detalhe.component')
                .then(c => c.UsuarioDetalheComponent)
    }
]