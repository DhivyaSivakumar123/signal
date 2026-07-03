import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';
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

@Component({
  selector: 'app-team-analytics',
  standalone: true,
  imports: [CommonModule, LoadChartComponent, RecommendationsComponent],
  template: `
    <div class="analytics-container">
      <ng-container *ngIf="user$ | async as user">
        <!-- Security Check: MANAGER role required -->
        <ng-container *ngIf="user.role === 'MANAGER'; else accessDenied">
          <header class="analytics-header">
            <div class="header-left">
              <h1 class="title">Team Communication Load</h1>
              <p class="subtitle">Understand workload trends and stress points across your team.</p>
            </div>
            <div class="header-right">
              <select class="filter-select" 
                      [value]="daysFilter$ | async" 
                      (change)="onFilterChange($event, user.id)">
                <option [value]="7">Last 7 Days</option>
                <option [value]="30">Last 30 Days</option>
              </select>
            </div>
          </header>

          <div class="analytics-grid">
            <div class="chart-card">
              <div class="card-header">
                <h3 class="card-title">Message Volume by Hour</h3>
                <span class="spinner" *ngIf="loading$ | async"></span>
              </div>
              <app-load-chart [data]="teamLoad$ | async"></app-load-chart>
            </div>

            <app-recommendations [recommendations]="(recommendations$ | async) || []"></app-recommendations>
          </div>
        </ng-container>

        <ng-template #accessDenied>
          <div class="access-denied-container">
            <div class="error-banner">
              <div class="error-banner__icon">🔒</div>
              <h2 class="error-banner__title">Access Denied</h2>
              <p class="error-banner__text">Team Analytics are only available to Managers.</p>
            </div>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .analytics-container {
      padding: $space-6;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .analytics-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: $space-6;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-1;
    }
    
    .subtitle {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
    }
    
    .filter-select {
      font-family: $font-body;
      font-size: $text-sm;
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      color: $text-primary;
      padding: $space-2 $space-3;
      height: 38px;
      cursor: pointer;
      
      &:focus {
        border-color: $border-focus;
        outline: none;
      }
    }
    
    .analytics-grid {
      display: flex;
      flex-direction: column;
      gap: $space-6;
    }
    
    .chart-card {
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $space-4;
    }
    
    .card-title {
      font-family: $font-display;
      font-size: $text-base;
      color: $text-primary;
      font-weight: $weight-semibold;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba($border-subtle, 0.5);
      border-radius: 50%;
      border-top-color: $border-focus;
      animation: spin 800ms linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .access-denied-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: $space-10;
    }
    
    .error-banner {
      max-width: 400px;
      text-align: center;
      padding: $space-8;
      border: 1px solid rgba($urgency-now-accent, 0.2);
      border-radius: $radius-card;
      background-color: rgba($urgency-now-accent, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .error-banner__icon {
      font-size: 40px;
      margin-bottom: $space-4;
    }
    
    .error-banner__title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $urgency-now-accent;
      margin-bottom: $space-2;
      font-weight: $weight-semibold;
    }
    
    .error-banner__text {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
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

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      combineLatest([this.user$, this.daysFilter$]).subscribe(([user, days]) => {
        if (user && user.role === 'MANAGER') {
          this.store.dispatch(AnalyticsActions.loadTeamLoad({ managerId: user.id, days }));
          this.store.dispatch(AnalyticsActions.loadRecommendations({ managerId: user.id }));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFilterChange(event: Event, managerId: string): void {
    const value = (event.target as HTMLSelectElement).value;
    const days = parseInt(value, 10);
    this.store.dispatch(AnalyticsActions.setDaysFilter({ days }));
  }
}
