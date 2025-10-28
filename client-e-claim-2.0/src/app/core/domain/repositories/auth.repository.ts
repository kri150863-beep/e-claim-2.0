import { Observable } from "rxjs";

import { AuthCredentials, ForgotPassword, InviteToken, ResetPasswordType, ResetToken } from "../entities/auth.entity";
import { User } from "../entities/user.entity";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root' // or specific module
})

export abstract class AuthRepository {
  abstract login(credentials: AuthCredentials): Observable<any>;
  abstract firstLogin(credentials: AuthCredentials): Observable<any>;
  abstract logout(refresToken: any): Observable<any>;
  abstract requestPasswordReset(payload: ForgotPassword): Observable<void>;
  abstract resetPassword(resetData: ResetPasswordType): Observable<void>;
  abstract changePassword(currentPassword: string, newPassword: string): Observable<void>;
  abstract refreshToken(refreshToken: string): Observable<any>;
  abstract verifyResetToken(payload: ResetToken): Observable<any>;
  abstract sendInvite(payload: any): Observable<any>;
  abstract verifyInviteToken(payload: InviteToken): Observable<any>
}