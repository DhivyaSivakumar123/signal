import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="brand">SIGNAL</h1>
        <p class="tagline">Cut through the noise.</p>
        <div class="divider"></div>
        <div class="btn-group">
          <button class="login-btn login-btn--google" (click)="signInWithGoogle()">
            <svg class="login-btn__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          <button class="login-btn login-btn--microsoft" (click)="signInWithMicrosoft()">
            <svg class="login-btn__icon" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f35325" d="M0 0h11v11H0z"/>
              <path fill="#81bc06" d="M12 0h11v11H12z"/>
              <path fill="#05a6f0" d="M0 12h11v11H0z"/>
              <path fill="#ffba08" d="M12 12h11v11H12z"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>
        <p class="footer">
          Signal only reads what you connect. Nothing is stored beyond what's needed to show your feed.
        </p>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100vw;
      background-color: $bg-base;
      padding: $space-4;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    
    .brand {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      font-weight: $weight-semibold;
      letter-spacing: 0.1em;
      margin-bottom: $space-1;
    }
    
    .tagline {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
      margin-bottom: $space-6;
    }
    
    .divider {
      width: 100%;
      height: 1px;
      background-color: $border-subtle;
      margin-bottom: $space-6;
    }
    
    .btn-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: $space-3;
      margin-bottom: $space-6;
    }
    
    .login-btn {
      width: 100%;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: $space-3;
      background-color: #FFFFFF;
      color: #1F2435;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      border: 1px solid #E5E7EB;
      cursor: pointer;
      transition: background-color 150ms ease, transform 100ms ease;
      
      &:hover {
        background-color: #F9FAFB;
      }
      
      &:active {
        transform: scale(0.98);
      }
      
      &__icon {
        width: 18px;
        height: 18px;
      }
    }
    
    .footer {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-muted;
      line-height: 1.5;
    }
  `]
})
export class LoginComponent {
  private store = inject(Store);

  signInWithGoogle(): void {
    this.store.dispatch(AuthActions.loginWithGoogle());
  }

  signInWithMicrosoft(): void {
    this.store.dispatch(AuthActions.loginWithMicrosoft());
  }
}
