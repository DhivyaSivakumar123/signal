import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IntegrationService } from '../../core/services/integration.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { IntegrationsActions } from './integrations.actions';
import { selectIntegrations } from './integrations.selectors';
import { catchError, first, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class IntegrationsEffects {
  private actions$ = inject(Actions);
  private integrationService = inject(IntegrationService);
  private toastService = inject(ToastService);
  private store = inject(Store);

  loadIntegrations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IntegrationsActions.loadIntegrations),
      switchMap(() =>
        this.integrationService.getIntegrations().pipe(
          map((integrations) => IntegrationsActions.loadIntegrationsSuccess({ integrations })),
          catchError((error) => of(IntegrationsActions.loadIntegrationsFailure({ error: error.message })))
        )
      )
    )
  );

  deleteIntegration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IntegrationsActions.deleteIntegration),
      switchMap(({ id }) =>
        this.store.select(selectIntegrations).pipe(
          first(),
          map((list) => list.find((i) => i.id === id)),
          switchMap((integration) => {
            const providerName = integration ? integration.provider : 'Integration';
            return this.integrationService.deleteIntegration(id).pipe(
              tap(() => this.toastService.success(`Disconnected ${providerName}`)),
              map(() => IntegrationsActions.deleteIntegrationSuccess({ id })),
              catchError((error) => of(IntegrationsActions.deleteIntegrationFailure({ error: error.message })))
            );
          })
        )
      )
    )
  );

  deleteIntegrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IntegrationsActions.deleteIntegrationSuccess),
      map(() => IntegrationsActions.loadIntegrations())
    )
  );
}
