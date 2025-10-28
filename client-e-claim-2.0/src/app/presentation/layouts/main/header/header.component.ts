import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../../core/infrastructure/services/sidebar.service';
import { Observable, Subject } from 'rxjs';
import { User } from '../../../../core/domain/entities/user.entity';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  // standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  showSignOutModal = false;
  currentUser$: Observable<User | null>;
  private userSubscription: any;
  private destroy$ = new Subject<void>();
  currentUser: any;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private sidebarService: SidebarService,
    private elRef: ElementRef
  ) {
    this.currentUser$ = this.authService.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    this.userSubscription = this.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSignOutModal(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();  // Added to prevent event bubbling
    this.showSignOutModal = true;
  }

  closeSignOutModal() {
    this.showSignOutModal = false;
  }

  confirmSignOut() {
    this.showSignOutModal = false;
    this.authService.logout().subscribe({
        next: () => {
          this.authService.clearTokens();
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.toast.error(error);
        },
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  redirectToProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/dashboard/profile']);
  }

  // Ferme le dropdown quand on clique à l'extérieur
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  // Ferme le dropdown lors de la navigation
  @HostListener('window:popstate')
  onPopState() {
    this.dropdownOpen = false;
  }
}
