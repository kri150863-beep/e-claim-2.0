import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { FinancialInfoComponent } from '../financial-info/financial-info.component';
import { AdminSettingsComponent } from '../admin-settings/admin-settings.component';
import { SecuritySettingsComponent } from '../security-settings/security-settings.component';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ProfileService } from '../../../../core/infrastructure/services/profile.service';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from '../../../../core/domain/entities/user.entity';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { AccountInformation } from '../../../../core/domain/entities/profile.entity';

type ProfileTab =
  | 'account'
  | 'financial'
  | 'admin'
  | 'security'
  | 'notifications';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AccountInfoComponent,
    FinancialInfoComponent,
    AdminSettingsComponent,
    SecuritySettingsComponent,
  ],
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  private userSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  selectedTab: ProfileTab = 'account';
  currentUser: User | null = null;
  isLoading$!: Observable<boolean>;
  accountInfo: AccountInformation = {};

  tabs = [
    { id: 'account', label: 'Account Information' },
    { id: 'financial', label: 'Financial Information' },
    { id: 'admin', label: 'Administrative Settings' },
    { id: 'security', label: 'Security Settings' },
  ];

  constructor(
    private toast: ToastService,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    this.userSubscription = this.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.loadProfile(user?.username || '');
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tabId: any): void {
    this.selectedTab = tabId;
  }

  onBackToClaimList(): void {
    this.router.navigate(['dashboard/claims']);
  }

  private loadProfile(email: string): void {
    this.profileService
      .loadProfile(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const user = res;
          // this.currentUser = user;
          this.accountInfo = res?.account_information || {};
        },
        error: (error: any) => {
          this.toast.error(error || 'Failed to load account information');
        },
      });
  }
}
