import { Routes } from '@angular/router';

import { AuthComponent } from '../layouts/auth/auth.component';
import { MainComponent } from '../layouts/main/main.component';
import { authGuard } from '../../core/infrastructure/guards/auth.guard';
import { alreadyLoggedInGuard } from '../../core/infrastructure/guards/already-logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: MainComponent,
    loadChildren: () =>
      import('../layouts/main/main.route').then(
        (mod) => mod.MAIN_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('../layouts/auth/auth.route').then(
        (mod) => mod.AUTH_ROUTES
      ),
    canActivate: [alreadyLoggedInGuard]
  },
  { path: '**', redirectTo: 'dashboard/' },
];

export class AppRoutingModule { }
