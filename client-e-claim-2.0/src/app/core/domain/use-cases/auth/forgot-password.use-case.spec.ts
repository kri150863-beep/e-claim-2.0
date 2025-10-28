import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { AuthRepository } from '../../repositories/auth.repository';
import { ForgotPassword } from '../../entities/auth.entity';

describe('ForgotPasswordUseCase', () => {
  let useCase: ForgotPasswordUseCase;
  let authRepository: jasmine.SpyObj<AuthRepository>;

  const mockForgotPasswordPayload: ForgotPassword = {
    email: 'test@example.com'
  };

  beforeEach(() => {
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['requestPasswordReset']);

    TestBed.configureTestingModule({
      providers: [
        ForgotPasswordUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(ForgotPasswordUseCase);
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should execute forgot password successfully', () => {
    authRepository.requestPasswordReset.and.returnValue(of(undefined));

    useCase.execute(mockForgotPasswordPayload).subscribe(response => {
      expect(response).toBeUndefined();
    });

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(mockForgotPasswordPayload);
  });

  it('should handle forgot password error', () => {
    const error = new Error('Email not found');
    authRepository.requestPasswordReset.and.returnValue(throwError(() => error));

    useCase.execute(mockForgotPasswordPayload).subscribe({
      error: (err) => {
        expect(err).toEqual(error);
      }
    });

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(mockForgotPasswordPayload);
  });

  it('should validate email before requesting password reset', () => {
    const invalidPayload: ForgotPassword = { email: '' };

    expect(() => useCase.execute(invalidPayload)).toThrowError('Invalid email format');
    expect(authRepository.requestPasswordReset).not.toHaveBeenCalled();
  });

  it('should validate email format', () => {
    const invalidEmailPayload: ForgotPassword = { email: 'invalid-email' };

    expect(() => useCase.execute(invalidEmailPayload)).toThrowError('Invalid email format');
    expect(authRepository.requestPasswordReset).not.toHaveBeenCalled();
  });

  it('should handle network errors', () => {
    const networkError = new Error('Network error');
    authRepository.requestPasswordReset.and.returnValue(throwError(() => networkError));

    useCase.execute(mockForgotPasswordPayload).subscribe({
      error: (error) => {
        expect(error.message).toBe('Network error');
      }
    });

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(mockForgotPasswordPayload);
  });

  it('should handle server errors', () => {
    const serverError = {
      status: 500,
      error: { message: 'Internal server error' }
    };
    authRepository.requestPasswordReset.and.returnValue(throwError(() => serverError));

    useCase.execute(mockForgotPasswordPayload).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe('Internal server error');
      }
    });

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(mockForgotPasswordPayload);
  });

  it('should handle user not found error', () => {
    const userNotFoundError = {
      status: 404,
      error: { message: 'User not found' }
    };
    authRepository.requestPasswordReset.and.returnValue(throwError(() => userNotFoundError));

    useCase.execute(mockForgotPasswordPayload).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe('User not found');
      }
    });

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith(mockForgotPasswordPayload);
  });



  it('should pass email as-is without trimming', () => {
    const payloadWithSpaces: ForgotPassword = { email: '  test@example.com  ' };

    expect(() => useCase.execute(payloadWithSpaces)).toThrowError('Invalid email format');
    expect(authRepository.requestPasswordReset).not.toHaveBeenCalled();
  });

  it('should pass email as-is without case conversion', () => {
    const uppercaseEmailPayload: ForgotPassword = { email: 'TEST@EXAMPLE.COM' };
    authRepository.requestPasswordReset.and.returnValue(of(undefined));

    useCase.execute(uppercaseEmailPayload).subscribe();

    expect(authRepository.requestPasswordReset).toHaveBeenCalledWith({ email: 'TEST@EXAMPLE.COM' });
  });
});
