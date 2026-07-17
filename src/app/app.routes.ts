import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/app/triage', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'oauth-callback', loadComponent: () => import('./features/auth/oauth-callback/oauth-callback.component').then(m => m.OAuthCallbackComponent) },
  { path: 'onboarding', canActivate: [authGuard], loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent) },
  {
    path: 'app',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./layout/app-shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: 'triage',    loadComponent: () => import('./features/triage/triage.component').then(m => m.TriageComponent) },
      { path: 'analytics', loadComponent: () => import('./features/team-analytics/team-analytics.component').then(m => m.TeamAnalyticsComponent) },
      { path: 'settings',  loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: '', redirectTo: 'triage', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/app/triage' },
];
