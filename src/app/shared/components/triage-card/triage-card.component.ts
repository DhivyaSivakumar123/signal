import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TriageItem } from '../../../core/models/triage.model';
import { SourceIconComponent } from '../source-icon/source-icon.component';
import { UrgencyBadgeComponent } from '../urgency-badge/urgency-badge.component';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-triage-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SourceIconComponent,
    UrgencyBadgeComponent,
    RelativeTimePipe,
    TruncatePipe
  ],
  template: `
    <div class="card card--{{item.urgency.toLowerCase()}}" 
         [class.card--highlighted]="highlighted" 
         [class.card--dimmed]="item.status === 'DISMISSED' || item.status === 'SEEN' || item.status === 'FEEDBACK_NOT_URGENT'">
      <div class="card__left-edge"></div>
      <div class="card__body">
        <div class="card__top-row">
          <span class="card__sources">
            <app-source-icon *ngFor="let s of item.sources" [provider]="s"></app-source-icon>
          </span>
          <span class="card__sender">{{ item.senderName }}</span>
          <span class="card__time">{{ item.receivedAt | relativeTime }}</span>
        </div>
        <div class="card__preview">{{ item.subjectOrPreview | truncate:120 }}</div>
        <div class="card__bottom-row">
          <app-urgency-badge [urgency]="item.urgency"></app-urgency-badge>
          <span class="card__reason">{{ item.reasonSnippet }}</span>
        </div>
      </div>
      <div class="card__actions">
        <ng-container *ngIf="submitting; else feedbackButtons">
          <span class="action-spinner"></span>
        </ng-container>
        <ng-template #feedbackButtons>
          <button mat-icon-button (click)="onFeedback(true)" title="This was urgent" class="action-btn">
            <mat-icon>thumb_up</mat-icon>
          </button>
          <button mat-icon-button (click)="onFeedback(false)" title="Not urgent" class="action-btn">
            <mat-icon>thumb_down</mat-icon>
          </button>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .card {
      position: relative;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      margin-bottom: $space-3;
      overflow: hidden;
      transition: background-color 180ms ease, border-color 180ms ease, opacity 180ms ease;
      
      &:hover {
        background-color: $bg-elevated;
        
        .card__actions {
          visibility: visible;
          opacity: 1;
        }
      }
      
      &--highlighted {
        border-color: $border-focus !important;
      }
      
      &--dimmed {
        opacity: 0.4;
      }
      
      // Urgency Backgrounds
      &--now {
        background-color: $urgency-now-bg;
        .card__left-edge { background-color: $urgency-now-accent; }
      }
      
      &--today {
        background-color: $urgency-today-bg;
        .card__left-edge { background-color: $urgency-today-accent; }
      }
      
      &--this_week {
        background-color: $urgency-week-bg;
        .card__left-edge { background-color: $urgency-week-accent; }
      }
      
      &--fyi {
        background-color: $urgency-fyi-bg;
        .card__left-edge { background-color: $urgency-fyi-accent; }
      }
    }
    
    .card__left-edge {
      width: 4px;
      flex-shrink: 0;
    }
    
    .card__body {
      flex: 1;
      padding: $space-3 $space-4;
      display: flex;
      flex-direction: column;
      gap: $space-1;
      min-width: 0;
    }
    
    .card__top-row {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-size: $text-xs;
      
      .card__sources {
        display: inline-flex;
        gap: $space-1;
      }
      
      .card__sender {
        font-family: $font-body;
        font-weight: $weight-semibold;
        color: $text-primary;
      }
      
      .card__time {
        font-family: $font-body;
        color: $text-secondary;
        margin-left: auto;
      }
    }
    
    .card__preview {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-primary;
      line-height: 1.4;
      margin: $space-1 0;
      word-wrap: break-word;
    }
    
    .card__bottom-row {
      display: flex;
      align-items: center;
      gap: $space-3;
      
      .card__reason {
        font-family: $font-body;
        font-size: $text-xs;
        color: $text-secondary;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
    }
    
    .card__actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: $space-1;
      padding: 0 $space-2;
      border-left: 1px solid rgba($border-subtle, 0.5);
      visibility: hidden;
      opacity: 0;
      transition: opacity 150ms ease, visibility 150ms ease;
      
      .action-btn {
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: $text-sm;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border-radius: 50%;
        transition: background-color 150ms ease;
        
        &:hover {
          background-color: $border-subtle;
        }
      }
      
      .action-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba($border-subtle, 0.5);
        border-radius: 50%;
        border-top-color: $border-focus;
        animation: spin 600ms linear infinite;
        display: inline-block;
      }
    }
  `]
})
export class TriageCardComponent {
  @Input() item!: TriageItem;
  @Input() highlighted = false;
  @Input() submitting = false;

  @Output() feedbackSubmitted = new EventEmitter<{ id: string; wasUrgent: boolean }>();

  onFeedback(wasUrgent: boolean): void {
    this.feedbackSubmitted.emit({ id: this.item.id, wasUrgent });
  }
}
