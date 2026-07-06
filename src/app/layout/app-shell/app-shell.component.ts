import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent
  ],
  template: `
    <div class="shell">
      <app-topbar />
      <div class="shell__body">
        <app-sidebar [collapsed]="sidebarCollapsed" />
        <div class="shell__content-container">
          <main class="shell__main">
            <router-outlet />
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: $topbar-bg;
      overflow: hidden;
    }
    .shell__body {
      display: flex;
      flex: 1;
      overflow: hidden;
      background: $sidebar-bg;
    }
    .shell__content-container {
      flex: 1;
      overflow: hidden;
      padding: 0 $space-6 $space-6 0; /* Creates margins around the container matching Drive */
      background: $sidebar-bg;
    }
    .shell__main {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      background: $bg-surface; /* Lighter dark surface (container background) */
      border-radius: 16px; /* Rounded corners matching Google Drive */
      border: 1px solid $border-subtle;
    }
  `]
})
export class AppShellComponent {
  static sidebarCollapsed = false;

  get sidebarCollapsed(): boolean {
    return AppShellComponent.sidebarCollapsed;
  }

  set sidebarCollapsed(val: boolean) {
    AppShellComponent.sidebarCollapsed = val;
  }
}
