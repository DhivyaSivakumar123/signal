import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastContainerComponent } from './toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private overlay = inject(Overlay);
  private containerInstance: ToastContainerComponent | null = null;
  private overlayRef: OverlayRef | null = null;

  private ensureContainer(): ToastContainerComponent {
    if (!this.containerInstance) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        positionStrategy: this.overlay.position()
          .global()
          .bottom('24px')
          .right('24px')
      });
      const portal = new ComponentPortal(ToastContainerComponent);
      this.containerInstance = this.overlayRef.attach(portal).instance;
      this.containerInstance.onEmpty = () => this.dispose();
    }
    return this.containerInstance;
  }

  private dispose(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.containerInstance = null;
    }
  }

  success(message: string): void {
    this.ensureContainer().add(message, 'success');
  }

  error(message: string, persist = false): void {
    this.ensureContainer().add(message, 'error', persist);
  }

  info(message: string): void {
    this.ensureContainer().add(message, 'info');
  }
}
