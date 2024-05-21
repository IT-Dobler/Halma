import { Route } from '@angular/router';
import { PlayPageComponent } from './play-page/play-page.component';

export const playRoutes: Route[] = [
    {
        path: ':gameCode',
        title: 'play.browser-title',
        component: PlayPageComponent,
    },
];
