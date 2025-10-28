import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginUseCase } from './login.use-case';
import { AuthRepository } from '../../repositories/auth.repository';
import { AuthCredentials } from '../../entities/auth.entity';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authRepository: jasmine.SpyObj<AuthRepository>;

  const mockCredentials: AuthCredentials = {
    email: 'test@example.com',
    password: 'Password123!', // Valid password: 8+ chars, uppercase, number, special char
    rememberMe: false
  };

  const mockLoginResponse = {
    success: true,
    data: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        roles: ['USER']
      }
    }
  };

  beforeEach(() => {
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['login']);

    TestBed.configureTestingModule({
      providers: [
        LoginUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(LoginUseCase);
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should execute login successfully', () => {
    authRepository.login.and.returnValue(of(mockLoginResponse));

    useCase.execute(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
    });

    expect(authRepository.login).toHaveBeenCalledWith(mockCredentials);
  });

  it('should handle login error', () => {
    const error = new Error('Login failed');
    authRepository.login.and.returnValue(throwError(() => error));

    useCase.execute(mockCredentials).subscribe({
      error: (err) => {
        expect(err).toEqual(error);
      }
    });

    expect(authRepository.login).toHaveBeenCalledWith(mockCredentials);
  });

  it('should validate credentials before login', () => {
    const invalidCredentials: AuthCredentials = {
      email: '',
      password: '',
      rememberMe: false
    };

    expect(() => useCase.execute(invalidCredentials)).toThrowError('Invalid email format');
    expect(authRepository.login).not.toHaveBeenCalled();
  });

  it('should validate email format', () => {
    const invalidEmailCredentials: AuthCredentials = {
      email: 'invalid-email',
      password: 'Password123!',
      rememberMe: false
    };

    expect(() => useCase.execute(invalidEmailCredentials)).toThrowError('Invalid email format');
    expect(authRepository.login).not.toHaveBeenCalled();
  });

  it('should validate password requirements', () => {
    const weakPasswordCredentials: AuthCredentials = {
      email: 'test@example.com',
      password: 'weak',
      rememberMe: false
    };

    expect(() => useCase.execute(weakPasswordCredentials)).toThrowError('Password does not meet requirements');
    expect(authRepository.login).not.toHaveBeenCalled();
  });

  it('should handle network errors', () => {
    const networkError = new Error('Network error');
    authRepository.login.and.returnValue(throwError(() => networkError));

    useCase.execute(mockCredentials).subscribe({
      error: (error) => {
        expect(error.message).toBe('Network error');
      }
    });

    expect(authRepository.login).toHaveBeenCalledWith(mockCredentials);
  });

  it('should handle authentication errors', () => {
    const authError = {
      status: 401,
      error: { message: 'Invalid credentials' }
    };
    authRepository.login.and.returnValue(throwError(() => authError));

    useCase.execute(mockCredentials).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe('Invalid credentials');
      }
    });

    expect(authRepository.login).toHaveBeenCalledWith(mockCredentials);
  });

  it('should pass rememberMe flag correctly', () => {
    const credentialsWithRemember: AuthCredentials = {
      ...mockCredentials,
      rememberMe: true
    };

    authRepository.login.and.returnValue(of(mockLoginResponse));

    useCase.execute(credentialsWithRemember).subscribe();

    expect(authRepository.login).toHaveBeenCalledWith(credentialsWithRemember);
  });


});
