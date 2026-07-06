import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { selectUser } from '../../../state/auth/auth.selectors';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-grid" *ngIf="user">
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
  `,
  styles: [`
    @import 'styles/tokens';
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-5;
      padding: $space-6;
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
export class AccountComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private sub = new Subscription();

  user: User | null = null;

  ngOnInit(): void {
    this.sub.add(
      this.store.select(selectUser).subscribe(u => this.user = u)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
