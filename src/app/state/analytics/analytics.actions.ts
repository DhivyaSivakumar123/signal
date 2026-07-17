import { createActionGroup, props } from '@ngrx/store';
import { TeamLoad, Recommendation } from '../../core/models/analytics.model';

export const AnalyticsActions = createActionGroup({
  source: 'Analytics',
  events: {
    'Load Analytics Dashboard': props<{ managerId: string; days: number }>(),
    'Load Team Load': props<{ managerId: string; days: number }>(),
    'Load Team Load Success': props<{ teamLoad: TeamLoad }>(),
    'Load Team Load Failure': props<{ error: string }>(),
    
    'Load Recommendations': props<{ managerId: string }>(),
    'Load Recommendations Success': props<{ recommendations: Recommendation[] }>(),
    'Load Recommendations Failure': props<{ error: string }>(),
    
    'Load Analytics Dashboard Complete': props<{ teamLoad: TeamLoad; recommendations: Recommendation[] }>(),
    'Load Analytics Dashboard Failure': props<{ error: string }>(),
    
    'Set Days Filter': props<{ days: number }>()
  }
});
