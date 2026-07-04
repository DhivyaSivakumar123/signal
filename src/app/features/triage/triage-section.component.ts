import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriageItem, FocusSlot } from '../../core/models/triage.model';
import { TriageCardComponent } from '../../shared/components/triage-card/triage-card.component';

@Component({
  selector: 'app-triage-section',
  standalone: true,
  imports: [CommonModule, TriageCardComponent],
  template: `
    <div class="triage-section" *ngIf="items.length > 0">
      <h4 class="section-title">{{ title }}</h4>
      <div class="section-list">
        <app-triage-card 
          *ngFor="let item of items" 
          [item]="item" 
          [highlighted]="isHighlighted(item)" 
          [submitting]="submittingItemIds.includes(item.id)"
          [class.dim-by-slot]="shouldDim(item)"
          (feedbackSubmitted)="feedback.emit($event)">
        </app-triage-card>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .triage-section {
      margin-bottom: $space-6;
    }
    
    .section-title {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      letter-spacing: 0.1em;
      margin-bottom: $space-3;
      text-transform: uppercase;
      font-weight: $weight-semibold;
      border-bottom: 1px solid rgba($border-subtle, 0.5);
      padding-bottom: $space-1;
    }
    
    .section-list {
      display: flex;
      flex-direction: column;
    }
    
    .dim-by-slot {
      opacity: 0.3 !important;
    }
  `]
})
export class TriageSectionComponent {
  @Input() title!: string;
  @Input() items: TriageItem[] = [];
  @Input() selectedSlot: FocusSlot | null = null;
  @Input() hasHighlightsInFeed = false;
  @Input() submittingItemIds: string[] = [];

  @Output() feedback = new EventEmitter<{ id: string; wasUrgent: boolean }>();

  isHighlighted(item: TriageItem): boolean {
    if (!this.selectedSlot) return false;
    const itemTime = new Date(item.receivedAt).getTime();
    const start = new Date(this.selectedSlot.startTime).getTime();
    const end = new Date(this.selectedSlot.endTime).getTime();
    return itemTime >= start && itemTime <= end;
  }

  shouldDim(item: TriageItem): boolean {
    if (!this.selectedSlot || !this.hasHighlightsInFeed) return false;
    return !this.isHighlighted(item);
  }
}
