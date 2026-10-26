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
    {
        path: 'vendas-agrupadas',
        loadComponent: () =>
            import('./venda-agrupada/relatorio-vendas-agrupadas.component')
                .then(c => c.RelatorioVendasAgrupadasComponent)
    },
    {
        path: 'compras',
        loadComponent: () =>
            import('./compra/relatorio-compras.component')
                .then(c => c.RelatorioComprasComponent)
    },
    {
        path: 'compras-mais-produtos',
        loadComponent: () =>
            import('./compra-mais-produtos/relatorio-compras-mais-produtos.component')
                .then(c => c.RelatorioComprasMaisProdutosComponent)
    },
    {
        path: 'fornecedores',
        loadComponent: () =>
            import('./fornecedores/relatorio-fornecedores.component')
                .then(c => c.RelatorioFornecedoresComponent)
    },
    {
        path: 'estoque',
        loadComponent: () =>
            import('./estoque/relatorio-estoque.component')
                .then(c => c.RelatorioEstoqueComponent)
    },
    {
        path: 'financeiro',
        loadComponent: () =>
            import('./financeiro/relatorio-financeiro.component')
                .then(c => c.RelatorioFinanceiroComponent)
    },
    {
        path: 'fiscal',
        loadComponent: () =>
            import('./fiscal/relatorio-fiscal.component')
                .then(c => c.RelatorioFiscalComponent)
    },
];