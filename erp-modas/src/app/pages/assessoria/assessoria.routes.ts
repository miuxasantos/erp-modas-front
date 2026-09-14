import { Routes } from "@angular/router";

export const assessoriaRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./assessoria-list/assessoria-list.component')
                .then(c => c.AssessoriaListComponent),
    },
]