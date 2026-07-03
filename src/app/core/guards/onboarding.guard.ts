import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { selectActiveIntegrations, selectIntegrationsLoaded } from '../../state/integrations/integrations.selectors';
import { first, map, switchMap, tap } from 'rxjs';
import { IntegrationService } from '../services/integration.service';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const integrationService = inject(IntegrationService);

  return store.select(selectIntegrationsLoaded).pipe(
    first(),
    switchMap((loaded) => {
      if (loaded) {
        return store.select(selectActiveIntegrations).pipe(first());
      } else {
        return integrationService.getIntegrations().pipe(
          tap((integrations) => {
            store.dispatch(IntegrationsActions.loadIntegrationsSuccess({ integrations }));
          }),
          map((integrations) => integrations.filter(i => i.status === 'ACTIVE'))
        );
      }
    }),
    map((activeIntegrations) => {
      if (activeIntegrations.length > 0) {
        return true;
      }
      router.navigate(['/onboarding']);
      return false;
    })
  );
};
