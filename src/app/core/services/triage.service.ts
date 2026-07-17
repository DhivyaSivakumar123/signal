import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TriageItem, FocusSlot, UserPreference } from '../models/triage.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TriageService {
  private http = inject(HttpClient);

  getTodayFeed(): Observable<TriageItem[]> {
    return this.http.get<ApiResponse<TriageItem[]>>(`${environment.apiUrl}/api/triage/today`)
      .pipe(map(r => r.data));
  }
  getFocusSlots(): Observable<FocusSlot[]> {
    return this.http.get<ApiResponse<FocusSlot[]>>(`${environment.apiUrl}/api/triage/focus-slots`)
      .pipe(map(r => r.data));
  }
  submitFeedback(id: string, wasUrgent: boolean): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/triage/items/${id}/feedback`, { wasUrgent });
  }
  getPreferences(): Observable<UserPreference> {
    return this.http.get<ApiResponse<UserPreference>>(`${environment.apiUrl}/api/triage/preferences`)
      .pipe(map(r => r.data));
  }
  updatePreferences(prefs: UserPreference): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/triage/preferences`, prefs);
  }
  sendDigestNow(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/triage/digest/send-now`, {});
  }
}
