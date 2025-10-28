import { Observable } from "rxjs";
import { User } from "../../entities/user.entity";

import { AuthCredentials } from "../../entities/auth.entity";
import { AuthRepository } from "../../repositories/auth.repository";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root' // or specific module
})

export class FirstLoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(credentials: AuthCredentials): Observable<any> {
    // Validate email format
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    if (!this.isValidPassword(credentials.password)) {
      throw new Error('Password does not meet requirements');
    }
    
    return this.authRepository.firstLogin(credentials);
  }

  private isValidEmail(email: string): boolean {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPassword(password: string): boolean {
    // Password must be at least 8 characters, with 1 uppercase, 1 number, and 1 special character
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password);
  }
}