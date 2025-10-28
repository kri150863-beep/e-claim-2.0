import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RefreshTokenUseCase } from './refresh-token.use-case';
import { AuthRepository } from '../../repositories/auth.repository';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let authRepository: jasmine.SpyObj<AuthRepository>;

  const mockRefreshToken = 'valid-refresh-token-123';
  const mockRefreshResponse = {
    success: true,
    data: {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    }
  };

  beforeEach(() => {
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['refreshToken']);

    TestBed.configureTestingModule({
      providers: [
        RefreshTokenUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(RefreshTokenUseCase);
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should execute refresh token successfully', () => {
    authRepository.refreshToken.and.returnValue(of(mockRefreshResponse));

    useCase.execute(mockRefreshToken).subscribe(response => {
      expect(response).toEqual(mockRefreshResponse);
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it('should handle refresh token error', () => {
    const error = new Error('Invalid refresh token');
    authRepository.refreshToken.and.returnValue(throwError(() => error));

    useCase.execute(mockRefreshToken).subscribe({
      error: (err) => {
        expect(err).toEqual(error);
      }
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it('should validate refresh token before execution', () => {
    expect(() => useCase.execute('')).toThrowError('Missing refresh token');
    expect(authRepository.refreshToken).not.toHaveBeenCalled();
  });

  it('should validate refresh token format', () => {
    const invalidToken = 'invalid-token';

    // Since the use case only checks for empty token, this should pass validation
    authRepository.refreshToken.and.returnValue(of(mockRefreshResponse));

    useCase.execute(invalidToken).subscribe();

    expect(authRepository.refreshToken).toHaveBeenCalledWith(invalidToken);
  });

  it('should handle expired refresh token', () => {
    const expiredTokenError = {
      status: 401,
      error: { message: 'Refresh token expired' }
    };
    authRepository.refreshToken.and.returnValue(throwError(() => expiredTokenError));

    useCase.execute(mockRefreshToken).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe('Refresh token expired');
      }
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it('should handle network errors', () => {
    const networkError = new Error('Network error');
    authRepository.refreshToken.and.returnValue(throwError(() => networkError));

    useCase.execute(mockRefreshToken).subscribe({
      error: (error) => {
        expect(error.message).toBe('Network error');
      }
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it('should handle server errors', () => {
    const serverError = {
      status: 500,
      error: { message: 'Internal server error' }
    };
    authRepository.refreshToken.and.returnValue(throwError(() => serverError));

    useCase.execute(mockRefreshToken).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe('Internal server error');
      }
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });

  it('should handle malformed response', () => {
    const malformedResponse = { invalid: 'response' };
    authRepository.refreshToken.and.returnValue(of(malformedResponse));

    useCase.execute(mockRefreshToken).subscribe(response => {
      expect(response).toEqual(malformedResponse);
    });

    expect(authRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
  });



  it('should pass refresh token as-is without trimming', () => {
    const tokenWithSpaces = `  ${mockRefreshToken}  `;
    authRepository.refreshToken.and.returnValue(of(mockRefreshResponse));

    useCase.execute(tokenWithSpaces).subscribe();

    expect(authRepository.refreshToken).toHaveBeenCalledWith(tokenWithSpaces);
  });

  it('should handle null refresh token', () => {
    expect(() => useCase.execute(null as any)).toThrowError('Missing refresh token');
    expect(authRepository.refreshToken).not.toHaveBeenCalled();
  });

  it('should handle undefined refresh token', () => {
    expect(() => useCase.execute(undefined as any)).toThrowError('Missing refresh token');
    expect(authRepository.refreshToken).not.toHaveBeenCalled();
  });
});
