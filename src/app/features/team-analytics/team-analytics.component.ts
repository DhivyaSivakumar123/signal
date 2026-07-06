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
import { RecommendationsComponent } from './recommendations.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-team-analytics',
  standalone: true,
  imports: [
    CommonModule,
    LoadChartComponent,
    RecommendationsComponent,
    MatButtonToggleModule,
    MatIconModule
  ],
  template: `
    <div class="analytics">
      <div class="analytics__header">
        <h1 class="analytics__title">Team Load</h1>
        <mat-button-toggle-group [(value)]="daysFilter" (change)="onDaysChange($event)">
          <mat-button-toggle value="7">Last 7 days</mat-button-toggle>
          <mat-button-toggle value="30">Last 30 days</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Chart panel -->
      <div class="analytics__panel">
        <div class="panel__title">Interruptions by source and hour</div>
        <app-load-chart [teamLoad]="teamLoad" />
      </div>

      <!-- Recommendations panel -->
      <div class="analytics__panel">
        <div class="panel__title">Recommendations</div>
        <app-recommendations [recommendations]="recommendations" />
      </div>

      <!-- Privacy note — always visible, non-removable -->
      <p class="analytics__privacy">
        <mat-icon>lock</mat-icon>
        Signal shows your team's total volume only. Individual messages are never visible here.
      </p>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .analytics { padding: $space-6; max-width: 960px; }
    .analytics__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $space-6;
    }
    .analytics__title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      margin: 0;
    }
    .analytics__panel {
      background: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-6;
      margin-bottom: $space-4;
    }
    .panel__title {
      font-family: $font-display;
      font-size: $text-sm;
      color: $text-muted;
      letter-spacing: 1px;
      margin-bottom: $space-4;
    }
    .analytics__privacy {
      display: flex;
      align-items: center;
      gap: $space-2;
      color: $text-muted;
      font-size: $text-xs;
      margin-top: $space-6;
      padding-top: $space-4;
      border-top: 1px solid $border-subtle;
      mat-icon { font-size: 14px; }
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

  teamLoad: any = null;
  recommendations: any[] = [];
  daysFilter = '7';

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      combineLatest([this.user$, this.daysFilter$]).subscribe(([user, days]) => {
        if (user) {
          this.store.dispatch(AnalyticsActions.loadAnalyticsDashboard({ managerId: user.id, days }));
        }
      })
    );

    this.sub.add(this.teamLoad$.subscribe(data => this.teamLoad = data));
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
}
