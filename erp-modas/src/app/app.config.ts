import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { registerLocaleData } from '@angular/common';
import Aura from '@primeuix/themes/aura';
import localePt from '@angular/common/locales/pt';
import { configurarApexCharts } from './core/config/apexcharts.config';

registerLocaleData(localePt);


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        authInterceptor,   // 1º — adiciona o token
        errorInterceptor,  // 2º — trata os erros
        loadingInterceptor // 3º — controla o loading
      ])
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
      ripple: true,
    }),
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    provideAppInitializer(() => configurarApexCharts()),
    MessageService,
    ConfirmationService, 
  ]
};
