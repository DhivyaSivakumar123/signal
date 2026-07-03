import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-welcome-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-content">
      <h2 class="title">Hello, {{ user?.name || 'there' }}.</h2>
      <p class="subtitle">Connect your tools. Signal reads your messages so you don't have to read all of them.</p>
      <button class="action-btn" (click)="onStart()">Get started &rarr;</button>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .step-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .title {
      font-family: $font-display;
      font-size: $text-xl;
      color: $text-primary;
      margin-bottom: $space-4;
      font-weight: $weight-semibold;
    }
    
    .subtitle {
      font-family: $font-body;
      font-size: $text-base;
      color: $text-secondary;
      margin-bottom: $space-8;
      max-width: 320px;
      line-height: 1.5;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: $space-3 $space-6;
      background-color: $border-focus;
      color: $text-primary;
      font-family: $font-body;
      font-size: $text-sm;
      font-weight: $weight-medium;
      border-radius: $radius-badge;
      border: none;
      cursor: pointer;
      transition: background-color 150ms ease;
      
      &:hover {
        background-color: lighten($border-focus, 10%);
      }
    }
  `]
})
export class WelcomeStepComponent {
  @Input() user: User | null = null;
  @Output() next = new EventEmitter<void>();

  onStart(): void {
    this.next.emit();
  }
}
