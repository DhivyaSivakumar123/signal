import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TriageState } from './triage.reducer';
import { Urgency } from '../../core/models/triage.model';

export const selectTriageState = createFeatureSelector<TriageState>('triage');

export const selectTriageItems = createSelector(
  selectTriageState,
  (state: TriageState) => state.items
);

export const selectFocusSlots = createSelector(
  selectTriageState,
  (state: TriageState) => state.focusSlots
);

export const selectPreferences = createSelector(
  selectTriageState,
  (state: TriageState) => state.preferences
);

export const selectTriageLoading = createSelector(
  selectTriageState,
  (state: TriageState) => state.loading
);

export const selectItemsByUrgency = (urgency: Urgency) => createSelector(
  selectTriageItems,
  (items) => items.filter((item) => item.urgency === urgency)
);

export const selectNowCount = createSelector(
  selectTriageItems,
  (items) => items.filter((item) => item.urgency === 'NOW' && item.status !== 'DISMISSED' && item.status !== 'FEEDBACK_NOT_URGENT').length
);

export const selectTodayCount = createSelector(
  selectTriageItems,
  (items) => items.filter((item) => item.urgency === 'TODAY' && item.status !== 'DISMISSED' && item.status !== 'FEEDBACK_NOT_URGENT').length
);

export const selectWeekCount = createSelector(
  selectTriageItems,
  (items) => items.filter((item) => item.urgency === 'THIS_WEEK' && item.status !== 'DISMISSED' && item.status !== 'FEEDBACK_NOT_URGENT').length
);

export const selectFyiCount = createSelector(
  selectTriageItems,
  (items) => items.filter((item) => item.urgency === 'FYI' && item.status !== 'DISMISSED' && item.status !== 'FEEDBACK_NOT_URGENT').length
);

export const selectSelectedSlot = createSelector(
  selectTriageState,
  (state) => state.selectedSlot
);
