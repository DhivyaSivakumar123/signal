import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-list">
      <div *ngFor="let toast of toasts()" 
           class="toast toast--{{toast.type}}" 
           (click)="remove(toast.id)">
        <div class="toast__content">{{ toast.message }}</div>
        <button class="toast__close">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/tokens';
    
    .toast-list {
      display: flex;
      flex-direction: column;
      gap: $space-3;
      pointer-events: none;
    }
    
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 280px;
      max-width: 400px;
      padding: $space-3 $space-4;
      background: $bg-surface;
      border-radius: $radius-card;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      border-left: 4px solid $text-secondary;
      color: $text-primary;
      font-family: $font-body;
      font-size: $text-sm;
      animation: slide-in 200ms cubic-bezier(0, 0, 0.2, 1);
      cursor: pointer;
      transition: transform 180ms ease, opacity 180ms ease;
      
      &--success {
        border-left-color: $urgency-week-accent;
      }
      
      &--error {
        border-left-color: $urgency-now-accent;
      }
      
      &--info {
        border-left-color: $text-secondary;
      }
    }
    
    .toast__close {
      margin-left: $space-3;
      color: $text-secondary;
      background: none;
      border: none;
      cursor: pointer;
      font-size: $text-lg;
      font-weight: $weight-semibold;
      line-height: 1;
      padding: 0;
      opacity: 0.6;
      &:hover { opacity: 1; }
    }
    
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  toasts = signal<ToastData[]>([]);

  add(message: string, type: 'success' | 'error' | 'info'): string {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update(current => {
      const next = [...current, { id, message, type }];
      if (next.length > 3) {
        next.shift();
      }
      return next;
    });

    setTimeout(() => this.remove(id), 3000);
    return id;
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
