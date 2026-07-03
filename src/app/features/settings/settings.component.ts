import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../state/auth/auth.selectors';
import { selectIntegrations } from '../../state/integrations/integrations.selectors';
import { selectPreferences } from '../../state/triage/triage.selectors';
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
    <div class="settings-container">
      <header class="settings-header">
        <h1 class="title">Settings</h1>
        <p class="subtitle">Manage your account profile, integrations, and preferences.</p>
      </header>
      
      <div class="settings-content">
        <app-account-settings [user]="user$ | async"></app-account-settings>
        <app-connected-tools [integrations]="(integrations$ | async) || []"></app-connected-tools>
        <app-focus-preferences-settings [preferences]="preferences$ | async"></app-focus-preferences-settings>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .settings-container {
      padding: $space-6;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .settings-header {
      margin-bottom: $space-6;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      font-weight: $weight-semibold;
      margin-bottom: $space-1;
    }
    
    .subtitle {
      font-family: $font-body;
      font-size: $text-sm;
      color: $text-secondary;
    }
    
    .settings-content {
      display: flex;
      flex-direction: column;
      max-width: 800px;
    }
  `]
})
export class SettingsComponent implements OnInit {
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  integrations$ = this.store.select(selectIntegrations);
  preferences$ = this.store.select(selectPreferences);

  ngOnInit(): void {
    this.store.dispatch(IntegrationsActions.loadIntegrations());
    this.store.dispatch(TriageActions.loadPreferences());
  }
}
