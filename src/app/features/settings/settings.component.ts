import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';
import { TriageActions } from '../../state/triage/triage.actions';
import { AccountComponent } from './components/account.component';
import { ConnectedToolsComponent } from './components/connected-tools.component';
import { FocusPreferencesComponent } from './components/focus-preferences.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    AccountComponent,
    ConnectedToolsComponent,
    FocusPreferencesComponent
  ],
  template: `
    <div class="settings">
      <h1 class="settings__title">Settings</h1>

      <div class="settings__panel">
        <div class="settings__panel-header">Connected tools</div>
        <app-connected-tools />
      </div>

      <div class="settings__panel">
        <div class="settings__panel-header">Focus preferences</div>
        <app-focus-preferences />
      </div>

      <div class="settings__panel">
        <div class="settings__panel-header">Account</div>
        <app-account />
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .settings { padding: $space-6; max-width: 800px; }
    .settings__title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      margin: 0 0 $space-6;
    }
    .settings__panel {
      background: $bg-elevated;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      overflow: hidden;
      margin-bottom: $space-5;
    }
    .settings__panel-header {
      font-family: $font-display;
      font-size: $text-xs;
      color: $text-muted;
      font-weight: $weight-semibold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: $space-4 $space-6;
      border-bottom: 1px solid $border-subtle;
      background: rgba(255, 255, 255, 0.015);
    }
  `]
})
export class SettingsComponent implements OnInit {
  private store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(IntegrationsActions.loadIntegrations());
    this.store.dispatch(TriageActions.loadPreferences());
  }
}
