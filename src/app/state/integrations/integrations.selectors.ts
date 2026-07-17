import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IntegrationsState } from './integrations.reducer';

export const selectIntegrationsState = createFeatureSelector<IntegrationsState>('integrations');

export const selectIntegrations = createSelector(
  selectIntegrationsState,
  (state: IntegrationsState) => state.integrations
);

export const selectActiveIntegrations = createSelector(
  selectIntegrations,
  (integrations) => integrations.filter((i) => i.status === 'ACTIVE')
);

export const selectIntegrationsLoading = createSelector(
  selectIntegrationsState,
  (state: IntegrationsState) => state.loading
);

export const selectIntegrationsLoaded = createSelector(
  selectIntegrationsState,
  (state: IntegrationsState) => state.loaded
);

export const selectIntegrationsError = createSelector(
  selectIntegrationsState,
  (state: IntegrationsState) => state.error
);
