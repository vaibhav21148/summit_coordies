import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  InMemoryScrollingOptions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  authHeaderInterceptor,
  expiredSessionInterceptor,
} from '@services/interceptor.interceptor';

import { routes } from './app.routes';

const scrollingOptions: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling(scrollingOptions)),
    provideHttpClient(
      withInterceptors([authHeaderInterceptor, expiredSessionInterceptor])
    ),
    provideAnimationsAsync(),
  ],
};
