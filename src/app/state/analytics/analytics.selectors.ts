import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalyticsState } from './analytics.reducer';

export const selectAnalyticsState = createFeatureSelector<AnalyticsState>('analytics');

export const selectTeamLoad = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.teamLoad
);

export const selectRecommendations = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.recommendations
);

export const selectDaysFilter = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.daysFilter
);

export const selectAnalyticsLoading = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.loading
);

export const selectAnalyticsError = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.error
);
