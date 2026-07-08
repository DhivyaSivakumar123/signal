import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest, first } from 'rxjs';
import { selectUser } from '../../state/auth/auth.selectors';
import {
  selectTeamLoad,
  selectRecommendations,
  selectDaysFilter,
  selectAnalyticsLoading
} from '../../state/analytics/analytics.selectors';
import { AnalyticsActions } from '../../state/analytics/analytics.actions';
import { LoadChartComponent } from './load-chart.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TeamLoad } from '../../core/models/analytics.model';

interface SourceStat {
  name: string;
  count: number;
  pct: number;
  color: string;
}

interface PeakSlot {
  label: string;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-team-analytics',
  standalone: true,
  imports: [
    CommonModule,
    LoadChartComponent,
    MatButtonToggleModule,
    MatIconModule
  ],
  template: `
    <div class="analytics">

      <!-- Header -->
      <div class="analytics__header">
        <div class="analytics__title-group">
          <h1 class="analytics__title">Team Load</h1>
          <span class="analytics__subtitle" *ngIf="teamLoad">
            {{ teamLoad.fromDate | date:'MMM d' }} â€“ {{ teamLoad.toDate | date:'MMM d, yyyy' }}
          </span>
        </div>
        <mat-button-toggle-group [(value)]="daysFilter" (change)="onDaysChange($event)" class="toggle-group">
          <mat-button-toggle value="7">Last 7 days</mat-button-toggle>
          <mat-button-toggle value="30">Last 30 days</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Loading skeletons -->
      <ng-container *ngIf="loading">
        <div class="kpi-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
        </div>
      </ng-container>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && !teamLoad">
        <mat-icon>query_stats</mat-icon>
        <p>No data yet. Integrate Slack, Gmail, or Outlook to see your team's communication load.</p>
      </div>

      <ng-container *ngIf="!loading && teamLoad">

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-card__icon kpi-card__icon--blue">
              <mat-icon>mark_email_read</mat-icon>
            </div>
            <div class="kpi-card__body">
              <div class="kpi-card__value">{{ totalMessages }}</div>
              <div class="kpi-card__label">Total messages</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card__icon kpi-card__icon--orange">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="kpi-card__body">
              <div class="kpi-card__value">{{ peakHourLabel }}</div>
              <div class="kpi-card__label">Peak hour</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card__icon kpi-card__icon--purple">
              <mat-icon>apps</mat-icon>
            </div>
            <div class="kpi-card__body">
              <div class="kpi-card__value">{{ busiestSource }}</div>
              <div class="kpi-card__label">Busiest source</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card__icon kpi-card__icon--green">
              <mat-icon>self_improvement</mat-icon>
            </div>
            <div class="kpi-card__body">
              <div class="kpi-card__value">{{ focusWindow }}</div>
              <div class="kpi-card__label">Quietest block</div>
            </div>
          </div>
        </div>

        <!-- Chart + Source breakdown -->
        <div class="two-col">
          <div class="panel panel--chart">
            <div class="panel__header">
              <span class="panel__title">Interruptions by hour</span>
              <div class="panel__legend">
                <span class="legend-dot" style="background:#8B5CF6"></span>Slack
                <span class="legend-dot" style="background:#EA4335"></span>Gmail
                <span class="legend-dot" style="background:#0078D4"></span>Outlook
                <span class="legend-dot" style="background:#34A853"></span>Calendar
              </div>
            </div>
            <app-load-chart [teamLoad]="teamLoad" />
          </div>

          <div class="panel panel--sources">
            <div class="panel__header">
              <span class="panel__title">Source breakdown</span>
            </div>
            <div class="source-list">
              <div class="source-row" *ngFor="let s of sourceStat">
                <div class="source-row__top">
                  <div class="source-row__label">
                    <span class="source-dot" [style.background]="s.color"></span>
                    {{ s.name }}
                  </div>
                  <div class="source-row__nums">
                    <span class="source-row__count">{{ s.count }}</span>
                    <span class="source-row__pct">{{ s.pct }}%</span>
                  </div>
                </div>
                <div class="source-bar-track">
                  <div class="source-bar-fill" [style.width.%]="s.pct" [style.background]="s.color"></div>
                </div>
              </div>
              <div class="source-empty" *ngIf="sourceStat.length === 0">No messages in this period.</div>
            </div>
          </div>
        </div>

        <!-- Hourly heatmap -->
        <div class="panel panel--timeline">
          <div class="panel__header">
            <span class="panel__title">Hourly activity heatmap</span>
            <span class="panel__hint">Each bar = total messages in that hour</span>
          </div>
          <div class="heatmap">
            <div class="heatmap__bar-wrap" *ngFor="let slot of peakSlots">
              <div class="heatmap__bar"
                   [style.height.%]="slot.pct || 2"
                   [class.heatmap__bar--peak]="slot.count === maxHourCount && slot.count > 0"
                   [title]="slot.label + ': ' + slot.count + ' msgs'">
              </div>
              <div class="heatmap__label">
                {{ (slot.label === '00:00' || slot.label === '06:00' || slot.label === '12:00' || slot.label === '18:00') ? slot.label.slice(0,2) + 'h' : '' }}
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendations -->
        <div class="panel panel--recs" *ngIf="recommendations.length > 0">
          <div class="panel__header">
            <span class="panel__title">AI Pattern Insights</span>
            <span class="rec-count-badge">{{ recommendations.length }} insight{{ recommendations.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="rec-list">
            <div class="rec-item" *ngFor="let rec of recommendations; let i = index">
              <div class="rec-item__num">{{ i + 1 }}</div>
              <div class="rec-item__body">
                <div class="rec-item__text">{{ rec.text }}</div>
                <div class="rec-item__pattern">
                  <mat-icon class="rec-item__pattern-icon">auto_awesome</mat-icon>
                  {{ rec.patternDescription }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Healthy state -->
        <div class="panel panel--healthy" *ngIf="recommendations.length === 0">
          <mat-icon class="healthy-icon">verified</mat-icon>
          <div class="healthy-body">
            <div class="healthy-title">Communication load looks healthy</div>
            <div class="healthy-sub">No stress patterns or unusual spikes were detected in this period.</div>
          </div>
        </div>

      </ng-container>

      <!-- Privacy note -->
      <p class="analytics__privacy">
        <mat-icon>lock</mat-icon>
        Signal shows your team's total volume only. Individual messages are never visible here.
      </p>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .analytics { padding: $space-6; max-width: 1100px; }

    .analytics__header {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: $space-6;
    }
    .analytics__title-group { display: flex; flex-direction: column; gap: 4px; }
    .analytics__title { font-family: $font-display; font-size: $text-xl; color: $text-primary; margin: 0; }
    .analytics__subtitle { font-family: $font-body; font-size: $text-sm; color: $text-muted; }

    /* Skeletons */
    .skeleton-card {
      height: 96px; border-radius: $radius-card;
      background: linear-gradient(90deg, $bg-elevated 25%, $bg-surface 50%, $bg-elevated 75%);
      background-size: 200% 100%; animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; } 100% { background-position: -200% 0; }
    }

    /* Empty */
    .empty-state {
      display: flex; flex-direction: column; align-items: center; gap: $space-4;
      padding: $space-10 $space-6; color: $text-muted; font-family: $font-body; font-size: $text-sm;
      mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    }

    /* KPI Grid */
    .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: $space-4; margin-bottom: $space-5; }
    .kpi-card {
      background: $bg-surface; border: 1px solid $border-subtle; border-radius: $radius-card;
      padding: $space-5; display: flex; align-items: center; gap: $space-4;
      transition: border-color 180ms ease, transform 180ms ease;
      &:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
    }
    .kpi-card__icon {
      width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
      &--blue   { background: rgba(74,144,217,0.15); color: #4A90D9; }
      &--orange { background: rgba(245,166,35,0.15); color: #F5A623; }
      &--purple { background: rgba(139,92,246,0.15); color: #8B5CF6; }
      &--green  { background: rgba(52,168,83,0.15);  color: #34A853; }
    }
    .kpi-card__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .kpi-card__value {
      font-family: $font-display; font-size: $text-lg; font-weight: $weight-semibold;
      color: $text-primary; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .kpi-card__label { font-family: $font-body; font-size: $text-xs; color: $text-muted; }

    /* Layout */
    .two-col { display: grid; grid-template-columns: 1fr 300px; gap: $space-4; margin-bottom: $space-4; }

    /* Panel base */
    .panel {
      background: $bg-surface; border: 1px solid $border-subtle; border-radius: $radius-card;
      padding: $space-5 $space-6; margin-bottom: $space-4;
      &--chart, &--sources { margin-bottom: 0; }
    }
    .panel__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: $space-4; }
    .panel__title {
      font-family: $font-display; font-size: $text-sm; color: $text-muted;
      letter-spacing: 0.5px; text-transform: uppercase;
    }
    .panel__hint { font-family: $font-body; font-size: $text-xs; color: $text-muted; }
    .panel__legend {
      display: flex; align-items: center; gap: $space-3;
      font-family: $font-body; font-size: $text-xs; color: $text-secondary;
    }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

    /* Source breakdown */
    .source-list { display: flex; flex-direction: column; gap: $space-4; }
    .source-row__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .source-row__label {
      display: flex; align-items: center; gap: $space-2;
      font-family: $font-body; font-size: $text-sm; color: $text-secondary;
    }
    .source-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .source-row__nums { display: flex; align-items: center; gap: $space-2; }
    .source-row__count { font-family: $font-display; font-size: $text-sm; font-weight: $weight-semibold; color: $text-primary; }
    .source-row__pct { font-family: $font-body; font-size: $text-xs; color: $text-muted; min-width: 32px; text-align: right; }
    .source-bar-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
    .source-bar-fill { height: 100%; border-radius: 3px; transition: width 600ms cubic-bezier(0.4,0,0.2,1); }
    .source-empty { font-family: $font-body; font-size: $text-sm; color: $text-muted; padding: $space-4 0; }

    /* Heatmap */
    .panel--timeline { margin-bottom: $space-4; }
    .heatmap { display: flex; align-items: flex-end; gap: 3px; height: 80px; }
    .heatmap__bar-wrap {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: flex-end; height: 100%;
    }
    .heatmap__bar {
      width: 100%; background: rgba(74,144,217,0.35); border-radius: 3px 3px 0 0;
      min-height: 2px; transition: height 500ms ease;
      &--peak { background: #F5A623; }
    }
    .heatmap__label { font-family: $font-body; font-size: 10px; color: $text-muted; margin-top: 4px; height: 14px; text-align: center; }

    /* Recommendations */
    .panel--recs { margin-bottom: $space-4; }
    .rec-count-badge {
      background: rgba(245,166,35,0.15); color: #F5A623;
      font-family: $font-display; font-size: 11px; font-weight: $weight-semibold;
      padding: 2px 10px; border-radius: 20px;
    }
    .rec-list { display: flex; flex-direction: column; gap: $space-3; }
    .rec-item {
      display: flex; gap: $space-4; padding: $space-4;
      background: $bg-elevated; border: 1px solid $border-subtle; border-radius: $radius-badge;
      transition: border-color 180ms ease, transform 180ms ease;
      &:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-1px); }
    }
    .rec-item__num {
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(74,144,217,0.15); color: #4A90D9;
      font-family: $font-display; font-size: $text-xs; font-weight: $weight-semibold;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
    }
    .rec-item__body { display: flex; flex-direction: column; gap: $space-2; }
    .rec-item__text { font-family: $font-body; font-size: $text-sm; color: $text-primary; line-height: 1.5; }
    .rec-item__pattern {
      display: flex; align-items: center; gap: 6px;
      font-family: $font-body; font-size: $text-xs; color: $text-muted; line-height: 1.4;
    }
    .rec-item__pattern-icon { font-size: 14px; width: 14px; height: 14px; color: #F5A623; }

    /* Healthy */
    .panel--healthy { display: flex; align-items: center; gap: $space-4; margin-bottom: $space-4; }
    .healthy-icon { font-size: 36px; width: 36px; height: 36px; color: #34A853; }
    .healthy-body { display: flex; flex-direction: column; gap: 2px; }
    .healthy-title { font-family: $font-display; font-size: $text-base; color: $text-primary; }
    .healthy-sub { font-family: $font-body; font-size: $text-sm; color: $text-muted; }

    /* Privacy */
    .analytics__privacy {
      display: flex; align-items: center; gap: $space-2; color: $text-muted;
      font-size: $text-xs; font-family: $font-body;
      margin-top: $space-4; padding-top: $space-4; border-top: 1px solid $border-subtle;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: repeat(2,1fr); }
      .two-col  { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TeamAnalyticsComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  teamLoad$ = this.store.select(selectTeamLoad);
  recommendations$ = this.store.select(selectRecommendations);
  daysFilter$ = this.store.select(selectDaysFilter);
  loading$ = this.store.select(selectAnalyticsLoading);

  teamLoad: TeamLoad | null = null;
  recommendations: any[] = [];
  daysFilter = '7';
  loading = false;

  // Computed stats
  totalMessages = 0;
  peakHourLabel = 'â€“';
  busiestSource = 'â€“';
  focusWindow = 'â€“';
  sourceStat: SourceStat[] = [];
  peakSlots: PeakSlot[] = [];
  maxHourCount = 0;

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(this.loading$.subscribe(l => this.loading = l));

    this.sub.add(
      combineLatest([this.user$, this.daysFilter$]).subscribe(([user, days]) => {
        if (user) {
          this.store.dispatch(AnalyticsActions.loadAnalyticsDashboard({ managerId: user.id, days }));
        }
      })
    );

    this.sub.add(this.teamLoad$.subscribe(data => {
      this.teamLoad = data;
      this.computeStats(data);
    }));

    this.sub.add(this.recommendations$.subscribe(data => this.recommendations = data || []));
    this.sub.add(this.daysFilter$.subscribe(days => this.daysFilter = String(days)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDaysChange(event: any): void {
    const days = parseInt(event.value, 10);
    this.store.dispatch(AnalyticsActions.setDaysFilter({ days }));
    this.user$.pipe(first()).subscribe(user => {
      if (user) {
        this.store.dispatch(AnalyticsActions.loadAnalyticsDashboard({ managerId: user.id, days }));
      }
    });
  }

  private computeStats(load: TeamLoad | null): void {
    if (!load || !load.data || load.data.length === 0) {
      this.totalMessages = 0;
      this.peakHourLabel = 'â€“';
      this.busiestSource = 'â€“';
      this.focusWindow = 'â€“';
      this.sourceStat = [];
      this.peakSlots = [];
      this.maxHourCount = 0;
      return;
    }

    const buckets = load.data;
    this.totalMessages = buckets.reduce((s, b) => s + b.count, 0);

    // Per-hour totals (0â€“23)
    const hourlyTotals = Array(24).fill(0);
    for (const b of buckets) {
      if (b.hourBucket >= 0 && b.hourBucket < 24) hourlyTotals[b.hourBucket] += b.count;
    }

    // Peak hour
    const maxCount = Math.max(...hourlyTotals);
    this.maxHourCount = maxCount;
    const peakHour = hourlyTotals.indexOf(maxCount);
    const nextHour = (peakHour + 1) % 24;
    this.peakHourLabel = `${String(peakHour).padStart(2,'0')}:00â€“${String(nextHour).padStart(2,'0')}:00`;

    // Quietest 3-hour block
    let minBlockSum = Infinity;
    let minBlockStart = 9;
    for (let h = 0; h < 24; h++) {
      const sum = hourlyTotals[h] + hourlyTotals[(h+1)%24] + hourlyTotals[(h+2)%24];
      if (sum < minBlockSum) { minBlockSum = sum; minBlockStart = h; }
    }
    const blockEnd = (minBlockStart + 3) % 24;
    this.focusWindow = `${String(minBlockStart).padStart(2,'0')}:00â€“${String(blockEnd).padStart(2,'0')}:00`;

    // Per-source totals
    const sourceTotals: Record<string, number> = {};
    for (const b of buckets) sourceTotals[b.source] = (sourceTotals[b.source] || 0) + b.count;

    const sourceColors: Record<string, string> = {
      SLACK: '#8B5CF6', GMAIL: '#EA4335', OUTLOOK: '#0078D4', CALENDAR: '#34A853'
    };
    const sourceNames: Record<string, string> = {
      SLACK: 'Slack', GMAIL: 'Gmail', OUTLOOK: 'Outlook', CALENDAR: 'Calendar'
    };
    const total = this.totalMessages || 1;
    this.sourceStat = Object.entries(sourceTotals)
      .sort(([,a],[,b]) => b - a)
      .map(([src, count]) => ({
        name: sourceNames[src] ?? src,
        count,
        pct: Math.round((count / total) * 100),
        color: sourceColors[src] ?? '#888'
      }));

    this.busiestSource = this.sourceStat[0]?.name ?? 'â€“';

    // Heatmap
    const maxH = Math.max(...hourlyTotals, 1);
    this.peakSlots = hourlyTotals.map((count, h) => ({
      label: `${String(h).padStart(2,'0')}:00`,
      count,
      pct: Math.round((count / maxH) * 100)
    }));
  }
}
