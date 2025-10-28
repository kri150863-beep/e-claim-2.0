import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  imports: [CommonModule],
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
}
