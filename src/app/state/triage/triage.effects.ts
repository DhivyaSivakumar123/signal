import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TriageService } from '../../core/services/triage.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TriageActions } from './triage.actions';
import { catchError, interval, map, of, switchMap, takeUntil, tap } from 'rxjs';

@Injectable()
export class TriageEffects {
  private actions$ = inject(Actions);
  private triageService = inject(TriageService);
  private toastService = inject(ToastService);

  loadFeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.loadTodayFeed),
      switchMap(() =>
        this.triageService.getTodayFeed().pipe(
          map((items) => TriageActions.loadTodayFeedSuccess({ items })),
          catchError((error) => of(TriageActions.loadTodayFeedFailure({ error: error.message })))
        )
      )
    )
  );

  loadFocusSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.loadFocusSlots),
      switchMap(() =>
        this.triageService.getFocusSlots().pipe(
          map((slots) => TriageActions.loadFocusSlotsSuccess({ slots })),
          catchError((error) => of(TriageActions.loadFocusSlotsFailure({ error: error.message })))
        )
      )
    )
  );

  loadPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.loadPreferences),
      switchMap(() =>
        this.triageService.getPreferences().pipe(
          map((prefs) => TriageActions.loadPreferencesSuccess({ prefs })),
          catchError((error) => of(TriageActions.loadPreferencesFailure({ error: error.message })))
        )
      )
    )
  );

  updatePreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.updatePreferences),
      switchMap(({ prefs }) =>
        this.triageService.updatePreferences(prefs).pipe(
          tap(() => this.toastService.success('Preferences saved')),
          map(() => TriageActions.updatePreferencesSuccess({ prefs })),
          catchError((error) => of(TriageActions.updatePreferencesFailure({ error: error.message })))
        )
      )
    )
  );

  submitFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.submitFeedback),
      switchMap(({ id, wasUrgent }) =>
        this.triageService.submitFeedback(id, wasUrgent).pipe(
          tap(() => this.toastService.success("Got it — we'll adjust future scoring.")),
          map(() => TriageActions.submitFeedbackSuccess({ id, wasUrgent })),
          catchError((error) => of(TriageActions.submitFeedbackFailure({ id, error: error.message })))
        )
      )
    )
  );

  polling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriageActions.startPolling),
      switchMap(() =>
        interval(90000).pipe(
          switchMap(() =>
            this.triageService.getTodayFeed().pipe(
              map((items) => TriageActions.loadTodayFeedSuccess({ items })),
              catchError((error) => of(TriageActions.loadTodayFeedFailure({ error: error.message })))
            )
          ),
          takeUntil(this.actions$.pipe(ofType(TriageActions.stopPolling)))
        )
      )
    )
  );
}
