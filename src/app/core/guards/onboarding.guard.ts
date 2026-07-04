import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { selectActiveIntegrations, selectIntegrationsLoaded } from '../../state/integrations/integrations.selectors';
import { first, map, switchMap, filter, tap } from 'rxjs';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  if (!store.select) return true;

  store.dispatch(IntegrationsActions.loadIntegrations());

  return store.select(selectIntegrationsLoaded).pipe(
    filter((loaded) => loaded),
    first(),
    switchMap(() => store.select(selectActiveIntegrations).pipe(first())),
    map((activeIntegrations) => {
      if (activeIntegrations.length > 0) {
        return true;
      }
      router.navigate(['/onboarding']);
      return false;
    })
  );
};
