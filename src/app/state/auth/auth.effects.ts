import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithGoogle),
      tap(() => this.authService.loginWithGoogle())
    ),
    { dispatch: false }
  );

  loginWithMicrosoft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithMicrosoft),
      tap(() => this.authService.loginWithMicrosoft())
    ),
    { dispatch: false }
  );

  oauthCallback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.oAuthCallbackReceived),
      switchMap(({ code, state }) =>
        this.authService.handleCallback({ code, state }).pipe(
          tap((tokens) => this.authService.storeTokens(tokens)),
          switchMap((tokens) =>
            this.authService.getCurrentUser().pipe(
              map((user) => AuthActions.oAuthCallbackSuccess({ tokens, user })),
              catchError((error) => of(AuthActions.oAuthCallbackFailure({ error: error.message })))
            )
          ),
          catchError((error) => of(AuthActions.oAuthCallbackFailure({ error: error.message })))
        )
      )
    )
  );

  oauthCallbackSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.oAuthCallbackSuccess),
      tap(({ tokens }) => {
        this.authService.storeTokens(tokens);
        this.router.navigate(['/app/triage']);
      })
    ),
    { dispatch: false }
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map((user) => AuthActions.loadCurrentUserSuccess({ user })),
          catchError((error) => {
            this.authService.clearTokens();
            return of(AuthActions.loadCurrentUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          catchError(() => of(undefined)),
          tap(() => {
            this.authService.clearTokens();
            this.router.navigate(['/login']);
          }),
          map(() => AuthActions.logoutSuccess())
        )
      )
    )
  );
}
