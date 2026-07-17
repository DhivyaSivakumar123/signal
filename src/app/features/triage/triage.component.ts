import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest, map } from 'rxjs';
import { selectUser } from '../../state/auth/auth.selectors';
import { selectActiveIntegrations, selectIntegrations, selectIntegrationsLoading } from '../../state/integrations/integrations.selectors';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { 
  selectTriageItems, 
  selectTriageLoading, 
  selectSelectedSlot,
  selectPreferences,
  selectNowCount,
  selectTodayCount,
  selectWeekCount,
  selectFyiCount,
  selectSubmittingFeedback
} from '../../state/triage/triage.selectors';
import { TriageActions } from '../../state/triage/triage.actions';
import { TriageService } from '../../core/services/triage.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TriageSectionComponent } from './triage-section.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SourceIconComponent } from '../../shared/components/source-icon/source-icon.component';
import { UrgencyBadgeComponent } from '../../shared/components/urgency-badge/urgency-badge.component';
import { TriageItem, FocusSlot } from '../../core/models/triage.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TopbarComponent } from '../../layout/topbar/topbar.component';

@Component({
  selector: 'app-triage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TriageSectionComponent,
    EmptyStateComponent,
    SourceIconComponent,
    UrgencyBadgeComponent,
    TruncatePipe,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="triage">

      <!-- Page header -->
      <div class="triage__header">
        <h1 class="triage__date">{{ today | date:'EEEE, dd MMMM yyyy' }}</h1>
        <div class="triage__summary">
          <span class="summary__chip summary__chip--now">{{ nowCount }} NOW</span>
          <span class="summary__chip summary__chip--today">{{ todayCount }} TODAY</span>
          <span class="summary__chip summary__chip--week">{{ weekCount }} THIS WEEK</span>
          <span class="summary__chip summary__chip--fyi">{{ fyiCount }} FYI</span>
        </div>
      </div>

      <!-- Suggested strip (top 3 NOW items) — mirrors Drive's "Suggested files" -->
      <div class="triage__suggested" *ngIf="suggestedItems.length > 0">
        <div class="suggested__header">
          <mat-icon>bolt</mat-icon>
          <span>Needs you now</span>
        </div>
        <div class="suggested__cards">
          <div
            class="suggested__card"
            *ngFor="let item of suggestedItems"
            (click)="scrollToItem(item.id)"
          >
            <app-source-icon [provider]="item.sources[0]" />
            <div class="suggested__card-body">
              <span class="suggested__sender">{{ item.senderName }}</span>
              <span class="suggested__preview">{{ item.subjectOrPreview | truncate:60 }}</span>
            </div>
            <app-urgency-badge [urgency]="item.urgency" />
          </div>
        </div>
      </div>

      <!-- Column headers — Drive-style -->
      <div class="triage__col-header">
        <span class="col-header__source">Source</span>
        <span class="col-header__sender">From</span>
        <span class="col-header__preview">Subject / Preview</span>
        <span class="col-header__reason">Why flagged</span>
        <span class="col-header__time">Time</span>
        <span class="col-header__actions"></span>
      </div>

      <!-- Loading skeleton -->
      <div class="triage__skeleton" *ngIf="loading">
        <div class="skeleton__row" *ngFor="let i of [1,2,3,4,5]">
          <div class="skeleton__cell skeleton__cell--sm"></div>
          <div class="skeleton__cell skeleton__cell--md"></div>
          <div class="skeleton__cell skeleton__cell--lg"></div>
          <div class="skeleton__cell skeleton__cell--md"></div>
          <div class="skeleton__cell skeleton__cell--sm"></div>
        </div>
      </div>

      <!-- Empty state -->
      <app-empty-state
        *ngIf="!loading && totalCount === 0"
        headline="You're clear."
        subline="Nothing needs your attention right now."
      />

      <!-- Urgency sections -->
      <app-triage-section
        *ngFor="let urgency of urgencyTiers"
        [urgency]="urgency"
        [items]="getItemsByUrgency(urgency)"
        [selectedSlot]="selectedSlot"
        (feedbackSubmitted)="onFeedback($event)"
      />

    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .triage { padding: 0; }

    .triage__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-4 $space-6;
      border-bottom: 1px solid $border-subtle;
    }

    .triage__date {
      font-family: $font-display;
      font-size: $text-lg;
      color: $text-primary;
      font-weight: $weight-medium;
      margin: 0;
    }

    .triage__summary { display: flex; gap: $space-2; }
    .summary__chip {
      font-family: $font-display;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      padding: 3px 10px;
      border-radius: 12px;
      &--now   { background: rgba($urgency-now-accent, 0.15);   color: $urgency-now-accent; }
      &--today { background: rgba($urgency-today-accent, 0.15); color: $urgency-today-accent; }
      &--week  { background: rgba($urgency-week-accent, 0.15);  color: $urgency-week-accent; }
      &--fyi   { background: rgba($urgency-fyi-accent, 0.15);   color: $urgency-fyi-accent; }
    }

    // Suggested strip
    .triage__suggested {
      padding: $space-4 $space-6;
      border-bottom: 1px solid $border-subtle;
    }
    .suggested__header {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: $text-muted;
      font-size: $text-xs;
      font-family: $font-display;
      letter-spacing: 1px;
      margin-bottom: $space-3;
      mat-icon { font-size: 16px; color: $urgency-now-accent; }
    }
    .suggested__cards { display: flex; gap: $space-3; flex-wrap: wrap; }
    .suggested__card {
      display: flex;
      align-items: center;
      gap: $space-3;
      background: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-3 $space-4;
      cursor: pointer;
      flex: 1;
      min-width: 220px;
      max-width: 340px;
      transition: background 180ms ease;
      &:hover { background: rgba(255, 255, 255, 0.05); }
    }
    .suggested__card-body { flex: 1; overflow: hidden; }
    .suggested__sender  { display: block; font-size: $text-sm; color: $text-primary; font-weight: $weight-medium; }
    .suggested__preview { display: block; font-size: $text-xs; color: $text-muted; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    // Column headers
    .triage__col-header {
      display: grid;
      grid-template-columns: 48px 160px 1fr 200px 100px 80px;
      padding: $space-2 $space-6;
      border-bottom: 1px solid $border-subtle;
      background: $bg-surface;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .triage__col-header span {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      letter-spacing: 0.5px;
    }

    // Skeleton
    .triage__skeleton { padding: 0 $space-6; }
    .skeleton__row {
      display: grid;
      grid-template-columns: 48px 160px 1fr 200px 100px;
      gap: $space-3;
      padding: $space-3 0;
      border-bottom: 1px solid $border-subtle;
      align-items: center;
    }
    .skeleton__cell {
      height: 14px;
      border-radius: $radius-badge;
      background: linear-gradient(90deg, $bg-surface 25%, $bg-elevated 50%, $bg-surface 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      &--sm { width: 48px; }
      &--md { width: 120px; }
      &--lg { width: 100%; }
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
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
  syncing$ = this.store.select(selectIntegrationsLoading);

  nowCount$ = this.store.select(selectNowCount);
  todayCount$ = this.store.select(selectTodayCount);
  weekCount$ = this.store.select(selectWeekCount);
  fyiCount$ = this.store.select(selectFyiCount);
  hasItems$ = this.items$.pipe(map(items => items.length > 0));
  submittingItemIds$ = this.store.select(selectSubmittingFeedback);

  today = new Date();
  nowCount = 0;
  todayCount = 0;
  weekCount = 0;
  fyiCount = 0;
  loading = false;
  selectedSlot: FocusSlot | null = null;
  allTriageItems: TriageItem[] = [];
  urgencyTiers: ('NOW' | 'TODAY' | 'THIS_WEEK' | 'FYI')[] = ['NOW', 'TODAY', 'THIS_WEEK', 'FYI'];

  private sub = new Subscription();
  private lastSelectedSlot: any = null;

  get suggestedItems(): TriageItem[] {
    return this.allTriageItems.filter(i => i.urgency === 'NOW').slice(0, 3);
  }

  get totalCount(): number {
    return this.allTriageItems.length;
  }

  ngOnInit(): void {
    // Initial loads
    this.store.dispatch(TriageActions.loadTodayFeed());
    this.store.dispatch(TriageActions.loadFocusSlots());
    this.store.dispatch(TriageActions.loadPreferences());
    this.store.dispatch(IntegrationsActions.loadIntegrations());

    // Start background sync polling
    this.store.dispatch(TriageActions.startPolling());

    this.sub.add(this.nowCount$.subscribe(c => this.nowCount = c));
    this.sub.add(this.todayCount$.subscribe(c => this.todayCount = c));
    this.sub.add(this.weekCount$.subscribe(c => this.weekCount = c));
    this.sub.add(this.fyiCount$.subscribe(c => this.fyiCount = c));
    this.sub.add(this.loading$.subscribe(l => this.loading = l));
    this.sub.add(this.selectedSlot$.subscribe(s => this.selectedSlot = s));
    this.sub.add(this.items$.subscribe(items => this.allTriageItems = items));

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

          // Only trigger toast when slot actually changes, to avoid redundant warnings during polling
          if (slot !== this.lastSelectedSlot) {
            this.lastSelectedSlot = slot;
            if (!hasHighlights) {
              this.toastService.info('No messages received during this focus slot');
            }
          }
        } else {
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

  getItemsByUrgency(urgency: 'NOW' | 'TODAY' | 'THIS_WEEK' | 'FYI'): TriageItem[] {
    const query = (TopbarComponent.searchQuery || '').toLowerCase().trim();
    const filtered = this.allTriageItems.filter(i => i.urgency === urgency);
    if (!query) {
      return filtered;
    }
    return filtered.filter(item => 
      (item.senderName || '').toLowerCase().includes(query) ||
      (item.subjectOrPreview || '').toLowerCase().includes(query) ||
      (item.reasonSnippet || '').toLowerCase().includes(query)
    );
  }

  onFeedback(event: { id: string; wasUrgent: boolean }): void {
    this.store.dispatch(TriageActions.submitFeedback({ id: event.id, wasUrgent: event.wasUrgent }));
  }

  scrollToItem(id: string): void {
    document.getElementById('item-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
