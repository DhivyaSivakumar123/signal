import { createReducer, on } from '@ngrx/store';
import { User, AuthTokens } from '../../core/models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginWithGoogle, AuthActions.loginWithMicrosoft, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.oAuthCallbackReceived, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.oAuthCallbackSuccess, (state, { tokens, user }) => ({
    ...state,
    tokens,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.oAuthCallbackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.refreshTokenSuccess, (state, { tokens }) => ({
    ...state,
    tokens
  })),
  on(AuthActions.refreshTokenFailure, AuthActions.logoutSuccess, () => initialAuthState),
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user
  }))
);
