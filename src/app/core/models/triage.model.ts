import { Provider } from './integration.model';

export type Urgency = 'NOW' | 'TODAY' | 'THIS_WEEK' | 'FYI';
export type TriageStatus = 'UNSEEN' | 'SEEN' | 'DISMISSED' | 'FEEDBACK_NOT_URGENT' | 'FEEDBACK_WAS_URGENT';

export interface TriageItem {
  id: string;
  threadGroupId: string;
  sources: Provider[];        // multiple = cross-app dedup visible to user
  senderName: string;
  subjectOrPreview: string;
  urgency: Urgency;
  reasonSnippet: string;      // max 200 chars from backend
  receivedAt: string;         // ISO 8601
  status: TriageStatus;
}

export interface FocusSlot {
  startTime: string;          // ISO 8601
  endTime: string;
  durationMinutes: number;
}

export interface UserPreference {
  statedPriorities: string;
  digestTime: string | null;  // "14:30" format or null = off
  digestChannel: 'EMAIL' | 'SLACK' | 'NONE';
}
