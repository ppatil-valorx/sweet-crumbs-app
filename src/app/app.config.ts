import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_CONFIG } from './config/app-config';
//import { provideHttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
  withInterceptors([
    // Auth runs first to attach the token.
    // Loading tracks the request lifecycle.
    // Error handles HTTP failures centrally.
    authInterceptor,
    loadingInterceptor,
    errorInterceptor
  ])
),

    {
      provide: APP_CONFIG,
      useValue: {
        minSizeKg: 0.5,
        maxSizeKg: 10,
        bigOrderKg: 5,
        apiBaseUrl: 'http://localhost:3000/api'
      }
    }
  ]
};
