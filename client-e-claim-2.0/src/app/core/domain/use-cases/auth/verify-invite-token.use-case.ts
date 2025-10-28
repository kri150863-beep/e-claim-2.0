import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthRepository } from '../../repositories/auth.repository';
import { ForgotPassword, InviteToken, ResetToken } from '../../entities/auth.entity';

@Injectable({
  providedIn: 'root',
})
export class VerifyInviteTokenUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(payload: InviteToken): Observable<any> {
      // Validate email format
      if (!this.isValidEmail(payload.email)) {
        throw new Error('Invalid email format');
      }
      
      return this.authRepository.verifyInviteToken(payload);
    }
  
    private isValidEmail(email: string): boolean {
      // Email validation logic
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
