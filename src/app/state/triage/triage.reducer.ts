import { createReducer, on } from '@ngrx/store';
import { TriageActions } from './triage.actions';
import { TriageItem, FocusSlot, UserPreference } from '../../core/models/triage.model';

export interface TriageState {
  items: TriageItem[];
  focusSlots: FocusSlot[];
  selectedSlot: FocusSlot | null;
  preferences: UserPreference | null;
  loading: boolean;
  lastUpdated: string | null;
  error: string | null;
}

export const initialTriageState: TriageState = {
  items: [],
  focusSlots: [],
  selectedSlot: null,
  preferences: null,
  loading: false,
  lastUpdated: null,
  error: null
};

const urgencyWeights: Record<string, number> = {
  'NOW': 0,
  'TODAY': 1,
  'THIS_WEEK': 2,
  'FYI': 3
};

function sortTriageItems(items: TriageItem[]): TriageItem[] {
  return [...items].sort((a, b) => {
    const weightA = urgencyWeights[a.urgency] ?? 99;
    const weightB = urgencyWeights[b.urgency] ?? 99;
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
  });
}

export const triageReducer = createReducer(
  initialTriageState,
  on(TriageActions.loadTodayFeed, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TriageActions.loadTodayFeedSuccess, (state, { items }) => ({
    ...state,
    items: sortTriageItems(items),
    loading: false,
    lastUpdated: new Date().toISOString(),
    error: null
  })),
  on(TriageActions.loadTodayFeedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TriageActions.loadFocusSlotsSuccess, (state, { slots }) => ({
    ...state,
    focusSlots: slots
  })),
  on(TriageActions.loadPreferencesSuccess, (state, { prefs }) => ({
    ...state,
    preferences: prefs
  })),
  on(TriageActions.updatePreferencesSuccess, (state, { prefs }) => ({
    ...state,
    preferences: prefs
  })),
  on(TriageActions.submitFeedbackSuccess, (state, { id, wasUrgent }) => {
    const updatedItems = state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: wasUrgent ? ('FEEDBACK_WAS_URGENT' as const) : ('FEEDBACK_NOT_URGENT' as const)
        };
      }
      return item;
    });
    return {
      ...state,
      items: updatedItems
    };
  }),
  on(TriageActions.selectFocusSlot, (state, { slot }) => ({
    ...state,
    selectedSlot: slot
  }))
);
