import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recommendation } from '../../core/models/analytics.model';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations">
      <h3 class="title">AI Pattern Recommendations</h3>
      <div class="list" *ngIf="recommendations.length > 0; else emptyState">
        <div class="rec-card" *ngFor="let rec of recommendations">
          <div class="rec-card__icon">💡</div>
          <div class="rec-card__content">
            <p class="rec-card__text">{{ rec.text }}</p>
            <p class="rec-card__pattern">
              <span class="badge">Detected Pattern</span>
              {{ rec.patternDescription }}
            </p>
          </div>
        </div>
      </div>
      <ng-template #emptyState>
        <div class="no-recs">
          <p>No actionable stress patterns detected. Team communication load is healthy.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .recommendations {
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-base;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-4;
    }
    
    .list {
      display: flex;
      flex-direction: column;
      gap: $space-3;
    }
    
    .rec-card {
      display: flex;
      gap: $space-4;
      padding: $space-4;
      background-color: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      transition: all 150ms ease;
      
      &:hover {
        border-color: $border-focus;
        transform: translateY(-2px);
      }
    }
    
    .rec-card__icon {
      font-size: $text-xl;
      line-height: 1;
    }
    
    .rec-card__content {
      display: flex;
      flex-direction: column;
      gap: $space-2;
    }
    
    .rec-card__text {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-primary;
      line-height: 1.5;
    }
    
    .rec-card__pattern {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: $space-2;
      flex-wrap: wrap;
      
      .badge {
        font-family: $font-display;
        font-size: 10px;
        font-weight: $weight-semibold;
        padding: 1px 6px;
        border-radius: 4px;
        background-color: rgba($urgency-today-accent, 0.15);
        color: $urgency-today-accent;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
    
    .no-recs {
      text-align: center;
      padding: $space-6;
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-muted;
    }
  `]
})
export class RecommendationsComponent {
  @Input() recommendations: Recommendation[] = [];
}
