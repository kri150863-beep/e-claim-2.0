import { Observable, tap } from "rxjs";

import { HttpClient } from '@angular/common/http';

import { User } from "../../domain/entities/user.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { AuthCredentials, ForgotPassword, InviteToken, ResetPasswordType, ResetToken } from "../../domain/entities/auth.entity";
import { environment } from '../../../../environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService implements AuthRepository {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: AuthCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(user => {
        if (credentials.rememberMe) {
          this.storeRememberedCredentials(credentials.email);
        }
      })
    );
  }

  firstLogin(credentials: AuthCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/first-login`, credentials).pipe(
      tap(user => {
        if (credentials.rememberMe) {
          this.storeRememberedCredentials(credentials.email);
        }
      })
    );
  }

  logout(refresToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {refresToken});
  }

  requestPasswordReset(payload: ForgotPassword): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email: payload.email });
  }

  verifyResetToken(payload: ResetToken): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/auth/verify-reset-token`, payload);
  }

  resetPassword(resetData: ResetPasswordType): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/reset-password`, resetData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/refresh-token`, {
      refresh_tokens: refreshToken
    });
  }

  sendInvite(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/send-invite`, credentials).pipe(
      tap(res => { })
    );
  }

  verifyInviteToken(payload: InviteToken): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/auth/validate-invite`, payload);
  }

  private storeRememberedCredentials(email: string): void {
    // Store email in secure storage (e.g., encrypted local storage)
    localStorage.setItem('rememberedEmail', email);
  }
}