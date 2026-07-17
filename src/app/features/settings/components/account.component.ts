import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { selectUser } from '../../../state/auth/auth.selectors';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="account-card" *ngIf="user">
      <!-- Profile Header Summary -->
      <div class="account-header">
        <div class="account-avatar">
          <img *ngIf="user.pictureUrl" [src]="user.pictureUrl" referrerpolicy="no-referrer" class="avatar-img" [alt]="user.name" />
          <div *ngIf="!user.pictureUrl" class="avatar-initials">{{ userInitials }}</div>
        </div>
        <div class="account-meta">
          <h3 class="account-name">{{ user.name }}</h3>
        </div>
      </div>

      <!-- Profile Grid Details -->
      <div class="profile-grid">
        <div class="profile-item">
          <div class="profile-item__icon">
            <mat-icon>mail_outline</mat-icon>
          </div>
          <div class="profile-item__content">
            <span class="label">Email Address</span>
            <span class="value">{{ user.email }}</span>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item__icon">
            <mat-icon>corporate_fare</mat-icon>
          </div>
          <div class="profile-item__content">
            <span class="label">Organization ID</span>
            <span class="value font-mono">{{ user.orgId || 'Default Organization' }}</span>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item__icon">
            <mat-icon>lock_open</mat-icon>
          </div>
          <div class="profile-item__content">
            <span class="label">Authentication Provider</span>
            <div class="provider-value">
              <!-- Inline Google logo if provider is Google -->
              <span *ngIf="user.oauthProvider === 'GOOGLE'" class="provider-badge provider-badge--google">
                <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Google Account
              </span>
              <!-- Inline Microsoft logo if provider is Microsoft -->
              <span *ngIf="user.oauthProvider === 'MICROSOFT'" class="provider-badge provider-badge--microsoft">
                <svg viewBox="0 0 23 23" class="brand-svg"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="12" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="12" width="10" height="10" fill="#00A4EF"/><rect x="12" y="12" width="10" height="10" fill="#FFB900"/></svg>
                Microsoft Account
              </span>
              <span *ngIf="user.oauthProvider !== 'GOOGLE' && user.oauthProvider !== 'MICROSOFT'" class="value">
                {{ user.oauthProvider | titlecase }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .account-card {
      padding: $space-6;
    }

    .account-header {
      display: flex;
      align-items: center;
      gap: $space-4;
      padding-bottom: $space-5;
      border-bottom: 1px solid $border-subtle;
      margin-bottom: $space-5;
    }

    .account-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      background: $urgency-week-accent;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      font-family: $font-display;
      font-size: $text-lg;
      font-weight: $weight-semibold;
      color: $text-primary;
    }

    .account-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .account-name {
      font-family: $font-body;
      font-size: $text-base;
      font-weight: $weight-semibold;
      color: $text-primary;
      margin: 0;
    }

    .account-role-badge {
      font-family: $font-display;
      font-size: 9px;
      font-weight: $weight-semibold;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba($urgency-week-accent, 0.15);
      color: $urgency-week-accent;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
    }

    .profile-item {
      display: flex;
      align-items: flex-start;
      gap: $space-3;
      padding: $space-3 $space-4;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid $border-subtle;
      border-radius: $radius-badge;
      transition: border-color 150ms ease;
      &:hover { border-color: rgba(255, 255, 255, 0.15); }
    }

    .profile-item__icon {
      color: $text-muted;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .profile-item__content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .label {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-muted;
    }

    .value {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-primary;
      font-weight: $weight-medium;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.font-mono {
        font-family: $font-display;
        font-size: $text-xs;
        color: $text-secondary;
      }
    }

    .provider-value {
      display: flex;
      align-items: center;
      margin-top: 2px;
    }

    .provider-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-medium;
      padding: 3px 10px;
      border-radius: 20px;
      background: #ffffff;
      color: #1e1f20;
      border: 1px solid $border-subtle;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      .brand-svg {
        width: 14px;
        height: 14px;
        display: block;
      }
    }
  `]
})
export class AccountComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private sub = new Subscription();

  user: User | null = null;

  get userInitials(): string {
    const name = this.user?.name ?? '';
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnInit(): void {
    this.sub.add(
      this.store.select(selectUser).subscribe(u => this.user = u)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

