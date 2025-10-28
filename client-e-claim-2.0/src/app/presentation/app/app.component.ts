import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupService } from '../../core/infrastructure/services/popup.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ticket';
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;

  constructor(private popupService: PopupService) {}

  ngAfterViewInit() {
    this.popupService.registerViewContainerRef(this.popupContainer);
  }
}
