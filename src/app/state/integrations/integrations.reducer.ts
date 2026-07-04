import { createReducer, on } from '@ngrx/store';
import { IntegrationsActions } from './integrations.actions';
import { Integration } from '../../core/models/integration.model';

export interface IntegrationsState {
  integrations: Integration[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialIntegrationsState: IntegrationsState = {
  integrations: [],
  loading: false,
  loaded: false,
  error: null
};

export const integrationsReducer = createReducer(
  initialIntegrationsState,
  on(IntegrationsActions.loadIntegrations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(IntegrationsActions.loadIntegrationsSuccess, (state, { integrations }) => ({
    ...state,
    integrations,
    loading: false,
    loaded: true,
    error: null
  })),
  on(IntegrationsActions.loadIntegrationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(IntegrationsActions.deleteIntegration, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(IntegrationsActions.deleteIntegrationSuccess, (state, { id }) => ({
    ...state,
    integrations: state.integrations.filter(i => i.id !== id),
    loading: false,
    error: null
  })),
  on(IntegrationsActions.deleteIntegrationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(IntegrationsActions.connectIntegration, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(IntegrationsActions.connectIntegrationSuccess, (state, { integration }) => ({
    ...state,
    integrations: [...state.integrations.filter(i => i.provider !== integration.provider), integration],
    loading: false,
    error: null
  })),
  on(IntegrationsActions.connectIntegrationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
