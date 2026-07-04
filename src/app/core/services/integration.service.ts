import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Integration } from '../models/integration.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private http = inject(HttpClient);

  getIntegrations(): Observable<Integration[]> {
    return this.http.get<ApiResponse<Integration[]>>(`${environment.apiUrl}/api/integrations`)
      .pipe(map(r => r.data));
  }

  // These perform standard API POST requests to connect integrations
  connectSlack(): Observable<Integration> {
    return this.http.post<ApiResponse<Integration>>(`${environment.apiUrl}/api/integrations/slack/connect`, {})
      .pipe(map(r => r.data));
  }
  connectGmail(): Observable<never> {
    const token = localStorage.getItem('signal_access_token');
    window.location.href = `${environment.apiUrl}/api/integrations/oauth2/authorize/google?token=${token}&scope=gmail`;
    return new Observable<never>(); // Using standard RxJS Observable
  }
  connectOutlook(): Observable<Integration> {
    return this.http.post<ApiResponse<Integration>>(`${environment.apiUrl}/api/integrations/outlook/connect`, {})
      .pipe(map(r => r.data));
  }
  connectCalendar(): Observable<never> {
    const token = localStorage.getItem('signal_access_token');
    window.location.href = `${environment.apiUrl}/api/integrations/oauth2/authorize/google?token=${token}&scope=calendar`;
    return new Observable<never>(); // Using standard RxJS Observable
  }

  deleteIntegration(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/integrations/${id}`);
  }
}
