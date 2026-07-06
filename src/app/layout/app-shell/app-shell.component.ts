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
        <main class="shell__main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';

    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: $bg-base;
      overflow: hidden;
    }
    .shell__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .shell__main {
      flex: 1;
      overflow-y: auto;
      padding: $space-6;
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
