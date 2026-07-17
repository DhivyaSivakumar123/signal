import { createReducer, on } from '@ngrx/store';
import { AnalyticsActions } from './analytics.actions';
import { TeamLoad, Recommendation } from '../../core/models/analytics.model';

export interface AnalyticsState {
  teamLoad: TeamLoad | null;
  recommendations: Recommendation[];
  daysFilter: number;
  loading: boolean;
  error: string | null;
}

export const initialAnalyticsState: AnalyticsState = {
  teamLoad: null,
  recommendations: [],
  daysFilter: 30,
  loading: false,
  error: null
};

export const analyticsReducer = createReducer(
  initialAnalyticsState,
  on(AnalyticsActions.loadAnalyticsDashboard, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AnalyticsActions.loadAnalyticsDashboardComplete, (state, { teamLoad, recommendations }) => ({
    ...state,
    teamLoad,
    recommendations,
    loading: false,
    error: null
  })),
  on(AnalyticsActions.loadAnalyticsDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AnalyticsActions.loadTeamLoad, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AnalyticsActions.loadTeamLoadSuccess, (state, { teamLoad }) => ({
    ...state,
    teamLoad,
    loading: false,
    error: null
  })),
  on(AnalyticsActions.loadTeamLoadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AnalyticsActions.loadRecommendations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AnalyticsActions.loadRecommendationsSuccess, (state, { recommendations }) => ({
    ...state,
    recommendations,
    loading: false,
    error: null
  })),
  on(AnalyticsActions.loadRecommendationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AnalyticsActions.setDaysFilter, (state, { days }) => ({
    ...state,
    daysFilter: days
  }))
);
