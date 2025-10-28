import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType, Variant } from './button.types';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: Variant = "contained"
  @Input() type: ButtonType = "button"
  @Output() click = new EventEmitter()

  handleClick(event: Event) {
    event.stopPropagation()
    this.click.emit(event)
  }
}
