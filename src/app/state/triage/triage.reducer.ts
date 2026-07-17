import { createReducer, on } from '@ngrx/store';
import { TriageActions } from './triage.actions';
import { TriageItem, FocusSlot, UserPreference, TriageStatus } from '../../core/models/triage.model';

export interface TriageState {
  items: TriageItem[];
  focusSlots: FocusSlot[];
  selectedSlot: FocusSlot | null;
  preferences: UserPreference | null;
  loading: boolean;
  lastUpdated: string | null;
  error: string | null;
  submittingFeedback: string[];
}

export const initialTriageState: TriageState = {
  items: [],
  focusSlots: [],
  selectedSlot: null,
  preferences: null,
  loading: false,
  lastUpdated: null,
  error: null,
  submittingFeedback: []
};

const urgencyWeights: Record<string, number> = {
  'NOW': 0,
  'TODAY': 1,
  'THIS_WEEK': 2,
  'FYI': 3
};

const PRESERVED_STATUSES: TriageStatus[] = ['FEEDBACK_WAS_URGENT', 'FEEDBACK_NOT_URGENT'];

function mergeItems(existing: TriageItem[], incoming: any[]): TriageItem[] {
  const existingMap = new Map(existing.map(i => [i.id, i]));
  const merged = incoming.map(item => {
    const sourceVal = item.source || 'GMAIL';
    const sourcesVal = item.sources && item.sources.length > 0 ? item.sources : [sourceVal];
    
    let sName = item.senderName;
    if (!sName && item.senderId) {
      if (item.senderId.includes('@')) {
        sName = item.senderId.split('@')[0];
        sName = sName.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      } else {
        sName = item.senderId;
      }
    }
    if (!sName) sName = 'Automated Sender';

    let subPreview = item.subjectOrPreview;
    if (!subPreview) {
      subPreview = item.reasonSnippet || 'No Subject';
    }

    const enrichedItem: TriageItem = {
      ...item,
      sources: sourcesVal,
      senderName: sName,
      subjectOrPreview: subPreview,
      reasonSnippet: item.reasonSnippet || 'Auto-categorized message'
    };

    const existingItem = existingMap.get(item.id);
    if (existingItem && PRESERVED_STATUSES.includes(existingItem.status)) {
      return { ...enrichedItem, status: existingItem.status };
    }
    return enrichedItem;
  });
  return sortTriageItems(merged);
}

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
    items: mergeItems(state.items, items),
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
    focusSlots: slots,
    loading: false,
    error: null
  })),
  on(TriageActions.loadFocusSlotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TriageActions.loadPreferencesSuccess, (state, { prefs }) => ({
    ...state,
    preferences: prefs,
    loading: false,
    error: null
  })),
  on(TriageActions.loadPreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TriageActions.updatePreferencesSuccess, (state, { prefs }) => ({
    ...state,
    preferences: prefs,
    loading: false,
    error: null
  })),
  on(TriageActions.updatePreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TriageActions.submitFeedback, (state, { id }) => ({
    ...state,
    submittingFeedback: [...state.submittingFeedback, id]
  })),
  on(TriageActions.submitFeedbackFailure, (state, { id, error }) => ({
    ...state,
    submittingFeedback: state.submittingFeedback.filter(sid => sid !== id),
    error
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
      items: updatedItems,
      submittingFeedback: state.submittingFeedback.filter(sid => sid !== id)
    };
  }),
  on(TriageActions.selectFocusSlot, (state, { slot }) => ({
    ...state,
    selectedSlot: slot
  }))
);
