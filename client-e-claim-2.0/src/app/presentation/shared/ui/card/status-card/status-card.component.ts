import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'status-card',
  imports: [ CommonModule ],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss'
})
export class StatusCardComponent {
  @Input() currency = "Rs"
  @Input() count = 0
  @Input() label = ""
  @Input() amount!: string | null
  @Input() isSelected = false
  @Output() click = new EventEmitter<string>()
}
