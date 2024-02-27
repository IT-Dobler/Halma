import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';
import {NgxsModule} from "@ngxs/store";
import {appRoutes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
        NgxsModule.forRoot([], {
          developmentMode: isDevMode(),
          selectorOptions: {
            // These selectorOptions are recommended in preparation for NGXS v4
            suppressErrors: false,
            injectContainerState: false,
          }
        })
    )
  ],
};
