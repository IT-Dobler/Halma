import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@ng-frontend/play').then((m) => m.playRoutes),
  },
];
