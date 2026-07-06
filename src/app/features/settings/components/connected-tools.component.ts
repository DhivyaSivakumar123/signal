import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Integration, Provider } from '../../../core/models/integration.model';
import { IntegrationsActions } from '../../../state/integrations/integrations.actions';
import { SourceIconComponent } from '../../../shared/components/source-icon/source-icon.component';
import { selectIntegrations, selectIntegrationsLoading } from '../../../state/integrations/integrations.selectors';

@Component({
  selector: 'app-connected-tools',
  standalone: true,
  imports: [CommonModule, SourceIconComponent],
  template: `
    <div class="tools-list">
      <div class="tool-row" *ngFor="let t of tools">
        <app-source-icon [provider]="t.provider" class="tool-icon"></app-source-icon>
        <div class="tool-info">
          <span class="tool-name">{{ t.label }}</span>
          <span class="tool-status" [ngClass]="'tool-status--' + (getActiveStatus(t.provider) | lowercase)">
            {{ getActiveStatus(t.provider) }}
          </span>
        </div>
        <div class="tool-actions">
          <button *ngIf="getActiveStatus(t.provider) === 'Disconnected'" 
                  class="btn btn--connect" 
                  (click)="connect(t.provider)">
            Connect
          </button>
          <button *ngIf="getActiveStatus(t.provider) === 'EXPIRED' || getActiveStatus(t.provider) === 'REVOKED'" 
                  class="btn btn--connect" 
                  (click)="connect(t.provider)">
            Reconnect
          </button>
          <button *ngIf="getActiveStatus(t.provider) === 'ACTIVE'" 
                  class="btn btn--disconnect" 
                  [disabled]="loading"
                  (click)="disconnect(t.provider)">
            {{ loading ? 'Disconnecting...' : 'Disconnect' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .tools-list {
      display: flex;
      flex-direction: column;
      gap: $space-4;
      padding: $space-6;
    }
    
    .tool-row {
      display: flex;
      align-items: center;
      padding: $space-3 $space-4;
      background-color: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
    }
    
    .tool-icon {
      margin-right: $space-3;
      ::ng-deep .icon-wrapper {
        width: 24px;
        height: 24px;
        .icon {
          width: 24px;
          height: 24px;
        }
      }
    }
    
    .tool-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .tool-name {
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      color: $text-primary;
    }
    
    .tool-status {
      font-family: $font-body;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      
      &--active { color: #34A853; }
      &--disconnected { color: $text-muted; }
      &--expired { color: $urgency-now-accent; }
      &--revoked { color: $text-muted; }
    }
    
    .tool-actions {
      margin-left: auto;
    }
    
    .btn {
      height: 32px;
      padding: 0 $space-4;
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      cursor: pointer;
      transition: all 150ms ease;
      
      &--connect {
        background-color: $border-focus;
        color: $text-primary;
        border: none;
        &:hover { background-color: lighten($border-focus, 10%); }
      }
      
      &--disconnect {
        background-color: transparent;
        border: 1px solid $border-subtle;
        color: $text-secondary;
        &:hover {
          background-color: rgba($urgency-now-accent, 0.1);
          border-color: $urgency-now-accent;
          color: $urgency-now-accent;
        }
      }
    }
  `]
})
export class ConnectedToolsComponent implements OnInit, OnDestroy {
  integrations: Integration[] = [];
  loading = false;

  private store = inject(Store);
  private sub = new Subscription();

  tools = [
    { provider: 'SLACK' as Provider, label: 'Slack' },
    { provider: 'GMAIL' as Provider, label: 'Gmail' },
    { provider: 'OUTLOOK' as Provider, label: 'Outlook' },
    { provider: 'CALENDAR' as Provider, label: 'Calendar' }
  ];

  ngOnInit(): void {
    this.sub.add(
      this.store.select(selectIntegrations).subscribe(data => this.integrations = data || [])
    );
    this.sub.add(
      this.store.select(selectIntegrationsLoading).subscribe(loading => this.loading = loading)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getActiveStatus(provider: Provider): string {
    const matched = this.integrations.find(i => i.provider === provider);
    if (!matched) return 'Disconnected';
    return matched.status;
  }

  connect(provider: Provider): void {
    this.store.dispatch(IntegrationsActions.connectIntegration({ provider }));
  }

  disconnect(provider: Provider): void {
    const matched = this.integrations.find(i => i.provider === provider);
    if (matched) {
      this.store.dispatch(IntegrationsActions.deleteIntegration({ id: matched.id }));
    }
  }
}
