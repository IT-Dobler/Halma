import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () =>
            import('@ng-frontend/pages/home').then((m) => m.homeRoutes),
    },
    {
        path: '',
        loadChildren: () =>
            import('@ng-frontend/pages/play').then((m) => m.playRoutes),
    },
];
