import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EventBusService } from '../../../core/infrastructure/services/event-bus.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, LoaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private eventBus: EventBusService) {}

  ngOnInit() {
    this.eventBus.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
