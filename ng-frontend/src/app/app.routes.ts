import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () => import('@ng-frontend/pages/home').then((m) => m.homeRoutes),
    },
    {
        path: 'playground',
        loadChildren: () => import('@ng-frontend/pages/playground-page').then((m) => m.playgroundRoutes),
    },
    {
        path: '',
        loadChildren: () => import('@ng-frontend/pages/play').then((m) => m.playRoutes),
    },
];
