import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  user$ = this.store.select(selectUser);
  user: any = null;

  static searchQuery = '';
  userMenuOpen = false;

  constructor() {
    this.user$.subscribe(u => this.user = u);
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
}
