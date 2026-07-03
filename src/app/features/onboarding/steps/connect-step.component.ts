import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Integration, Provider } from '../../../core/models/integration.model';
import { IntegrationService } from '../../../core/services/integration.service';
import { SourceIconComponent } from '../../../shared/components/source-icon/source-icon.component';

@Component({
  selector: 'app-connect-step',
  standalone: true,
  imports: [CommonModule, SourceIconComponent],
  template: `
    <div class="step-content">
      <h2 class="title">Connect your tools</h2>
      
      <div class="grid">
        <!-- Slack Card -->
        <div class="card" [class.card--connected]="isConnected('SLACK')">
          <div class="card__header">
            <app-source-icon provider="SLACK" class="provider-icon"></app-source-icon>
            <span class="provider-name">Slack</span>
          </div>
          <p class="description">Read your mentions and DMs</p>
          <button class="connect-btn" 
                  [disabled]="isConnected('SLACK')"
                  (click)="connect('SLACK')">
            {{ isConnected('SLACK') ? '✓ Connected' : 'Connect' }}
          </button>
        </div>

        <!-- Gmail Card -->
        <div class="card" [class.card--connected]="isConnected('GMAIL')">
          <div class="card__header">
            <app-source-icon provider="GMAIL" class="provider-icon"></app-source-icon>
            <span class="provider-name">Gmail</span>
          </div>
          <p class="description">Scan your inbox for urgent threads</p>
          <button class="connect-btn" 
                  [disabled]="isConnected('GMAIL')"
                  (click)="connect('GMAIL')">
            {{ isConnected('GMAIL') ? '✓ Connected' : 'Connect' }}
          </button>
        </div>

        <!-- Outlook Card -->
        <div class="card" [class.card--connected]="isConnected('OUTLOOK')">
          <div class="card__header">
            <app-source-icon provider="OUTLOOK" class="provider-icon"></app-source-icon>
            <span class="provider-name">Outlook</span>
          </div>
          <p class="description">Scan your Outlook inbox</p>
          <button class="connect-btn" 
                  [disabled]="isConnected('OUTLOOK')"
                  (click)="connect('OUTLOOK')">
            {{ isConnected('OUTLOOK') ? '✓ Connected' : 'Connect' }}
          </button>
        </div>

        <!-- Calendar Card -->
        <div class="card" [class.card--connected]="isConnected('CALENDAR')">
          <div class="card__header">
            <app-source-icon provider="CALENDAR" class="provider-icon"></app-source-icon>
            <span class="provider-name">Calendar</span>
          </div>
          <p class="description">See your free time alongside your feed</p>
          <button class="connect-btn" 
                  [disabled]="isConnected('CALENDAR')"
                  (click)="connect('CALENDAR')">
            {{ isConnected('CALENDAR') ? '✓ Connected' : 'Connect' }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn action-btn--continue" 
                [disabled]="!hasAnyConnected()"
                (click)="next.emit()">
          Continue &rarr;
        </button>
        <button class="action-btn action-btn--skip" (click)="next.emit()">
          Skip for now
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .step-content {
      width: 100%;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-lg;
      color: $text-primary;
      margin-bottom: $space-6;
      font-weight: $weight-semibold;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $space-4;
      margin-bottom: $space-8;
    }
    
    .card {
      background-color: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-4;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      transition: border-color 150ms ease, background-color 150ms ease;
      
      &--connected {
        border-color: #34A853;
        background-color: rgba(#34A853, 0.05);
      }
    }
    
    .card__header {
      display: flex;
      align-items: center;
      gap: $space-2;
      margin-bottom: $space-2;
      
      .provider-icon {
        ::ng-deep .icon-wrapper {
          width: 32px;
          height: 32px;
          .icon {
            width: 32px;
            height: 32px;
          }
        }
      }
      
      .provider-name {
        font-family: $font-body;
        font-weight: $weight-semibold;
        color: $text-primary;
        font-size: $text-base;
      }
    }
    
    .description {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-secondary;
      margin-bottom: $space-4;
      line-height: 1.4;
      min-height: 36px;
    }
    
    .connect-btn {
      width: 100%;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      color: $text-primary;
      cursor: pointer;
      transition: background-color 150ms ease, color 150ms ease;
      
      &:hover:not(:disabled) {
        background-color: $border-subtle;
      }
      
      &:disabled {
        background-color: rgba(#34A853, 0.1);
        border-color: transparent;
        color: #34A853;
        cursor: default;
      }
    }
    
    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-3;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      
      &--continue {
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
        
        &:hover:not(:disabled) {
          background-color: lighten($border-focus, 10%);
        }
        
        &:disabled {
          background-color: $border-subtle;
          color: $text-muted;
          cursor: not-allowed;
        }
      }
      
      &--skip {
        background: none;
        border: none;
        color: $text-secondary;
        font-family: $font-body;
        font-size: $text-sm;
        cursor: pointer;
        text-decoration: underline;
        
        &:hover {
          color: $text-primary;
        }
      }
    }
  `]
})
export class ConnectStepComponent {
  @Input() activeIntegrations: Integration[] = [];
  @Output() next = new EventEmitter<void>();

  private integrationService = inject(IntegrationService);

  isConnected(provider: Provider): boolean {
    return this.activeIntegrations.some(i => i.provider === provider && i.status === 'ACTIVE');
  }

  hasAnyConnected(): boolean {
    return this.activeIntegrations.length > 0;
  }

  connect(provider: Provider): void {
    switch (provider) {
      case 'SLACK':
        this.integrationService.connectSlack();
        break;
      case 'GMAIL':
        this.integrationService.connectGmail();
        break;
      case 'OUTLOOK':
        this.integrationService.connectOutlook();
        break;
      case 'CALENDAR':
        this.integrationService.connectCalendar();
        break;
    }
  }
}
