import { Injectable, inject } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastContainerComponent } from './toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private overlay = inject(Overlay);
  private containerInstance: ToastContainerComponent | null = null;

  private ensureContainer(): ToastContainerComponent {
    if (!this.containerInstance) {
      const overlayRef = this.overlay.create({
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        positionStrategy: this.overlay.position()
          .global()
          .bottom('24px')
          .right('24px')
      });
      const portal = new ComponentPortal(ToastContainerComponent);
      this.containerInstance = overlayRef.attach(portal).instance;
    }
    return this.containerInstance;
  }

  success(message: string): void {
    this.ensureContainer().add(message, 'success');
  }

  error(message: string): void {
    this.ensureContainer().add(message, 'error');
  }

  info(message: string): void {
    this.ensureContainer().add(message, 'info');
  }
}
