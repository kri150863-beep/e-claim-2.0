import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LogoutUseCase } from './logout.use-case';
import { AuthRepository } from '../../repositories/auth.repository';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let authRepository: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['logout']);

    TestBed.configureTestingModule({
      providers: [
        LogoutUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(LogoutUseCase);
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should execute logout successfully', () => {
    const mockLogoutResponse = { success: true };
    authRepository.logout.and.returnValue(of(mockLogoutResponse));

    useCase.execute().subscribe(response => {
      expect(response).toEqual(mockLogoutResponse);
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });

  it('should handle logout error', () => {
    const error = new Error('Logout failed');
    authRepository.logout.and.returnValue(throwError(() => error));

    useCase.execute().subscribe({
      error: (err) => {
        expect(err).toEqual(error);
      }
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });

  it('should handle network errors during logout', () => {
    const networkError = new Error('Network error');
    authRepository.logout.and.returnValue(throwError(() => networkError));

    useCase.execute().subscribe({
      error: (error) => {
        expect(error.message).toBe('Network error');
      }
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });

  it('should handle server errors during logout', () => {
    const serverError = {
      status: 500,
      error: { message: 'Internal server error' }
    };
    authRepository.logout.and.returnValue(throwError(() => serverError));

    useCase.execute().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe('Internal server error');
      }
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });

  it('should complete successfully even with empty response', () => {
    authRepository.logout.and.returnValue(of(null));

    useCase.execute().subscribe(response => {
      expect(response).toBeNull();
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });

  it('should handle unauthorized errors gracefully', () => {
    const unauthorizedError = {
      status: 401,
      error: { message: 'Unauthorized' }
    };
    authRepository.logout.and.returnValue(throwError(() => unauthorizedError));

    useCase.execute().subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    expect(authRepository.logout).toHaveBeenCalled();
  });
});
