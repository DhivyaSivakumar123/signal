import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';
import { selectUser } from '../../state/auth/auth.selectors';
import { selectActiveIntegrations, selectIntegrations } from '../../state/integrations/integrations.selectors';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { 
  selectTriageItems, 
  selectTriageLoading, 
  selectSelectedSlot,
  selectPreferences,
  selectNowCount,
  selectTodayCount,
  selectWeekCount,
  selectFyiCount
} from '../../state/triage/triage.selectors';
import { TriageActions } from '../../state/triage/triage.actions';
import { TriageService } from '../../core/services/triage.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TriageSectionComponent } from './triage-section.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SourceIconComponent } from '../../shared/components/source-icon/source-icon.component';
import { TriageItem, UserPreference } from '../../core/models/triage.model';

@Component({
  selector: 'app-triage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TriageSectionComponent,
    EmptyStateComponent,
    SourceIconComponent
  ],
  template: `
    <div class="triage-container">
      <div class="triage-main">
        <!-- Header -->
        <header class="triage-header">
          <div class="header-left">
            <h1 class="welcome-title">Today, {{ (user$ | async)?.name || 'there' }}</h1>
            <p class="summary-line">
              {{ (nowCount$ | async) }} urgent · {{ (todayCount$ | async) }} today · {{ (weekCount$ | async) }} this week
            </p>
          </div>
          <div class="header-right">
            <div class="sync-indicator">
              <span class="spinner" *ngIf="loading$ | async"></span>
              <span class="sync-text">{{ (loading$ | async) ? 'Syncing...' : 'Synced just now' }}</span>
            </div>
          </div>
        </header>

        <!-- Feed Content -->
        <div class="feed-content">
          <ng-container *ngIf="hasItems(); else emptyFeed">
            <!-- NOW Section -->
            <app-triage-section 
              title="Now" 
              [items]="getFilteredItems('NOW', (items$ | async) || [])" 
              [selectedSlot]="selectedSlot$ | async"
              [hasHighlightsInFeed]="hasHighlightsInFeed"
              (feedback)="onFeedback($event)">
            </app-triage-section>

            <!-- TODAY Section -->
            <app-triage-section 
              title="Today" 
              [items]="getFilteredItems('TODAY', (items$ | async) || [])" 
              [selectedSlot]="selectedSlot$ | async"
              [hasHighlightsInFeed]="hasHighlightsInFeed"
              (feedback)="onFeedback($event)">
            </app-triage-section>

            <!-- THIS WEEK Section -->
            <app-triage-section 
              title="This Week" 
              [items]="getFilteredItems('THIS_WEEK', (items$ | async) || [])" 
              [selectedSlot]="selectedSlot$ | async"
              [hasHighlightsInFeed]="hasHighlightsInFeed"
              (feedback)="onFeedback($event)">
            </app-triage-section>

            <!-- FYI Section -->
            <app-triage-section 
              title="FYI" 
              [items]="getFilteredItems('FYI', (items$ | async) || [])" 
              [selectedSlot]="selectedSlot$ | async"
              [hasHighlightsInFeed]="hasHighlightsInFeed"
              (feedback)="onFeedback($event)">
            </app-triage-section>
          </ng-container>

          <ng-template #emptyFeed>
            <app-empty-state 
              headline="All quiet" 
              subline="Your inbox is clear or syncing..." 
              ctaLabel="Manage Connected Tools" 
              ctaRoute="/app/settings">
            </app-empty-state>
          </ng-template>
        </div>
      </div>

      <aside class="triage-sidebar">
        <!-- Preferences Card -->
        <div class="prefs-card">
          <h3 class="card-title">Focus Preferences</h3>
          
          <div class="form-group">
            <label class="form-label">Stated Priorities</label>
            <textarea class="form-textarea" 
                      [(ngModel)]="statedPriorities" 
                      placeholder="e.g. Focus on billing queries, skip marketing updates..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Digest Time</label>
            <select class="form-select" [(ngModel)]="digestTime">
              <option [ngValue]="null">Off</option>
              <option value="09:00">9:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="18:00">6:00 PM</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Digest Channel</label>
            <select class="form-select" [(ngModel)]="digestChannel">
              <option value="NONE">None</option>
              <option value="EMAIL">Email</option>
              <option value="SLACK">Slack</option>
            </select>
          </div>

          <button class="save-btn" (click)="savePreferences()">Save Preferences</button>
          
          <div class="divider"></div>
          
          <button class="digest-btn" (click)="sendDigestNow()">Send Digest Now</button>
        </div>

        <!-- Sync Status Card -->
        <div class="sync-card">
          <h3 class="card-title">Sync Status</h3>
          <div class="sync-list">
            <div class="sync-item" *ngFor="let s of integrations$ | async">
              <app-source-icon [provider]="s.provider"></app-source-icon>
              <span class="sync-name">{{ s.provider | titlecase }}</span>
              <span class="sync-status-badge sync-status-badge--{{ s.status.toLowerCase() }}">
                {{ s.status }}
              </span>
            </div>
            <div *ngIf="!(integrations$ | async)?.length" class="no-sync-text">
              No tools connected.
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .triage-container {
      display: flex;
      padding: $space-6;
      gap: $space-6;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    
    .triage-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .triage-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: $space-6;
    }
    
    .welcome-title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-1;
    }
    
    .summary-line {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
    }
    
    .sync-indicator {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: $text-muted;
      font-family: $font-body;
      font-size: $text-xs;
    }
    
    .spinner {
      width: 12px;
      height: 12px;
      border: 2px solid rgba($border-subtle, 0.5);
      border-radius: 50%;
      border-top-color: $border-focus;
      animation: spin 800ms linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .feed-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .triage-sidebar {
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: $space-6;
      flex-shrink: 0;
    }
    
    .prefs-card, .sync-card {
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
    }
    
    .card-title {
      font-family: $font-display;
      font-size: $text-base;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-4;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: $space-1;
      margin-bottom: $space-4;
    }
    
    .form-label {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      font-weight: $weight-medium;
    }
    
    .form-textarea {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-base;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      color: $text-primary;
      padding: $space-2 $space-3;
      resize: vertical;
      min-height: 80px;
      
      &:focus {
        border-color: $border-focus;
        outline: none;
      }
    }
    
    .form-select {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-base;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      color: $text-primary;
      padding: $space-2 $space-3;
      height: 38px;
      
      &:focus {
        border-color: $border-focus;
        outline: none;
      }
    }
    
    .save-btn {
      width: 100%;
      height: 36px;
      background-color: $border-focus;
      color: $text-primary;
      border-radius: $radius-badge;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border: none;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
    
    .divider {
      height: 1px;
      background-color: $border-subtle;
      margin: $space-4 0;
    }
    
    .digest-btn {
      width: 100%;
      height: 36px;
      background-color: transparent;
      border: 1px solid $border-subtle;
      color: $text-primary;
      border-radius: $radius-badge;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: $bg-elevated;
      }
    }
    
    .sync-list {
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }
    
    .sync-item {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-family: $font-body;
      font-size: $text-sm;
      
      .sync-name {
        color: $text-primary;
      }
      
      .sync-status-badge {
        margin-left: auto;
        font-family: $font-display;
        font-size: $text-xs;
        font-weight: $weight-semibold;
        padding: 1px 6px;
        border-radius: 4px;
        text-transform: uppercase;
        
        &--active {
          background-color: rgba(#34A853, 0.15);
          color: #34A853;
        }
        
        &--expired {
          background-color: rgba($urgency-now-accent, 0.15);
          color: $urgency-now-accent;
        }
        
        &--revoked {
          background-color: rgba($text-muted, 0.15);
          color: $text-muted;
        }
      }
    }
    
    .no-sync-text {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-muted;
      text-align: center;
      padding: $space-2 0;
    }
  `]
})
export class TriageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private triageService = inject(TriageService);
  private toastService = inject(ToastService);

  user$ = this.store.select(selectUser);
  items$ = this.store.select(selectTriageItems);
  loading$ = this.store.select(selectTriageLoading);
  selectedSlot$ = this.store.select(selectSelectedSlot);
  integrations$ = this.store.select(selectIntegrations);

  nowCount$ = this.store.select(selectNowCount);
  todayCount$ = this.store.select(selectTodayCount);
  weekCount$ = this.store.select(selectWeekCount);
  fyiCount$ = this.store.select(selectFyiCount);

  // Pref form bindings
  statedPriorities = '';
  digestTime: string | null = null;
  digestChannel: 'EMAIL' | 'SLACK' | 'NONE' = 'NONE';

  hasHighlightsInFeed = false;

  private sub = new Subscription();
  private lastSelectedSlot: any = null;

  ngOnInit(): void {
    // Initial loads
    this.store.dispatch(TriageActions.loadTodayFeed());
    this.store.dispatch(TriageActions.loadFocusSlots());
    this.store.dispatch(TriageActions.loadPreferences());
    this.store.dispatch(IntegrationsActions.loadIntegrations());

    // Start background sync polling
    this.store.dispatch(TriageActions.startPolling());

    // Sync preferences form
    this.sub.add(
      this.store.select(selectPreferences).subscribe((prefs) => {
        if (prefs) {
          this.statedPriorities = prefs.statedPriorities;
          this.digestTime = prefs.digestTime;
          this.digestChannel = prefs.digestChannel;
        }
      })
    );

    // Watch focus slot selection for toast warning
    this.sub.add(
      combineLatest([this.selectedSlot$, this.items$]).subscribe(([slot, items]) => {
        if (slot) {
          const start = new Date(slot.startTime).getTime();
          const end = new Date(slot.endTime).getTime();
          const hasHighlights = items.some((item) => {
            const itemTime = new Date(item.receivedAt).getTime();
            return itemTime >= start && itemTime <= end;
          });
          this.hasHighlightsInFeed = hasHighlights;

          // Only trigger toast when slot actually changes, to avoid redundant warnings during polling
          if (slot !== this.lastSelectedSlot) {
            this.lastSelectedSlot = slot;
            if (!hasHighlights) {
              this.toastService.info('No messages received during this focus slot');
            }
          }
        } else {
          this.hasHighlightsInFeed = false;
          this.lastSelectedSlot = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Stop polling and unsubscribe
    this.store.dispatch(TriageActions.stopPolling());
    this.sub.unsubscribe();
  }

  hasItems(): boolean {
    let count = 0;
    this.items$.subscribe(items => count = items.length).unsubscribe();
    return count > 0;
  }

  getFilteredItems(urgency: 'NOW' | 'TODAY' | 'THIS_WEEK' | 'FYI', items: TriageItem[]): TriageItem[] {
    return items.filter(i => i.urgency === urgency);
  }

  onFeedback(event: { id: string; wasUrgent: boolean }): void {
    this.store.dispatch(TriageActions.submitFeedback({ id: event.id, wasUrgent: event.wasUrgent }));
  }

  savePreferences(): void {
    const prefs: UserPreference = {
      statedPriorities: this.statedPriorities,
      digestTime: this.digestTime,
      digestChannel: this.digestChannel
    };
    this.store.dispatch(TriageActions.updatePreferences({ prefs }));
  }

  sendDigestNow(): void {
    this.triageService.sendDigestNow().subscribe({
      next: () => {
        this.toastService.success('Digest sent!');
      },
      error: () => {
        this.toastService.error('Failed to send digest.');
      }
    });
  }
}
