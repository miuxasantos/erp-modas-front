import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';


export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-page/dashboard.compontent')
        .then(c => c.DashboardComponent),
  },
];