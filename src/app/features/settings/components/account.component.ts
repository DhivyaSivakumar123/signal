import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="user">
      <h3 class="card-title">Account Details</h3>
      <p class="card-subtitle">Your user profile and organization identifiers.</p>
      
      <div class="profile-grid">
        <div class="profile-item">
          <span class="label">Name</span>
          <span class="value">{{ user.name }}</span>
        </div>
        <div class="profile-item">
          <span class="label">Email Address</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="profile-item">
          <span class="label">Organization ID</span>
          <span class="value font-mono">{{ user.orgId }}</span>
        </div>
        <div class="profile-item">
          <span class="label">Role</span>
          <span class="value badge">{{ user.role }}</span>
        </div>
        <div class="profile-item">
          <span class="label">Authentication Provider</span>
          <span class="value">{{ user.oauthProvider | titlecase }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .card {
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
      margin-bottom: $space-6;
    }
    
    .card-title {
      font-family: $font-display;
      font-size: $text-base;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-1;
    }
    
    .card-subtitle {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      margin-bottom: $space-5;
    }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-5;
    }
    
    .profile-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .label {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
    }
    
    .value {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-primary;
      font-weight: $weight-medium;
      
      &.font-mono {
        font-family: $font-display;
      }
      
      &.badge {
        display: inline-flex;
        align-self: flex-start;
        font-family: $font-display;
        font-size: 10px;
        font-weight: $weight-semibold;
        padding: 1px 6px;
        border-radius: 4px;
        background-color: rgba($urgency-week-accent, 0.15);
        color: $urgency-week-accent;
        text-transform: uppercase;
      }
    }
  `]
})
export class AccountComponent {
  @Input() user: User | null = null;
}
