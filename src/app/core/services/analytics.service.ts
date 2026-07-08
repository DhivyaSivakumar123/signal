import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TeamLoad, TeamLoadBucket, Recommendation } from '../models/analytics.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getTeamLoad(managerId: string, days = 30): Observable<TeamLoad> {
    return this.http.get<ApiResponse<any[]>>(
      `${environment.apiUrl}/api/analytics/team-load`,
      { params: { managerId, days: days.toString() } }
    ).pipe(map(r => {
      const buckets: TeamLoadBucket[] = (r.data || []).map((rec: any) => ({
        source: rec.source,
        hourBucket: rec.hourBucket,
        count: rec.totalCount ?? rec.count ?? 0   // backend uses totalCount
      }));
      return { data: buckets, fromDate: '', toDate: '' } as TeamLoad;
    }));
  }

  getRecommendations(managerId: string): Observable<Recommendation[]> {
    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrl}/api/analytics/recommendations`,
      { params: { managerId } }
    ).pipe(map(r => {
      const raw: any = r.data;
      // Backend returns List<String> — wrap each string into a Recommendation
      if (Array.isArray(raw)) {
        return raw.map((item: any, idx: number): Recommendation => {
          if (typeof item === 'string') {
            return { id: String(idx), text: item, patternDescription: 'Detected from communication patterns' };
          }
          // already a proper object
          return { id: item.id ?? String(idx), text: item.text ?? item, patternDescription: item.patternDescription ?? '' };
        });
      }
      return [];
    }));
  }
}

