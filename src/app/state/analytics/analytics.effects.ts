import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AnalyticsActions } from './analytics.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class AnalyticsEffects {
  private actions$ = inject(Actions);
  private analyticsService = inject(AnalyticsService);

  loadTeamLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadTeamLoad),
      switchMap(({ managerId, days }) =>
        this.analyticsService.getTeamLoad(managerId, days).pipe(
          map((teamLoad) => AnalyticsActions.loadTeamLoadSuccess({ teamLoad })),
          catchError((error) => of(AnalyticsActions.loadTeamLoadFailure({ error: error.message })))
        )
      )
    )
  );

  loadRecommendations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadRecommendations),
      switchMap(({ managerId }) =>
        this.analyticsService.getRecommendations(managerId).pipe(
          map((recommendations) => AnalyticsActions.loadRecommendationsSuccess({ recommendations })),
          catchError((error) => of(AnalyticsActions.loadRecommendationsFailure({ error: error.message })))
        )
      )
    )
  );
}
