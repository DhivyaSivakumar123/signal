import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WelcomeStepComponent } from './steps/welcome-step.component';
import { ConnectStepComponent } from './steps/connect-step.component';
import { DoneStepComponent } from './steps/done-step.component';
import { selectUser } from '../../state/auth/auth.selectors';
import { selectActiveIntegrations } from '../../state/integrations/integrations.selectors';
import { IntegrationsActions } from '../../state/integrations/integrations.actions';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeStepComponent,
    ConnectStepComponent,
    DoneStepComponent
  ],
  template: `
    <div class="onboarding-container">
      <div class="onboarding-card">
        <div class="header-row">
          <span class="step-indicator">{{ getFormattedStep() }} / 03</span>
        </div>
        
        <div class="step-wrapper">
          <app-welcome-step 
            *ngIf="step === 1" 
            [user]="user$ | async" 
            (next)="nextStep()">
          </app-welcome-step>
          
          <app-connect-step 
            *ngIf="step === 2" 
            [activeIntegrations]="(activeIntegrations$ | async) || []" 
            (next)="nextStep()">
          </app-connect-step>
          
          <app-done-step 
            *ngIf="step === 3" 
            [activeIntegrations]="(activeIntegrations$ | async) || []" 
            (finish)="onFinish()">
          </app-done-step>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .onboarding-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100vw;
      background-color: $bg-base;
      padding: $space-4;
    }
    
    .onboarding-card {
      width: 100%;
      max-width: 480px;
      background-color: $bg-surface;
      border: 1px solid $border-subtle;
      border-radius: $radius-card;
      padding: $space-6 $space-8 $space-10;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    
    .header-row {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-bottom: $space-4;
    }
    
    .step-indicator {
      font-family: $font-display;
      font-size: $text-sm;
      color: $text-muted;
    }
    
    .step-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `]
})
export class OnboardingComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  step = 1;
  user$ = this.store.select(selectUser);
  activeIntegrations$ = this.store.select(selectActiveIntegrations);

  ngOnInit(): void {
    this.store.dispatch(IntegrationsActions.loadIntegrations());
  }

  nextStep(): void {
    this.step++;
  }

  getFormattedStep(): string {
    return this.step.toString().padStart(2, '0');
  }

  onFinish(): void {
    localStorage.setItem('onboarding_completed', 'true');
    this.router.navigate(['/app/triage']);
  }
}
