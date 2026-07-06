import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TriageItem, FocusSlot } from '../../core/models/triage.model';
import { SourceIconComponent } from '../../shared/components/source-icon/source-icon.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-triage-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SourceIconComponent,
    RelativeTimePipe,
    TruncatePipe
  ],
  template: `
    <div class="section" *ngIf="items.length > 0">

      <!-- Section header — collapsible, like Drive's "Suggested folders" -->
      <div class="section__header" (click)="toggleCollapsed()">
        <mat-icon class="section__chevron" [class.section__chevron--collapsed]="collapsed">
          expand_more
        </mat-icon>
        <span class="section__label">{{ urgencyLabel }}</span>
        <span class="section__count">{{ items.length }}</span>
        <div class="section__accent-line" [class]="'section__accent-line--' + urgency.toLowerCase()"></div>
      </div>

      <!-- List rows -->
      <div class="section__list" *ngIf="!collapsed">
        <div
          class="section__row"
          *ngFor="let item of items"
          [id]="'item-' + item.id"
          [class.section__row--highlighted]="isHighlighted(item)"
          [class.section__row--dimmed]="item.status === 'DISMISSED' || item.status === 'SEEN'"
          [class]="'section__row section__row--' + item.urgency.toLowerCase()"
        >
          <!-- Source icons -->
          <div class="row__sources">
            <app-source-icon *ngFor="let s of item.sources" [provider]="s" />
          </div>

          <!-- Sender -->
          <div class="row__sender">{{ item.senderName }}</div>

          <!-- Subject preview -->
          <div class="row__preview">
            <span class="row__subject">{{ item.subjectOrPreview | truncate:80 }}</span>
            <!-- Multi-source badge -->
            <span class="row__multi-source" *ngIf="item.sources.length > 1">
              {{ item.sources.length }} channels
            </span>
          </div>

          <!-- Reason -->
          <div class="row__reason">{{ item.reasonSnippet }}</div>

          <!-- Time -->
          <div class="row__time">{{ item.receivedAt | relativeTime }}</div>

          <!-- Actions (visible on row hover) -->
          <div class="row__actions">
            <button class="row__action-btn row__action-btn--up"
              matTooltip="Was urgent" (click)="onFeedback(item.id, true); $event.stopPropagation()">
              <mat-icon>thumb_up</mat-icon>
            </button>
            <button class="row__action-btn row__action-btn--down"
              matTooltip="Not urgent" (click)="onFeedback(item.id, false); $event.stopPropagation()">
              <mat-icon>thumb_down</mat-icon>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .section { margin-bottom: $space-2; }

    .section__header {
      display: flex;
      align-items: center;
      gap: $space-2;
      padding: $space-3 $space-6;
      cursor: pointer;
      user-select: none;
      position: relative;
      &:hover { background: $row-hover-bg; }
    }
    .section__chevron {
      color: $text-muted;
      font-size: 20px;
      transition: transform 180ms ease;
      &--collapsed { transform: rotate(-90deg); }
    }
    .section__label {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      letter-spacing: 1px;
      font-weight: $weight-semibold;
    }
    .section__count {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      margin-left: $space-1;
    }
    .section__accent-line {
      height: 2px;
      flex: 1;
      border-radius: 1px;
      margin-left: $space-3;
      &--now   { background: $urgency-now-accent; }
      &--today { background: $urgency-today-accent; }
      &--this_week { background: $urgency-week-accent; }
      &--fyi   { background: $urgency-fyi-accent; }
    }

    // List rows — Drive file list style
    .section__row {
      display: grid;
      grid-template-columns: 48px 160px 1fr 200px 100px 80px;
      align-items: center;
      padding: 0 $space-6;
      height: $row-height;
      border-bottom: $row-border;
      cursor: default;
      transition: background 120ms ease;

      // Urgency left-edge tint (3px left border instead of full bg — more subtle in list view)
      border-left: 3px solid transparent;
      &--now       { border-left-color: $urgency-now-accent;   &:hover { background: $urgency-now-bg; } }
      &--today     { border-left-color: $urgency-today-accent; &:hover { background: $urgency-today-bg; } }
      &--this_week { border-left-color: $urgency-week-accent;  &:hover { background: $urgency-week-bg; } }
      &--fyi       { border-left-color: transparent;           &:hover { background: $row-hover-bg; } }

      &--highlighted { background: $row-selected-bg !important; }
      &--dimmed { opacity: 0.45; }

      // Show actions only on hover
      .row__actions { visibility: hidden; }
      &:hover .row__actions { visibility: visible; }
    }

    .row__sources { display: flex; gap: 4px; align-items: center; }
    .row__sender  { font-size: $text-sm; color: $text-primary; font-weight: $weight-medium; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row__preview { display: flex; align-items: center; gap: $space-2; overflow: hidden; }
    .row__subject { font-size: $text-sm; color: $text-secondary; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row__multi-source {
      font-size: $text-xs;
      background: rgba($urgency-week-accent, 0.15);
      color: $urgency-week-accent;
      padding: 2px 6px;
      border-radius: $radius-badge;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .row__reason { font-size: $text-xs; color: $text-muted; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .row__time   { font-size: $text-xs; color: $text-muted; text-align: right; }
    .row__actions { display: flex; gap: 4px; justify-content: flex-end; }
    .row__action-btn {
      width: 32px; height: 32px;
      background: none;
      border: none;
      color: $text-secondary;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      &:hover { background: $bg-elevated; }
      mat-icon { font-size: 16px; }
      &--up:hover   { color: $urgency-week-accent; }
      &--down:hover { color: $urgency-now-accent; }
    }
  `]
})
export class TriageSectionComponent {
  @Input() urgency!: 'NOW' | 'TODAY' | 'THIS_WEEK' | 'FYI';
  @Input() items: TriageItem[] = [];
  @Input() selectedSlot: FocusSlot | null = null;

  @Output() feedbackSubmitted = new EventEmitter<{ id: string; wasUrgent: boolean }>();

  collapsed = false;

  get urgencyLabel(): string {
    switch (this.urgency) {
      case 'NOW': return 'NOW';
      case 'TODAY': return 'TODAY';
      case 'THIS_WEEK': return 'THIS WEEK';
      case 'FYI': return 'FYI';
      default: return this.urgency;
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  isHighlighted(item: TriageItem): boolean {
    if (!this.selectedSlot) return false;
    const itemTime = new Date(item.receivedAt).getTime();
    const start = new Date(this.selectedSlot.startTime).getTime();
    const end = new Date(this.selectedSlot.endTime).getTime();
    return itemTime >= start && itemTime <= end;
  }

  onFeedback(id: string, wasUrgent: boolean): void {
    this.feedbackSubmitted.emit({ id, wasUrgent });
  }
}
