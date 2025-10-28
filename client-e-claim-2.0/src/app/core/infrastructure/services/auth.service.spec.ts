import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { LogoutUseCase } from '../../domain/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../../domain/use-cases/auth/refresh-token.use-case';
import { ForgotPasswordUseCase } from '../../domain/use-cases/auth/forgot-password.use-case';
import { VerifyResetTokenUseCase } from '../../domain/use-cases/auth/verify-reset-token.use-case';
import { ResetPasswordUseCase } from '../../domain/use-cases/auth/reset-password.use-case';
import { SendInviteUseCase } from '../../domain/use-cases/auth/send-invite.use-case';
import { VerifyInviteTokenUseCase } from '../../domain/use-cases/auth/verify-invite-token.use-case';
import { FirstLoginUseCase } from '../../domain/use-cases/auth/first-login.use-case';
import { AuthCredentials } from '../../domain/entities/auth.entity';
import { User } from '../../domain/entities/user.entity';
import { UserRoles } from '../../shared/constants/roles.const';

describe('AuthService', () => {
  let service: AuthService;
  let loginUseCase: jasmine.SpyObj<LoginUseCase>;
  let logoutUseCase: jasmine.SpyObj<LogoutUseCase>;
  let refreshTokenUseCase: jasmine.SpyObj<RefreshTokenUseCase>;
  let forgotPasswordUseCase: jasmine.SpyObj<ForgotPasswordUseCase>;
  let verifyResetTokenUseCase: jasmine.SpyObj<VerifyResetTokenUseCase>;
  let resetPasswordUseCase: jasmine.SpyObj<ResetPasswordUseCase>;
  let sendInviteUseCase: jasmine.SpyObj<SendInviteUseCase>;
  let verifyInviteTokenUseCase: jasmine.SpyObj<VerifyInviteTokenUseCase>;
  let firstLoginUseCase: jasmine.SpyObj<FirstLoginUseCase>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'John Doe',
    roles: [UserRoles.ADMIN],
    profile: {
      businessName: 'Test Business',
      phoneNumber: '+1234567890',
      businessAddress: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      website: 'https://test.com'
    },
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      claimUpdates: true,
      systemAlerts: true,
      marketingEmails: false
    }
  };

  // Create a valid JWT token for testing
  const mockTokenPayload = {
    id: '1',
    email: 'test@example.com',
    name: 'John Doe',
    roles: ['ADMIN']
  };

  // Create a simple JWT token that works with atob()
  const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // {"alg":"HS256","typ":"JWT"}
  const payload = btoa(JSON.stringify(mockTokenPayload)); // Keep padding
  const signature = 'test-signature';
  const mockToken = `${header}.${payload}.${signature}`;
  const mockRefreshToken = 'refresh-token-123';

  beforeEach(() => {
    const loginUseCaseSpy = jasmine.createSpyObj('LoginUseCase', ['execute']);
    const logoutUseCaseSpy = jasmine.createSpyObj('LogoutUseCase', ['execute']);
    const refreshTokenUseCaseSpy = jasmine.createSpyObj('RefreshTokenUseCase', ['execute']);
    const forgotPasswordUseCaseSpy = jasmine.createSpyObj('ForgotPasswordUseCase', ['execute']);
    const verifyResetTokenUseCaseSpy = jasmine.createSpyObj('VerifyResetTokenUseCase', ['execute']);
    const resetPasswordUseCaseSpy = jasmine.createSpyObj('ResetPasswordUseCase', ['execute']);
    const sendInviteUseCaseSpy = jasmine.createSpyObj('SendInviteUseCase', ['execute']);
    const verifyInviteTokenUseCaseSpy = jasmine.createSpyObj('VerifyInviteTokenUseCase', ['execute']);
    const firstLoginUseCaseSpy = jasmine.createSpyObj('FirstLoginUseCase', ['execute']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LoginUseCase, useValue: loginUseCaseSpy },
        { provide: LogoutUseCase, useValue: logoutUseCaseSpy },
        { provide: RefreshTokenUseCase, useValue: refreshTokenUseCaseSpy },
        { provide: ForgotPasswordUseCase, useValue: forgotPasswordUseCaseSpy },
        { provide: VerifyResetTokenUseCase, useValue: verifyResetTokenUseCaseSpy },
        { provide: ResetPasswordUseCase, useValue: resetPasswordUseCaseSpy },
        { provide: SendInviteUseCase, useValue: sendInviteUseCaseSpy },
        { provide: VerifyInviteTokenUseCase, useValue: verifyInviteTokenUseCaseSpy },
        { provide: FirstLoginUseCase, useValue: firstLoginUseCaseSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    loginUseCase = TestBed.inject(LoginUseCase) as jasmine.SpyObj<LoginUseCase>;
    logoutUseCase = TestBed.inject(LogoutUseCase) as jasmine.SpyObj<LogoutUseCase>;
    refreshTokenUseCase = TestBed.inject(RefreshTokenUseCase) as jasmine.SpyObj<RefreshTokenUseCase>;
    forgotPasswordUseCase = TestBed.inject(ForgotPasswordUseCase) as jasmine.SpyObj<ForgotPasswordUseCase>;
    verifyResetTokenUseCase = TestBed.inject(VerifyResetTokenUseCase) as jasmine.SpyObj<VerifyResetTokenUseCase>;
    resetPasswordUseCase = TestBed.inject(ResetPasswordUseCase) as jasmine.SpyObj<ResetPasswordUseCase>;
    sendInviteUseCase = TestBed.inject(SendInviteUseCase) as jasmine.SpyObj<SendInviteUseCase>;
    verifyInviteTokenUseCase = TestBed.inject(VerifyInviteTokenUseCase) as jasmine.SpyObj<VerifyInviteTokenUseCase>;
    firstLoginUseCase = TestBed.inject(FirstLoginUseCase) as jasmine.SpyObj<FirstLoginUseCase>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and set current user', () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: false
      };

      const loginResponse = {
        data: {
          accessToken: mockToken,
          refreshToken: mockRefreshToken
        }
      };

      loginUseCase.execute.and.returnValue(of(loginResponse));

      service.login(credentials).subscribe();

      expect(loginUseCase.execute).toHaveBeenCalledWith(credentials);
      expect(storageService.set).toHaveBeenCalledWith('accessToken', mockToken);
      expect(storageService.set).toHaveBeenCalledWith('refreshToken', mockRefreshToken);

      // Mock the storage service to return the token when getCurrentUser is called
      storageService.get.and.returnValue(mockToken);

      // Verify that the user is set correctly by checking the decoded token
      const currentUser = service.getCurrentUser();
      expect(currentUser).toBeTruthy();
      expect(currentUser?.id).toBe('1');
      expect(currentUser?.email).toBe('test@example.com');
    });

    it('should handle login error when no token received', () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      const loginResponse = { data: {} };
      loginUseCase.execute.and.returnValue(of(loginResponse));

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('No token received');
        }
      });
    });

    it('should handle login error when token is invalid', () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: false
      };

      const loginResponse = {
        data: {
          accessToken: 'invalid-token',
          refreshToken: mockRefreshToken
        }
      };

      loginUseCase.execute.and.returnValue(of(loginResponse));

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid token payload');
        }
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear user data', () => {
      logoutUseCase.execute.and.returnValue(of({}));

      service.logout().subscribe();

      expect(logoutUseCase.execute).toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
      expect(storageService.remove).toHaveBeenCalledWith('accessToken');
      expect(storageService.remove).toHaveBeenCalledWith('refreshToken');
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should handle logout error', () => {
      const error = new Error('Logout failed');
      logoutUseCase.execute.and.returnValue(throwError(() => error));

      service.logout().subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const refreshResponse = {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token'
        }
      };

      storageService.get.and.returnValue(mockRefreshToken);
      refreshTokenUseCase.execute.and.returnValue(of(refreshResponse));

      service.refreshToken().subscribe();

      expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(mockRefreshToken);
      expect(storageService.set).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(storageService.set).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
    });

    it('should throw error when refresh token not found', () => {
      storageService.get.and.returnValue(null);

      expect(() => service.refreshToken()).toThrowError('Refresh token not found');
    });
  });

  describe('authentication state', () => {
    it('should return current user when token exists', () => {
      storageService.get.and.returnValue(mockToken);

      const user = service.getCurrentUser();

      expect(user).toBeTruthy();
      expect(user?.id).toBe('1');
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null when no token exists', () => {
      storageService.get.and.returnValue(null);

      const user = service.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should return true for isAuthenticated when user exists', () => {
      storageService.get.and.returnValue(mockToken);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false for isAuthenticated when no user exists', () => {
      storageService.get.and.returnValue(null);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should check user roles correctly', () => {
      storageService.get.and.returnValue(mockToken);

      expect(service.hasRole(UserRoles.ADMIN)).toBe(true);
      expect(service.hasRole(UserRoles.SURVEYOR)).toBe(false);
    });
  });

  describe('token management', () => {
    it('should decode token correctly', () => {
      const result = service.decodeToken(mockToken);

      expect(result).toBeTruthy();
      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
    });

    it('should handle invalid token format', () => {
      const result = service.decodeToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should set and get tokens', () => {
      service.setTokens(mockToken, mockRefreshToken);

      expect(storageService.set).toHaveBeenCalledWith('accessToken', mockToken);
      expect(storageService.set).toHaveBeenCalledWith('refreshToken', mockRefreshToken);
    });

    it('should clear tokens', () => {
      service.clearTokens();

      expect(storageService.remove).toHaveBeenCalledWith('accessToken');
      expect(storageService.remove).toHaveBeenCalledWith('refreshToken');
    });
  });
});
