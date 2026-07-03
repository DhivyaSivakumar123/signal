import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TeamLoad, Recommendation } from '../models/analytics.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getTeamLoad(managerId: string, days = 30): Observable<TeamLoad> {
    return this.http.get<ApiResponse<TeamLoad>>(
      `${environment.apiUrl}/api/analytics/team-load`,
      { params: { managerId, days: days.toString() } }
    ).pipe(map(r => r.data));
  }
  getRecommendations(managerId: string): Observable<Recommendation[]> {
    return this.http.get<ApiResponse<Recommendation[]>>(
      `${environment.apiUrl}/api/analytics/recommendations`,
      { params: { managerId } }
    ).pipe(map(r => r.data));
  }
}
