import { Routes } from "@angular/router";

export const auditoriaRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./auditoria-list/auditoria.component')
                .then(c => c.AuditoriaComponent),
    },
]