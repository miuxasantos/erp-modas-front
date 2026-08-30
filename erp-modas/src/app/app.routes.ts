import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from '@core/guards/admin.guard';

export const routes: Routes = [
    {
        path: 'catalogo',
        loadComponent: () =>
            import('./layouts/public/public-layout.component')
                .then(c => c.PublicLayoutComponent),
        children: [
            {
                path: '',
            }
        ]
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layouts/main-layout/main-layout.component')
                .then(c => c.MainLayoutComponent),
        children: [
            {
                path: 'produtos',
                loadChildren: () =>
                    import('./pages/produto/produto.routes')
                        .then(m => m.produtosRoutes)
            },
            {
                path: 'categorias',
                loadChildren: () =>
                    import('./pages/categoria/categoria.routes')
                        .then(m => m.categoriaRoutes)
            },
            {
                path: 'cores',
                loadChildren: () =>
                    import('./pages/cores/cor.routes')
                        .then(m => m.coresRoutes)
            },
            {
                path: 'tamanhos',
                loadChildren: () =>
                    import('./pages/tamanhos/tamanho.routes')
                        .then(m => m.tamanhosRoutes)
            },
            {
                path: 'usuarios',
                canActivate: [adminGuard],
                loadChildren: () =>
                    import('./pages/usuarios/usuario.routes')
                        .then(m => m.usuariosRoutes)
            },
            {
                path: 'fornecedores',
                loadChildren: () =>
                    import('./pages/fornecedor/fornecedor.routes')
                        .then(m => m.fornecedorRoutes)
            },
            {
                path: 'clientes',
                loadChildren: () =>
                    import('./pages/clientes/cliente.routes')
                        .then(m => m.clientesRoutes)
            },
            {
                path: 'vendas',
                loadChildren: () =>
                    import('./pages/venda/venda.routes')
                        .then(m => m.vendasRoutes)
            },
            {
                path: 'compras',
                loadChildren: () =>
                    import('./pages/compra/compra.routes')
                        .then(m => m.comprasRoutes)
            },
            {
                path: 'condicionais',
                loadChildren: () =>
                    import('./pages/condicional/condicional.routes')
                        .then(m => m.condicionaisRoutes)
            },
            {
                path: 'financeiro',
                canActivate: [adminGuard],
                loadChildren: () =>
                    import('./pages/financeiro/financeiro.routes')
                        .then(m => m.financeiroRoutes)
            }
        ]
    }
];
