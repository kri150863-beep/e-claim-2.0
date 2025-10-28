import { Route } from '@angular/router';
import { roleGuard } from '../../../core/infrastructure/guards/role.guard';
import { UserRoles } from '../../../core/shared/constants/roles.const';

export const MAIN_ROUTES: Route[] = [
  {
    path: 'claims',
    loadComponent: () =>
      import('../../features/claims/claims-list/claims-list.component').then(
        (m) => m.ClaimsListComponent
      ),
    title: 'SWAN - Claims',
    // canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR] }
  },
  {
    path: 'claims-detail',
    loadComponent: () =>
      import('../../features/claims/claims-detail/claims-detail.component').then(
        (m) => m.ClaimsDetailComponent
      ),
    title: 'SWAN - Claims',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR] }
  },
  {
    path: 'claims-new/:id',
    loadComponent: () =>
      import('../../features/claims/claims-new/claims-new.component').then(
        (m) => m.ClaimsNewComponent
      ),
    title: 'SWAN - Claims',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR] }
  },
  {
    path: 'claims/:id',
    loadComponent: () =>
      import('../../features/claims/claims-detail/claims-detail.component').then(
        (m) => m.ClaimsDetailComponent
      ),
    title: 'SWAN - Claims - Form',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR] }
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../../features/profile/setting/setting.component').then(
        (m) => m.SettingComponent
      ),
    title: 'Profile',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR, UserRoles.GARAGE, UserRoles.SPARE_PARTS] }
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('../../features/payments/payments-list/payments-list.component').then(
        (m) => m.PaymentsListComponent
      ),
    title: 'SWAN - Payments',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR, UserRoles.GARAGE, UserRoles.SPARE_PARTS] }
  },
  {
    path: 'payments-details',
    loadComponent: () =>
      import('../../features/payments/payments-details/payments-details.component').then(
        (m) => m.PaymentsDetailsComponent
      ),
    title: 'SWAN - Payments',
    canActivate: [roleGuard],
    data: { roles: [UserRoles.SURVEYOR, UserRoles.GARAGE, UserRoles.SPARE_PARTS] }
  },
  { path: '', redirectTo: '/dashboard/claims', pathMatch: 'full' },
];
