import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthRepository } from '../../repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenUseCase {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Executes the refresh token logic.
   * @param refreshToken The refresh token to send to the backend.
   * @returns An observable of the new token (JWT).
   */
  execute(refreshToken: string): Observable<any> {
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    return this.authRepository.refreshToken(refreshToken);
  }
}
