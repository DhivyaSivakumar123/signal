import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../state/auth/auth.selectors';
import { selectFocusSlots, selectSelectedSlot } from '../../state/triage/triage.selectors';
import { AuthActions } from '../../state/auth/auth.actions';
import { TriageActions } from '../../state/triage/triage.actions';
import { FocusSlot } from '../../core/models/triage.model';
import { first } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar__logo">SIGNAL</div>
      
      <nav class="sidebar__nav">
        <a routerLink="/app/triage" routerLinkActive="active" class="nav-item">Today's Feed</a>
        <a routerLink="/app/analytics" routerLinkActive="active" class="nav-item">Team Load</a>
        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">Settings</a>
      </nav>
      
      <div class="sidebar__focus" *ngIf="(slots$ | async)?.length">
        <div class="focus-title">FOCUS TODAY</div>
        <div class="focus-list">
          <button 
            *ngFor="let slot of slots$ | async" 
            class="focus-item"
            [class.focus-item--active]="(selectedSlot$ | async) === slot"
            (click)="selectSlot(slot)">
            {{ formatSlot(slot) }}
          </button>
        </div>
      </div>
      
      <div class="sidebar__user" *ngIf="user$ | async as user">
        <div class="user-info">
          <div class="avatar">{{ getInitials(user.name) }}</div>
          <div class="details">
            <span class="name">{{ user.name }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
        </div>
        <button class="sign-out-btn" (click)="signOut()">Sign out</button>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .sidebar {
      width: 240px;
      height: 100vh;
      background-color: $bg-surface;
      border-right: 1px solid $border-subtle;
      display: flex;
      flex-direction: column;
      padding: $space-6 $space-4;
      flex-shrink: 0;
    }
    
    .sidebar__logo {
      font-family: $font-display;
      font-size: $text-lg;
      color: $text-primary;
      font-weight: $weight-semibold;
      letter-spacing: 0.1em;
      margin-bottom: $space-8;
      padding-left: $space-2;
    }
    
    .sidebar__nav {
      display: flex;
      flex-direction: column;
      gap: $space-2;
      margin-bottom: $space-8;
    }
    
    .nav-item {
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      color: $text-secondary;
      padding: $space-2 $space-3;
      border-radius: $radius-badge;
      border-left: 3px solid transparent;
      transition: all 150ms ease;
      
      &:hover {
        color: $text-primary;
        background-color: $bg-elevated;
      }
      
      &.active {
        color: $text-primary;
        background-color: $bg-elevated;
        border-left-color: $urgency-week-accent;
      }
    }
    
    .sidebar__focus {
      display: flex;
      flex-direction: column;
      gap: $space-2;
      margin-bottom: auto;
    }
    
    .focus-title {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      letter-spacing: 0.05em;
      padding-left: $space-2;
      margin-bottom: $space-1;
    }
    
    .focus-list {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }
    
    .focus-item {
      width: 100%;
      text-align: left;
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      padding: $space-2 $space-3;
      border-radius: $radius-badge;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 150ms ease;
      
      &:hover {
        background-color: $bg-elevated;
        color: $text-primary;
      }
      
      &--active {
        background-color: rgba($border-focus, 0.1);
        border-color: $border-focus;
        color: $text-primary;
      }
    }
    
    .sidebar__user {
      border-top: 1px solid $border-subtle;
      padding-top: $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: $space-3;
    }
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: $border-focus;
      color: $text-primary;
      font-family: $font-display;
      font-size: $text-sm;
      font-weight: $weight-semibold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .details {
      display: flex;
      flex-direction: column;
      min-width: 0;
      
      .name {
        font-family: $font-body;
        font-size: $text-sm;
        font-weight: $weight-medium;
        color: $text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .email {
        font-family: $font-body;
        font-size: $text-xs;
        color: $text-muted;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .sign-out-btn {
      width: 100%;
      text-align: left;
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-muted;
      padding: $space-2 $space-3;
      border-radius: $radius-badge;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 150ms ease;
      
      &:hover {
        background-color: $bg-elevated;
        color: $urgency-now-accent;
      }
    }
  `]
})
export class SidebarComponent {
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  slots$ = this.store.select(selectFocusSlots);
  selectedSlot$ = this.store.select(selectSelectedSlot);

  selectSlot(slot: FocusSlot): void {
    this.selectedSlot$.pipe(first()).subscribe((current) => {
      const nextSlot = current === slot ? null : slot;
      this.store.dispatch(TriageActions.selectFocusSlot({ slot: nextSlot }));
    });
  }

  formatSlot(slot: FocusSlot): string {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const formatTime = (d: Date) => {
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    };
    return `${formatTime(start)}–${formatTime(end)} · ${slot.durationMinutes}m`;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  signOut(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
