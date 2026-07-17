import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Urgency } from '../../../core/models/triage.model';

@Component({
  selector: 'app-urgency-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge badge--{{urgency.toLowerCase()}}">{{ label }}</span>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: $font-display;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      padding: 2px 8px;
      border-radius: $radius-badge;
      line-height: 1.2;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      
      &--now {
        background-color: rgba($urgency-now-accent, 0.2);
        color: $urgency-now-accent;
      }
      
      &--today {
        background-color: rgba($urgency-today-accent, 0.2);
        color: $urgency-today-accent;
      }
      
      &--this_week {
        background-color: rgba($urgency-week-accent, 0.2);
        color: $urgency-week-accent;
      }
      
      &--fyi {
        background-color: rgba($urgency-fyi-accent, 0.2);
        color: $urgency-fyi-accent;
      }
    }
  `]
})
export class UrgencyBadgeComponent implements OnInit {
  @Input() urgency!: Urgency;

  get label(): string {
    switch (this.urgency) {
      case 'NOW': return 'NOW';
      case 'TODAY': return 'TODAY';
      case 'THIS_WEEK': return 'THIS WEEK';
      case 'FYI': return 'FYI';
      default: return '';
    }
  }

  ngOnInit(): void {
    if (!this.urgency) {
      this.urgency = 'FYI';
    }
  }
}
