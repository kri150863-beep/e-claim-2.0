import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CircleCheck, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-success-popup',
  imports: [LucideAngularModule],
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss'
})
export class SuccessPopupComponent {
  icons = {
    check: CircleCheck,
  };

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
