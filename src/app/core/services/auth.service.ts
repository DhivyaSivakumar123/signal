import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthTokens } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Redirect browser to backend OAuth entry — no Observable needed
  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorize/google`;
  }
  loginWithMicrosoft(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorize/microsoft`;
  }

  // Called by OAuthCallbackComponent after redirect returns with ?code=&state=
  // Backend handles code exchange and returns tokens in the redirect URL params
  handleCallback(params: { code: string; state: string }): Observable<AuthTokens> {
    // POST /api/auth/callback — backend exchanges the code and returns tokens
    return this.http.post<ApiResponse<AuthTokens>>(`${environment.apiUrl}/api/auth/callback`, params)
      .pipe(map(r => r.data));
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<ApiResponse<AuthTokens>>(`${environment.apiUrl}/api/auth/refresh`, { refreshToken })
      .pipe(map(r => r.data));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/api/me`)
      .pipe(map(r => r.data));
  }

  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<void>(`${environment.apiUrl}/api/auth/logout`, { refreshToken });
  }

  // Token helpers — store access token in localStorage
  storeTokens(tokens: AuthTokens): void {
    if (tokens.accessToken) {
      localStorage.setItem('signal_access_token', tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem('signal_refresh_token', tokens.refreshToken);
    }
  }
  getAccessToken(): string | null { return localStorage.getItem('signal_access_token'); }
  getRefreshToken(): string | null { return localStorage.getItem('signal_refresh_token'); }
  clearTokens(): void {
    localStorage.removeItem('signal_access_token');
    localStorage.removeItem('signal_refresh_token');
  }
}
