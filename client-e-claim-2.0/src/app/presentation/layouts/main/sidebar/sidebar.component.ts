import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../../core/infrastructure/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgFor, RouterLinkActive, CommonModule],
  // standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = [
    { label: 'Claims', icon: 'fas fa-regular fa-gauge', link: '/dashboard/claims' },
    { label: 'Payments', icon: 'fa-regular fa-credit-card', link: '/dashboard/payments' },
  ];

  constructor(public sidebarService: SidebarService) {}
}
