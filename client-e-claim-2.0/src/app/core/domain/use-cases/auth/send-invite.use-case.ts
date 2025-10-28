import { Observable } from "rxjs";
import { User } from "../../entities/user.entity";

import { AuthCredentials } from "../../entities/auth.entity";
import { AuthRepository } from "../../repositories/auth.repository";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root' // or specific module
})

export class SendInviteUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(credentials: any): Observable<any> {
    // Validate email format
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    return this.authRepository.sendInvite(credentials);
  }

  private isValidEmail(email: string): boolean {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}