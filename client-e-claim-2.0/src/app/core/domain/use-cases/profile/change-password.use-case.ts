import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthRepository } from "../../repositories/auth.repository";

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordUseCase {
  constructor(private authRepository: AuthRepository) { }

  execute(currentPassword: string, newPassword: string): Observable<void> {
    // Validate password requirements
    if (!this.isValidPassword(newPassword)) {
      return throwError(() => new Error('New password does not meet requirements'));
    }

    if (currentPassword === newPassword) {
      return throwError(() => new Error('New password must be different from current password'));
    }

    return this.authRepository.changePassword(currentPassword, newPassword);
  }

  private isValidPassword(password: string): boolean {
    // Password validation logic
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }
}
