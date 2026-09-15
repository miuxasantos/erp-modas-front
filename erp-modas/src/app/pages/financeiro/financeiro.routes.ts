import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const financeiroRoutes: Routes = [
    {
        path: 'caixa',
        loadChildren: () =>
        import('./caixa/caixa.route')
            .then(r => r.caixaRoutes),
    },
    {
        path: 'contas-receber',
        canActivate: [adminGuard],
        loadComponent: () =>
        import('./contas-receber/contas-receber.component')
            .then(c => c.ContasReceberComponent),
    },
    {
        path: 'contas-pagar',
        canActivate: [adminGuard],
        loadComponent: () =>
        import('./contas-pagar/contas-pagar.component')
            .then(c => c.ContasPagarComponent),
    },
];