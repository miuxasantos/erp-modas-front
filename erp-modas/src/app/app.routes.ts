import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () =>
            import('./layouts/main-layout/main-layout.component')
                .then(c => c.MainLayoutComponent),
        children: [
            {
                path: '/dashboard',
            }
        ]
    }
];
