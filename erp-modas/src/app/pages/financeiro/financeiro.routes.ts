import { Routes } from '@angular/router';

export const financeiroRoutes: Routes = [
    {
        path: 'caixa',
        loadChildren: () =>
        import('./caixa/caixa.route')
            .then(r => r.caixaRoutes),
    },
    {
        path: 'contas-receber',
        loadComponent: () =>
        import('./contas-receber/contas-receber.component')
            .then(c => c.ContasReceberComponent),
    },
    {
        path: 'contas-pagar',
        loadComponent: () =>
        import('./contas-pagar/contas-pagar.component')
            .then(c => c.ContasPagarComponent),
    },
];