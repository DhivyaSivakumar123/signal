import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Integration } from '../../../core/models/integration.model';
import { SourceIconComponent } from '../../../shared/components/source-icon/source-icon.component';

@Component({
  selector: 'app-done-step',
  standalone: true,
  imports: [CommonModule, SourceIconComponent],
  template: `
    <div class="step-content">
      <h2 class="title">You're set.</h2>
      
      <div class="sync-list">
        <div class="sync-item" *ngFor="let i of activeIntegrations">
          <app-source-icon [provider]="i.provider" class="provider-icon"></app-source-icon>
          <span class="provider-name">{{ i.provider | titlecase }}</span>
          <span class="checkmark">✓ Connected</span>
        </div>
      </div>
      
      <p class="sync-status">Signal is syncing. Your first feed will be ready in a few minutes.</p>
      <button class="action-btn" (click)="onComplete()">Go to my feed &rarr;</button>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .step-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-2xl;
      color: $text-primary;
      margin-bottom: $space-6;
      font-weight: $weight-semibold;
    }
    
    .sync-list {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 320px;
      gap: $space-3;
      margin-bottom: $space-8;
    }
    
    .sync-item {
      display: flex;
      align-items: center;
      padding: $space-3 $space-4;
      background-color: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      
      .provider-icon {
        margin-right: $space-3;
      }
      
      .provider-name {
        font-family: $font-body;
        font-weight: $weight-medium;
        color: $text-primary;
      }
      
      .checkmark {
        margin-left: auto;
        color: #34A853;
        font-family: $font-body;
        font-size: $text-xs;
        font-weight: $weight-medium;
      }
    }
    
    .sync-status {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
      margin-bottom: $space-8;
      max-width: 300px;
      line-height: 1.5;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: $space-3 $space-6;
      background-color: $border-focus;
      color: $text-primary;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      border: none;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
  `]
})
export class DoneStepComponent {
  @Input() activeIntegrations: Integration[] = [];
  @Output() finish = new EventEmitter<void>();

  onComplete(): void {
    this.finish.emit();
  }
}
