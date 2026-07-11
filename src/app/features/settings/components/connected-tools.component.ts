import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Integration, Provider } from '../../../core/models/integration.model';
import { IntegrationsActions } from '../../../state/integrations/integrations.actions';
import { selectIntegrations, selectIntegrationsLoading, selectIntegrationsLoaded } from '../../../state/integrations/integrations.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-connected-tools',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="tools-grid">
      <div class="tool-card" *ngFor="let t of tools" [ngClass]="{'tool-card--connected': isConnected(t.provider)}">
        <!-- Header: Brand Logo & Title -->
        <div class="tool-header">
          <div class="brand-icon-wrap brand-icon-wrap--{{ t.provider.toLowerCase() }}">
            <!-- Slack Icon -->
            <svg *ngIf="t.provider === 'SLACK'" viewBox="0 0 54 54" class="brand-svg"><path d="M 10.15 34.62 a 5.3 5.3 0 0 1 -5.3 5.28 a 5.3 5.3 0 0 1 -5.3 -5.28 a 5.3 5.3 0 0 1 5.3 -5.3 h 5.3 v 5.3 z m 2.66 0 a 5.3 5.3 0 0 1 5.3 -5.3 h 10.61 a 5.3 5.3 0 0 1 5.3 5.3 v 10.61 a 5.3 5.3 0 0 1 -5.3 5.3 H 18.11 a 5.3 5.3 0 0 1 -5.3 -5.3 V 34.62 z" fill="#36C5F0"/><path d="M 19.38 10.15 a 5.3 5.3 0 0 1 5.28 -5.3 a 5.3 5.3 0 0 1 5.28 5.3 v 5.3 h -5.3 a 5.3 5.3 0 0 1 -5.28 -5.3 z m 0 2.66 a 5.3 5.3 0 0 1 5.28 5.3 v 10.61 a 5.3 5.3 0 0 1 -5.28 5.3 H 8.77 a 5.3 5.3 0 0 1 -5.3 -5.28 V 18.11 a 5.3 5.3 0 0 1 5.3 -5.3 h 10.61 z" fill="#2EB67D"/><path d="M 43.85 19.38 a 5.3 5.3 0 0 1 5.3 -5.28 a 5.3 5.3 0 0 1 5.3 5.28 a 5.3 5.3 0 0 1 -5.3 5.3 h -5.3 v -5.3 z m -2.66 0 a 5.3 5.3 0 0 1 -5.3 5.3 H 25.28 a 5.3 5.3 0 0 1 -5.3 -5.3 V 8.77 a 5.3 5.3 0 0 1 5.3 -5.3 h 10.61 a 5.3 5.3 0 0 1 5.3 5.3 v 10.61 z" fill="#ECB22E"/><path d="M 34.62 43.85 a 5.3 5.3 0 0 1 -5.28 5.3 a 5.3 5.3 0 0 1 -5.28 -5.3 v -5.3 h 5.3 a 5.3 5.3 0 0 1 5.28 5.3 z m 0 -2.66 a 5.3 5.3 0 0 1 -5.28 -5.3 V 25.28 a 5.3 5.3 0 0 1 5.28 -5.3 h 10.61 a 5.3 5.3 0 0 1 5.28 5.3 v 10.61 a 5.3 5.3 0 0 1 -5.28 5.3 H 34.62 z" fill="#E01E5A"/></svg>
            
            <!-- Gmail Icon -->
            <svg *ngIf="t.provider === 'GMAIL'" viewBox="0 0 24 24" class="brand-svg"><path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6l8 5 8-5v2l-8 5-8-5V6zm0 12V8.5l8 5 8-5V18H4z"/></svg>

            <!-- Outlook Icon -->
            <svg *ngIf="t.provider === 'OUTLOOK'" viewBox="0 0 24 24" class="brand-svg"><path fill="#0078D4" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 13.5H9v-2.1h1.5v2.1zm0-3.2H9V8.5h1.5v4.8zm4 3.2h-1.5v-4.8h1.5v4.8zm0-5.9h-1.5V8.5h1.5v2.1z"/></svg>

            <!-- Calendar Icon -->
            <svg *ngIf="t.provider === 'CALENDAR'" viewBox="0 0 24 24" class="brand-svg"><path fill="#34A853" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><rect x="8" y="12" width="8" height="5" fill="#34A853" rx="1"/></svg>
          </div>
          <div class="tool-meta">
            <span class="tool-name">{{ t.label }}</span>
            <span class="tool-desc">{{ t.desc }}</span>
          </div>
        </div>

        <!-- Footer: Status & Actions -->
        <div class="tool-footer">
          <!-- Checking state: integrations not yet loaded -->
          <ng-container *ngIf="checking; else resolvedState">
            <div class="status-indicator status-indicator--checking">
              <span class="status-dot status-dot--pulse"></span>
              <span class="status-text">Checking...</span>
            </div>
            <div class="actions">
              <button class="btn btn--checking" disabled>
                <mat-icon class="spin-icon">sync</mat-icon> Checking...
              </button>
            </div>
          </ng-container>

          <!-- Resolved state: show real status + correct button -->
          <ng-template #resolvedState>
            <div class="status-indicator status-indicator--{{ getActiveStatus(t.provider).toLowerCase() }}">
              <span class="status-dot"></span>
              <span class="status-text">{{ getActiveStatus(t.provider) }}</span>
            </div>
            <div class="actions">
              <button *ngIf="getActiveStatus(t.provider) === 'Disconnected'"
                      class="btn btn--connect"
                      [disabled]="loading"
                      (click)="connect(t.provider)">
                <mat-icon>add</mat-icon> Connect
              </button>
              <button *ngIf="getActiveStatus(t.provider) === 'EXPIRED' || getActiveStatus(t.provider) === 'REVOKED'"
                      class="btn btn--reconnect"
                      [disabled]="loading"
                      (click)="connect(t.provider)">
                <mat-icon>refresh</mat-icon> Reconnect
              </button>
              <button *ngIf="getActiveStatus(t.provider) === 'ACTIVE'"
                      class="btn btn--disconnect"
                      [disabled]="loading"
                      (click)="disconnect(t.provider)">
                {{ loading ? 'Disconnecting...' : 'Disconnect' }}
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .tools-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $space-4;
      padding: $space-6;
    }

    @media(min-width: 600px) {
      .tools-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .tool-card {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: $space-5;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &--connected {
        background: rgba(255, 255, 255, 0.02);
      }
    }
    
    .tool-header {
      display: flex;
      align-items: flex-start;
      gap: $space-4;
    }

    .brand-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid $border-subtle;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .brand-svg {
        width: 22px;
        height: 22px;
      }
    }
    
    .tool-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    
    .tool-name {
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-semibold;
      color: $text-primary;
    }

    .tool-desc {
      font-family: $font-body;
      font-size: $text-xs;
      color: $text-muted;
      line-height: 1.3;
    }
    
    .tool-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: $space-4;
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 12px;
      border: 1px solid transparent;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }

      .status-text {
        font-family: $font-display;
        font-size: 9px;
        font-weight: $weight-semibold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      &--active {
        background: rgba(52, 168, 83, 0.1);
        border-color: rgba(52, 168, 83, 0.2);
        .status-dot { background: #34A853; }
        .status-text { color: #34A853; }
      }

      &--disconnected {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.06);
        .status-dot { background: $text-muted; }
        .status-text { color: $text-muted; }
      }

      &--expired, &--revoked {
        background: rgba(234, 67, 53, 0.1);
        border-color: rgba(234, 67, 53, 0.2);
        .status-dot { background: #ea4335; }
        .status-text { color: #ea4335; }
      }

      &--checking {
        background: rgba(251, 188, 4, 0.08);
        border-color: rgba(251, 188, 4, 0.2);
        .status-dot {
          background: #fbbc04;
          &--pulse {
            animation: pulse-dot 1.2s ease-in-out infinite;
          }
        }
        .status-text { color: #fbbc04; }
      }
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .btn {
      height: 30px;
      padding: 0 $space-4;
      font-family: $font-body;
      font-size: $text-xs;
      font-weight: $weight-semibold;
      border-radius: $radius-badge;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 150ms ease;
      
      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      &--connect {
        background-color: #3683f6;
        color: #ffffff;
        border: none;
        box-shadow: 0 1px 2px rgba(54, 131, 246, 0.2);
        &:hover { background-color: #4a91f8; }
      }

      &--reconnect {
        background-color: #f5a623;
        color: #1e1f20;
        border: none;
        &:hover { background-color: #f7b443; }
      }
      
      &--disconnect {
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: $text-secondary;
        &:hover {
          background-color: rgba(234, 67, 53, 0.08);
          border-color: rgba(234, 67, 53, 0.4);
          color: #ea4335;
        }
      }

      &--checking {
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: $text-muted;
        cursor: not-allowed;
        opacity: 0.7;
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      }
    }
  `]
})
export class ConnectedToolsComponent implements OnInit, OnDestroy {
  integrations: Integration[] = [];
  loading = false;
  checking = true; // true until first load of integrations completes

  private store = inject(Store);
  private sub = new Subscription();

  tools = [
    { provider: 'SLACK' as Provider, label: 'Slack', desc: 'Sync channels, threads, and direct messages.' },
    { provider: 'GMAIL' as Provider, label: 'Gmail', desc: 'Monitor inbox folders and prioritize sender emails.' },
    { provider: 'OUTLOOK' as Provider, label: 'Outlook', desc: 'Sync work inbox emails and active folders.' },
    { provider: 'CALENDAR' as Provider, label: 'Calendar', desc: 'Track meeting invites and daily schedules.' }
  ];

  ngOnInit(): void {
    // If already loaded in store (navigated back), skip checking state
    this.store.select(selectIntegrationsLoaded).pipe(take(1)).subscribe(loaded => {
      if (loaded) this.checking = false;
    });

    // Always re-fetch fresh data
    this.store.dispatch(IntegrationsActions.loadIntegrations());

    // Track integrations data
    this.sub.add(
      this.store.select(selectIntegrations).subscribe(data => {
        this.integrations = data || [];
      })
    );

    // Track loading: once loading goes false, checking is done
    this.sub.add(
      this.store.select(selectIntegrationsLoading).subscribe(loading => {
        this.loading = loading;
        if (!loading && this.checking) {
          this.checking = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  isConnected(provider: Provider): boolean {
    return this.getActiveStatus(provider) === 'ACTIVE';
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

