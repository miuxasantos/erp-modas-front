// pages/relatorios/relatorios.routes.ts
import { Routes } from '@angular/router';

// O adminGuard fica na rota pai (app.routes.ts), então vale para todos os relatórios
export const relatoriosRoutes: Routes = [
    {
        path: 'vendas',
        loadComponent: () =>
            import('./venda/relatorio-vendas.component')
                .then(c => c.RelatorioVendasComponent),
    },
    // Próximos, no mesmo formato:
    // { path: 'vendas-agrupadas',        loadComponent: ... },
    // { path: 'compras',                 loadComponent: ... },
    // { path: 'compras-mais-produtos',   loadComponent: ... },
    // { path: 'fornecedores',            loadComponent: ... },
    // { path: 'estoque',                 loadComponent: ... },
    // { path: 'financeiro',              loadComponent: ... },
    // { path: 'fiscal',                  loadComponent: ... },
];