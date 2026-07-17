import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectUser } from '../../state/auth/auth.selectors';
import { AuthActions } from '../../state/auth/auth.actions';
import { TriageService } from '../../core/services/triage.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { AppShellComponent } from '../app-shell/app-shell.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private store = inject(Store);
  private triageService = inject(TriageService);
  private toast = inject(ToastService);
  private router = inject(Router);

  user$ = this.store.select(selectUser);
  user: any = null;

  static searchQuery = '';
  userMenuOpen = false;

  constructor() {
    this.user$.subscribe(u => {
      this.user = u;
      if (u?.email && !u?.pictureUrl) {
        this.computeGravatarUrl(u.email);
      } else {
        this.resolvedAvatarUrl = u?.pictureUrl || null;
      }
    });
  }

  resolvedAvatarUrl: string | null = null;

  private async computeGravatarUrl(email: string): Promise<void> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Gravatar with ?d=404 — if no gravatar exists, we fall back to initials
    const gravatarUrl = `https://www.gravatar.com/avatar/${hashHex}?s=96&d=404`;
    // Test if Gravatar returns a real image
    const img = new Image();
    img.onload = () => { this.resolvedAvatarUrl = gravatarUrl; };
    img.onerror = () => { this.resolvedAvatarUrl = null; };
    img.src = gravatarUrl;
  }

  get searchQuery(): string {
    return TopbarComponent.searchQuery;
  }

  set searchQuery(value: string) {
    TopbarComponent.searchQuery = value;
  }

  get userInitials(): string {
    const name = this.user?.name ?? '';
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  sendDigest() {
    this.triageService.sendDigestNow().subscribe({
      next: () => this.toast.success('Digest sent'),
      error: () => this.toast.error('Failed to send digest')
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleSidebar() {
    AppShellComponent.sidebarCollapsed = !AppShellComponent.sidebarCollapsed;
  }

  openUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  onSearch(event: Event) {
    // searchQuery is bound via ngModel, change detection handles the rest.
  }

  clearSearch() {
    this.searchQuery = '';
  }

  isTriagePage(): boolean {
    return this.router.url.includes('/triage');
  }
}
