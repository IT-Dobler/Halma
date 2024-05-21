import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApi } from '../../libs/generated-api-client/src/lib/api.provider';

const disableAnimations: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideHttpClient(withXsrfConfiguration({ cookieName: 'csrftoken', headerName: 'X-CSRFTOKEN' })),
        importProvidersFrom(
            TranslateModule.forRoot({
                useDefaultLang: false, // easier to notice missing translations
                loader: {
                    provide: TranslateLoader,
                    useFactory: () => {
                        console.log('Hey');
                        return new TranslateHttpLoader(inject(HttpClient), './assets/i18n/', '.json');
                    },
                },
            })
        ),

        provideApi(),

        !disableAnimations ? provideAnimations() : provideNoopAnimations(),
        // TODO provideI18nTitleStrategy(),
    ],
};
