import { Route } from '@angular/router';
import { LoginComponent } from '../../features/auth/login/login.component';
import { FirstLoginComponent } from '../../features/auth/first-login/first-login.component';
import { ForgotPasswordComponent } from '../../features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../features/auth/reset-password/reset-password.component';
import { SendInviteComponent } from '../../features/auth/first-login/send-invite/send-invite.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'first-login',
    component: FirstLoginComponent,
    title: 'First Login',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },
  {
    path: 'send-invite',
    component: SendInviteComponent,
    title: 'Send Invite',
  },
];
