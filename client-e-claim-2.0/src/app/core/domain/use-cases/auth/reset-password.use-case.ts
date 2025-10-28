import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthRepository } from '../../repositories/auth.repository';
import { ResetPasswordType } from '../../entities/auth.entity';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(payload: ResetPasswordType): Observable<any> {
      // Validate email format
      if (!this.isValidEmail(payload.email)) {
        throw new Error('Invalid email format');
      }
      
      return this.authRepository.resetPassword(payload);
    }
  
    private isValidEmail(email: string): boolean {
      // Email validation logic
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
