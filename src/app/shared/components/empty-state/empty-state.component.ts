import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="empty-state">
      <h3 class="empty-state__headline">{{ headline }}</h3>
      <p class="empty-state__subline">{{ subline }}</p>
      <a *ngIf="ctaLabel && ctaRoute" 
         [routerLink]="ctaRoute" 
         class="empty-state__cta">
        {{ ctaLabel }}
      </a>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: $space-10;
      border: 1px dashed $border-subtle;
      border-radius: $radius-card;
      background: $bg-surface;
      min-height: 240px;
      width: 100%;
    }
    
    .empty-state__headline {
      font-family: $font-display;
      font-size: $text-2xl;
      color: $text-primary;
      margin-bottom: $space-2;
      font-weight: $weight-semibold;
    }
    
    .empty-state__subline {
      font-family: $font-body;
      font-size: $text-base;
      color: $text-secondary;
      margin-bottom: $space-6;
      max-width: 400px;
    }
    
    .empty-state__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: $space-2 $space-4;
      background-color: $border-focus;
      color: $text-primary;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() headline!: string;
  @Input() subline!: string;
  @Input() ctaLabel?: string;
  @Input() ctaRoute?: string;
}
