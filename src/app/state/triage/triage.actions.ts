import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TriageItem, FocusSlot, UserPreference } from '../../core/models/triage.model';

export const TriageActions = createActionGroup({
  source: 'Triage',
  events: {
    'Load Today Feed': emptyProps(),
    'Load Today Feed Success': props<{ items: TriageItem[] }>(),
    'Load Today Feed Failure': props<{ error: string }>(),
    
    'Load Focus Slots': emptyProps(),
    'Load Focus Slots Success': props<{ slots: FocusSlot[] }>(),
    'Load Focus Slots Failure': props<{ error: string }>(),
    
    'Submit Feedback': props<{ id: string; wasUrgent: boolean }>(),
    'Submit Feedback Success': props<{ id: string; wasUrgent: boolean }>(),
    'Submit Feedback Failure': props<{ id: string; error: string }>(),
    
    'Load Preferences': emptyProps(),
    'Load Preferences Success': props<{ prefs: UserPreference }>(),
    'Load Preferences Failure': props<{ error: string }>(),
    
    'Update Preferences': props<{ prefs: UserPreference }>(),
    'Update Preferences Success': props<{ prefs: UserPreference }>(),
    'Update Preferences Failure': props<{ error: string }>(),
    
    'Start Polling': emptyProps(),
    'Stop Polling': emptyProps(),
    'Select Focus Slot': props<{ slot: FocusSlot | null }>()
  }
});
