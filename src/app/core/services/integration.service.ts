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

  // These redirect the browser to the backend OAuth flow
  connectSlack(): void    { window.location.href = `${environment.apiUrl}/api/integrations/slack/connect`; }
  connectGmail(): void    { window.location.href = `${environment.apiUrl}/api/integrations/gmail/connect`; }
  connectOutlook(): void  { window.location.href = `${environment.apiUrl}/api/integrations/outlook/connect`; }
  connectCalendar(): void { window.location.href = `${environment.apiUrl}/api/integrations/calendar/connect`; }

  deleteIntegration(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/integrations/${id}`);
  }
}
