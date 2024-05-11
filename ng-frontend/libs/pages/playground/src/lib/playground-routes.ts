import { Route } from '@angular/router';
import { PlaygroundPageComponent } from './playground-page/playground-page.component';

export const playgroundRoutes: Route[] = [
    {
        path: '',
        title: 'playground.browser-title',
        component: PlaygroundPageComponent,
    },
];
