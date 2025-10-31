import {
  Observable,
  BehaviorSubject,
  tap,
  Subject,
  combineLatest,
  map,
  filter,
  switchMap,
  distinctUntilChanged,
  catchError,
  throwError,
} from 'rxjs';

import { User } from '../../domain/entities/user.entity';
import {
  AuthCredentials,
  ForgotPassword,
  InviteToken,
  ResetPasswordType,
  ResetToken,
} from '../../domain/entities/auth.entity';

import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { LogoutUseCase } from '../../domain/use-cases/auth/logout.use-case';

import { Injectable } from '@angular/core';
import { RefreshTokenUseCase } from '../../domain/use-cases/auth/refresh-token.use-case';
import { UserRole } from '../../shared/constants/roles.const';
import { StorageService } from './storage.service';
import { ForgotPasswordUseCase } from '../../domain/use-cases/auth/forgot-password.use-case';
import { VerifyResetTokenUseCase } from '../../domain/use-cases/auth/verify-reset-token.use-case';
import { ResetPasswordUseCase } from '../../domain/use-cases/auth/reset-password.use-case';
import { SendInviteUseCase } from '../../domain/use-cases/auth/send-invite.use-case';
import { VerifyInviteTokenUseCase } from '../../domain/use-cases/auth/verify-invite-token.use-case';
import { FirstLoginUseCase } from '../../domain/use-cases/auth/first-login.use-case';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private loginUseCase: LoginUseCase,
    private firstLoginUseCase: FirstLoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private storageService: StorageService,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private verifyResetTokenUseCase: VerifyResetTokenUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private sendInviteUseCase: SendInviteUseCase,
    private verifyInviteTokenUseCase: VerifyInviteTokenUseCase,
    private router: Router
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = this.getAccessToken();
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: AuthCredentials): Observable<any> {
    return this.loginUseCase.execute(credentials).pipe(
      tap((res) => {
        const token = res?.data?.accessToken;

        if (!token) {
          throw new Error('No token received');
        }

        const user = this.decodeToken(token);
        if (!user) {
          throw new Error('Invalid token payload');
        }

        // this.decodeMockToken(res);
        this.currentUserSubject.next(user);

        this.setTokens(res?.data?.accessToken, res?.data?.refreshToken);
      })
    );
  }

  logout(): Observable<any> {
    const refresToken = this.getRefreshToken();
    return this.logoutUseCase.execute(refresToken).pipe(
      tap((res) => {
        this.currentUserSubject.next(null);
        this.clearTokens();
        this.router.navigate(['/auth/login']);
      }),
      catchError((error) => {
        this.currentUserSubject.next(null);
        this.clearTokens();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  requestPasswordReset(payload: ForgotPassword): Observable<any> {
    return this.forgotPasswordUseCase.execute(payload);
  }

  verifyResetToken(payload: ResetToken): Observable<any> {
    return this.verifyResetTokenUseCase.execute(payload);
  }

  resetPassword(payload: ResetPasswordType): Observable<any> {
    return this.resetPasswordUseCase.execute(payload);
  }

  refreshToken(): Observable<any> {
    const token = this.getRefreshToken();
    if (!token) {
      throw new Error('Refresh token not found');
    }

    return this.refreshTokenUseCase.execute(token).pipe(
      tap((res) => {
        this.setTokens(res?.data?.accessToken, res?.data?.refreshToken);
      })
    );
  }

  sendInvite(credentials: any): Observable<any> {
    return this.sendInviteUseCase.execute(credentials).pipe(tap((res) => {}));
  }

  verifyInviteToken(payload: InviteToken): Observable<any> {
    return this.verifyInviteTokenUseCase.execute(payload);
  }

  firstLogin(credentials: AuthCredentials): Observable<any> {
    return this.firstLoginUseCase.execute(credentials).pipe(
      tap((res) => {
        const token = res?.data?.accessToken;

        if (!token) {
          throw new Error('No token received');
        }

        const user = this.decodeToken(token);
        if (!user) {
          throw new Error('Invalid token payload');
        }

        // this.decodeMockToken(res);
        this.currentUserSubject.next(user);

        // Optional: store token in localStorage for persistence
        this.setTokens(res?.data?.accessToken, res?.data?.refreshToken);
      })
    );
  }

  getCurrentUser(): User | null {
    const token = this.getAccessToken();
    return token ? this.decodeToken(token) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() || !!this.getAccessToken();
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes(role) ?? false;
  }

  decodeToken(token: string): any {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid mock token format');
      }

      // Decode the payload (second part)
      const decodedPayload = atob(parts[1]);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error decoding mock token', e);
      return null;
    }
  }

  getToken(): string | null {
    return this.storageService.get('accessToken');
  }

  getAccessToken(): string | null {
    return this.storageService.get('accessToken');
  }

  getRefreshToken(): string | null {
    return this.storageService.get('refreshToken');
  }

  setTokens(token: string, refreshToken: string): void {
    this.storageService.set('accessToken', token);
    this.storageService.set('refreshToken', refreshToken);
  }

  clearTokens(): void {
    this.storageService.remove('accessToken');
    this.storageService.remove('refreshToken');
    this.storageService.remove('mock_users_data');
  }

  setRememberedEmail(email: string): void {
    if (typeof document === 'undefined') return;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 14); // 14 jours
    document.cookie = `rememberedEmail=${email}; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getRememberedEmail(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const match = cookies.find((c) => c.trim().startsWith('rememberedEmail='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  clearRememberedEmail() {
    document.cookie =
      'rememberedEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  setRememberedPassword(password: string): void {
    if (typeof document === 'undefined') return;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 14); // 14 days
    const encoded = btoa(password);
    document.cookie = `rememberedPassword=${encodeURIComponent(
      encoded
    )}; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getRememberedPassword(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const match = cookies.find((c) =>
      c.trim().startsWith('rememberedPassword=')
    );
    return match ? atob(decodeURIComponent(match.split('=')[1])) : null;
  }

  clearRememberedPassword(): void {
    document.cookie =
      'rememberedPassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
