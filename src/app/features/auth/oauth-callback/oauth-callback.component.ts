import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="spinner"></div>
      <p class="message">Signing you in...</p>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100vw;
      background-color: $bg-base;
      gap: $space-4;
    }
    
    .message {
      font-family: $font-body;
      font-size: $text-base;
      color: $text-secondary;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba($border-subtle, 0.5);
      border-radius: 50%;
      border-top-color: $border-focus;
      animation: spin 800ms linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  ngOnInit(): void {
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];

    if (code && state) {
      this.store.dispatch(AuthActions.oAuthCallbackReceived({ code, state }));
    } else {
      this.store.dispatch(AuthActions.oAuthCallbackFailure({ error: 'Missing code or state parameters' }));
    }
  }
}
