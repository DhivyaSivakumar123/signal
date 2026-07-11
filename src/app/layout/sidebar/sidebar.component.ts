import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectFocusSlots, selectSelectedSlot, selectNowCount } from '../../state/triage/triage.selectors';
import { selectIntegrationsLoading } from '../../state/integrations/integrations.selectors';
import { TriageActions } from '../../state/triage/triage.actions';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { FocusSlot } from '../../core/models/triage.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  template: `
    <nav class="sidebar" [class.sidebar--collapsed]="collapsed">

      <!-- Drive-style "+ Sync Now" Pill Button -->
      <div class="sidebar__action-container">
        <button class="sidebar__sync-btn" (click)="triggerSync()" [disabled]="syncing" [matTooltip]="collapsed ? 'Sync Now' : ''">
          <mat-icon class="sync-btn__icon" [class.sync-btn__icon--spinning]="syncing">sync</mat-icon>
          <span class="sync-btn__label" *ngIf="!collapsed">{{ syncing ? 'Syncing...' : 'Sync Now' }}</span>
        </button>
      </div>

      <!-- Nav items -->
      <ul class="sidebar__nav">
        <li class="sidebar__item" routerLink="/app/triage" routerLinkActive="sidebar__item--active">
          <mat-icon class="sidebar__icon">inbox</mat-icon>
          <span class="sidebar__label">Today's Feed</span>
          <!-- Urgency counts badge (only when not collapsed) -->
          <span class="sidebar__count sidebar__count--now" *ngIf="!collapsed && nowCount > 0">{{ nowCount }}</span>
        </li>
        <li class="sidebar__item" routerLink="/app/analytics" routerLinkActive="sidebar__item--active">
          <mat-icon class="sidebar__icon">bar_chart</mat-icon>
          <span class="sidebar__label">Team Load</span>
        </li>
        <li class="sidebar__item" routerLink="/app/settings" routerLinkActive="sidebar__item--active">
          <mat-icon class="sidebar__icon">settings</mat-icon>
          <span class="sidebar__label">Settings</span>
        </li>
      </ul>

      <div class="sidebar__divider"></div>

      <!-- Focus slots section -->
      <div class="sidebar__section" *ngIf="!collapsed">
        <span class="sidebar__section-label">FOCUS TODAY</span>
        <ul class="sidebar__slots">
          <li
            class="sidebar__slot"
            *ngFor="let slot of focusSlots"
            (click)="selectSlot(slot)"
            [class.sidebar__slot--selected]="selectedSlot?.startTime === slot.startTime"
          >
            <mat-icon class="sidebar__slot-icon">schedule</mat-icon>
            <div class="sidebar__slot-info">
              <span class="sidebar__slot-time">{{ slot.startTime | date:'h:mm a' }} – {{ slot.endTime | date:'h:mm a' }}</span>
              <span class="sidebar__slot-dur">{{ slot.durationMinutes }}m free</span>
            </div>
          </li>
          <li class="sidebar__slot-empty" *ngIf="focusSlots.length === 0">
            No free slots today
          </li>
        </ul>
      </div>

    </nav>
  `,
  styles: [`
    @import 'styles/tokens';

    .sidebar {
      width: $sidebar-width;
      background: $sidebar-bg;
      border-right: 1px solid $border-subtle;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: width 200ms ease;
      flex-shrink: 0;

      &--collapsed {
        width: $sidebar-collapsed;
        .sidebar__label,
        .sidebar__count,
        .sidebar__section,
        .sidebar__slot-info { display: none; }
        
        .sidebar__action-container {
          justify-content: center;
          padding: $space-4 0;
        }
        .sidebar__sync-btn {
          padding: $space-3;
          border-radius: 50%;
        }
      }
    }

    .sidebar__action-container {
      padding: $space-4 $space-4;
      display: flex;
      justify-content: flex-start;
    }

    .sidebar__sync-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $space-2;
      background: $sidebar-item-active;
      border: 1px solid rgba($border-focus, 0.15);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      color: $text-primary;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      padding: $space-3 $space-5;
      border-radius: 24px;
      cursor: pointer;
      transition: all 180ms ease;
      
      &:hover {
        background: lighten(#1F2A45, 5%);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .sync-btn__icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &--spinning {
        animation: spin 1.2s linear infinite;
      }
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }

    .sidebar__nav {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar__item {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-2 $space-4;
      margin: 2px $space-3;
      border-radius: 20px;
      cursor: pointer;
      color: $text-secondary;
      font-size: $text-sm;
      font-family: $font-body;
      font-weight: $weight-medium;
      transition: background 180ms ease;

      &:hover { background: $sidebar-item-hover; color: $text-primary; }

      &--active {
        background: $sidebar-item-active;
        color: #8ab4f8;
        .sidebar__icon { color: #8ab4f8; }
      }
    }

    .sidebar__icon { font-size: 20px; flex-shrink: 0; }
    .sidebar__label { flex: 1; white-space: nowrap; }

    .sidebar__count {
      font-family: $font-display;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      padding: 2px 6px;
      border-radius: 10px;
      &--now { background: rgba($urgency-now-accent, 0.2); color: $urgency-now-accent; }
    }

    .sidebar__divider { height: 1px; background: $border-subtle; margin: $space-3 $space-3; }

    .sidebar__section { padding: 0 $space-3 $space-3; }
    .sidebar__section-label {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      letter-spacing: 1px;
      display: block;
      margin-bottom: $space-2;
      padding: 0 $space-2;
    }

    .sidebar__slots { list-style: none; padding: 0; margin: 0; }
    .sidebar__slot {
      display: flex;
      align-items: center;
      gap: $space-2;
      padding: $space-2 $space-3;
      margin: 2px 0;
      border-radius: $radius-badge;
      cursor: pointer;
      &:hover { background: $sidebar-item-hover; }
      &--selected { background: $sidebar-item-active; }
    }
    .sidebar__slot-icon { font-size: 16px; color: $text-muted; }
    .sidebar__slot-info { display: flex; flex-direction: column; }
    .sidebar__slot-time { display: block; font-size: $text-xs; color: $text-secondary; }
    .sidebar__slot-dur  { display: block; font-size: $text-xs; color: $text-muted; }
    .sidebar__slot-empty { font-size: $text-xs; color: $text-muted; padding: $space-2; }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;

  private store = inject(Store);
  private sub = new Subscription();

  nowCount = 0;
  focusSlots: FocusSlot[] = [];
  selectedSlot: FocusSlot | null = null;
  syncing = false;

  ngOnInit() {
    this.sub.add(
      this.store.select(selectNowCount).subscribe(c => this.nowCount = c)
    );
    this.sub.add(
      this.store.select(selectFocusSlots).subscribe(s => this.focusSlots = s)
    );
    this.sub.add(
      this.store.select(selectSelectedSlot).subscribe(s => this.selectedSlot = s)
    );
    this.sub.add(
      this.store.select(selectIntegrationsLoading).subscribe(loading => this.syncing = loading)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectSlot(slot: FocusSlot): void {
    const nextSlot = this.selectedSlot === slot ? null : slot;
    this.store.dispatch(TriageActions.selectFocusSlot({ slot: nextSlot }));
  }

  triggerSync() {
    this.store.dispatch(IntegrationsActions.syncIntegrations());
  }
}
