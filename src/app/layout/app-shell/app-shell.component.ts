import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="shell">
      <app-sidebar></app-sidebar>
      <main class="shell__main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .shell {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: $bg-base;
    }
    
    .shell__main {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      background-color: $bg-base;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppShellComponent {}
