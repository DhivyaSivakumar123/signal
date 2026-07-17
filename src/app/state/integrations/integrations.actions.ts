import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Integration } from '../../core/models/integration.model';

export const IntegrationsActions = createActionGroup({
  source: 'Integrations',
  events: {
    'Load Integrations': emptyProps(),
    'Load Integrations Success': props<{ integrations: Integration[] }>(),
    'Load Integrations Failure': props<{ error: string }>(),
    'Delete Integration': props<{ id: string }>(),
    'Delete Integration Success': props<{ id: string }>(),
    'Delete Integration Failure': props<{ error: string }>(),
    'Connect Integration': props<{ provider: string }>(),
    'Connect Integration Success': props<{ integration: Integration }>(),
    'Connect Integration Failure': props<{ error: string }>(),
    'Sync Integrations': emptyProps(),
    'Sync Integrations Success': emptyProps(),
    'Sync Integrations Failure': props<{ error: string }>()
  }
});
