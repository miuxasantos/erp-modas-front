import { Routes } from '@angular/router';

export const caixaRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./caixa-atual/caixa-atual.component')
        .then(c => c.CaixaAtualComponent),
  },
  {
    path: 'historico',
    loadComponent: () =>
      import('./caixa-historico/caixa-historico.component')
        .then(c => c.CaixaHistoricoComponent),
  },
  {
    path: 'historico/:id',
    loadComponent: () =>
      import('./caixa-detalhe/caixa-detalhe.component')
        .then(c => c.CaixaDetalheComponent),
  },
];