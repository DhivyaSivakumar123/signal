import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, AuthTokens } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login With Google': emptyProps(),
    'Login With Microsoft': emptyProps(),
    'OAuth Callback Received': props<{ code: string; state: string }>(),
    'OAuth Callback Success': props<{ tokens: AuthTokens; user: User }>(),
    'OAuth Callback Failure': props<{ error: string }>(),
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ tokens: AuthTokens }>(),
    'Refresh Token Failure': emptyProps(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Load Current User Success': props<{ user: User }>(),
  }
});
