import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';


export const caixaRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./caixa-atual/caixa-atual.component')
        .then(c => c.CaixaAtualComponent),
  },
  {
    path: 'historico',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./caixa-historico/caixa-historico.component')
        .then(c => c.CaixaHistoricoComponent),
  },
  {
    path: 'historico/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./caixa-detalhe/caixa-detalhe.component')
        .then(c => c.CaixaDetalheComponent),
  },
];