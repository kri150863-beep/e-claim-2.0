import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthApiService } from './auth.api.service';
import { AuthCredentials, ForgotPassword, ResetPasswordType, ResetToken, InviteToken } from '../../domain/entities/auth.entity';
import { environment } from '../../../../environments/environment';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  const mockCredentials: AuthCredentials = {
    email: 'test@example.com',
    password: 'password123',
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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService]
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully', () => {
      service.login(mockCredentials).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', () => {
      service.login(mockCredentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should store remembered credentials when rememberMe is true', () => {
      const credentialsWithRemember = { ...mockCredentials, rememberMe: true };

      service.login(credentialsWithRemember).subscribe();

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/login`);
      req.flush(mockLoginResponse);

      // Note: storeRememberedCredentials is private, so we can't test it directly
      expect(req.request.body).toEqual(credentialsWithRemember);
    });
  });

  describe('firstLogin', () => {
    it('should perform first login successfully', () => {
      service.firstLogin(mockCredentials).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/first-login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockLoginResponse);
    });

    it('should handle first login error', () => {
      service.firstLogin(mockCredentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/first-login`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      service.logout().subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });

    it('should handle logout error', () => {
      service.logout().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/logout`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('password reset', () => {
    it('should request password reset successfully', () => {
      const forgotPasswordPayload: ForgotPassword = { email: 'test@example.com' };

      service.requestPasswordReset(forgotPasswordPayload).subscribe();

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: forgotPasswordPayload.email });
      req.flush(null);
    });

    it('should verify reset token successfully', () => {
      const resetToken: ResetToken = {
        email: 'test@example.com',
        token: 'reset-token-123'
      };

      service.verifyResetToken(resetToken).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify-reset-token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(resetToken);
      req.flush(null);
    });

    it('should reset password successfully', () => {
      const resetData: ResetPasswordType = {
        email: 'test@example.com',
        token: 'reset-token-123',
        newPassword: 'newPassword123'
      };

      service.resetPassword(resetData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(resetData);
      req.flush(null);
    });

    it('should change password successfully', () => {
      const currentPassword = 'oldPassword123';
      const newPassword = 'newPassword123';

      service.changePassword(currentPassword, newPassword).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ currentPassword, newPassword });
      req.flush(null);
    });
  });

  describe('token refresh', () => {
    it('should refresh token successfully', () => {
      const refreshToken = 'refresh-token-123';
      const refreshResponse = { token: 'new-access-token' };

      service.refreshToken(refreshToken).subscribe(response => {
        expect(response).toEqual(refreshResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken });
      req.flush(refreshResponse);
    });

    it('should handle refresh token error', () => {
      const refreshToken = 'invalid-refresh-token';

      service.refreshToken(refreshToken).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('invite management', () => {
    it('should send invite successfully', () => {
      const inviteData = {
        email: 'newuser@example.com',
        role: 'USER'
      };

      service.sendInvite(inviteData).subscribe();

      const req = httpMock.expectOne(`${environment.mockApiUrl}/auth/send-invite`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(inviteData);
      req.flush({ success: true });
    });

    it('should verify invite token successfully', () => {
      const inviteToken: InviteToken = {
        email: 'test@example.com',
        token: 'invite-token-123'
      };

      service.verifyInviteToken(inviteToken).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/validate-invite`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(inviteToken);
      req.flush({ valid: true });
    });

    it('should handle invalid invite token', () => {
      const inviteToken: InviteToken = {
        email: 'test@example.com',
        token: 'invalid-token'
      };

      service.verifyInviteToken(inviteToken).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/validate-invite`);
      req.flush('Invalid token', { status: 400, statusText: 'Bad Request' });
    });
  });


});
