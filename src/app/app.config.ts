import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { authReducer } from './state/auth/auth.reducer';
import { integrationsReducer } from './state/integrations/integrations.reducer';
import { triageReducer } from './state/triage/triage.reducer';
import { analyticsReducer } from './state/analytics/analytics.reducer';

import { AuthEffects } from './state/auth/auth.effects';
import { IntegrationsEffects } from './state/integrations/integrations.effects';
import { TriageEffects } from './state/triage/triage.effects';
import { AnalyticsEffects } from './state/analytics/analytics.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideStore({
      auth: authReducer,
      integrations: integrationsReducer,
      triage: triageReducer,
      analytics: analyticsReducer
    }),
    provideEffects([
      AuthEffects,
      IntegrationsEffects,
      TriageEffects,
      AnalyticsEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};
