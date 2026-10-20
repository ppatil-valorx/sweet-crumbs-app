import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_CONFIG } from './config/app-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),

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
