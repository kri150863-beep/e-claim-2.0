import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private vcr?: ViewContainerRef;

  registerViewContainerRef(vcr: ViewContainerRef): void {
    this.vcr = vcr;
  }

  open<T>(component: Type<T>): ComponentRef<T> | null {
    if (!this.vcr) {
      console.error('ViewContainerRef not registered!');
      return null;
    }

    this.vcr.clear();
    return this.vcr.createComponent(component);
  }

  close(): void {
    this.vcr?.clear();
  }
}