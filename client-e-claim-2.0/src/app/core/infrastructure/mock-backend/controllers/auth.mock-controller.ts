import { Injectable } from '@angular/core';
import { RequestInfo } from 'angular-in-memory-web-api';
import { BaseMockController } from './base.mock-controller';
import { MockAuthService } from '../services/auth-mock.service';
import { MockInitService } from '../services/init-mock.service';

@Injectable()
export class AuthMockController extends BaseMockController {
  constructor(
    private authService: MockAuthService,
    private mockInit: MockInitService
  ) {
    super();
  }

  createDb() {
    return {
      users: this.mockInit.getUsers().map(({ password, ...user }) => user),
      // claims: this.mockInit.getClaimsData()
    };
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.url.endsWith('/login')) {
      return this.handleLogin(reqInfo);
    }

    if (reqInfo.url.endsWith('/first-login')) {
      return this.handleFirstLogin(reqInfo);
    }

    if (reqInfo.url.endsWith('/refresh-token')) {
      return this.handleRefreshToken(reqInfo);
    }

    if (reqInfo.url.endsWith('/forgot-password')) {
      return this.handleForgotPassword(reqInfo);
    }

    if (reqInfo.url.endsWith('/reset-password')) {
      return this.handleResetPassword(reqInfo);
    }

    if (reqInfo.url.endsWith('/verify-reset-token')) {
      return this.handleVerifyResetToken(reqInfo);
    }

    if (reqInfo.url.endsWith('/send-invite')) {
      return this.handleSentInvite(reqInfo);
    }

    if (reqInfo.url.endsWith('/validate-invite')) {
      return this.handleVerifyInviteToken(reqInfo);
    }

    if (reqInfo.url.endsWith('/logout')) {
      return this.handleLogout(reqInfo);
    }

    return undefined;
  }

  private handleLogin(reqInfo: RequestInfo) {
    const { email, password } = this.getBodyReq(reqInfo?.req);
    const result = this.authService.login(email, password);

    return reqInfo.utils.createResponse$(() =>
      result?.success
        ? this.createSuccessResponse({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleLogout(reqInfo: RequestInfo) {
    this.authService.logout();

    return reqInfo.utils.createResponse$(() =>
       this.createSuccessResponse({})
    );
  }

  private handleRefreshToken(reqInfo: RequestInfo) {
    const { refreshToken } = this.getBodyReq(reqInfo.req);

    const result = this.authService.refreshToken(refreshToken);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        : this.createErrorResponse('Failed to refresh token', 400)
    );
  }

  private handleForgotPassword(reqInfo: RequestInfo) {
    const { email } = this.getBodyReq(reqInfo.req);
    const origin = this.extractOriginFromUrl(reqInfo.req.url);

    const result = this.authService.forgotPassword({ email, url: origin });

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 404)
    );
  }

  private handleResetPassword(reqInfo: RequestInfo) {
    const { email, token, newPassword } = this.getBodyReq(reqInfo.req);
    const result = this.authService.resetPassword(email, token, newPassword);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: 'Password reset successful' })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleVerifyResetToken(reqInfo: RequestInfo) {
    const { email, token } = this.getBodyReq(reqInfo.req);
    const result = this.authService.verifyResetToken({ email, token });

    return reqInfo.utils.createResponse$(() =>
      result.valid
        ? this.createSuccessResponse({ valid: true })
        : this.createErrorResponse(result.error || 'Invalid token', 400)
    );
  }

  private handleSentInvite(reqInfo: RequestInfo) {
    const { email } = this.getBodyReq(reqInfo.req);
    const origin = this.extractOriginFromUrl(reqInfo.req.url);

    const result = this.authService.sendInvite({ email, url: origin });

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 404)
    );
  }

  private handleVerifyInviteToken(reqInfo: RequestInfo) {
    const { email, token } = this.getBodyReq(reqInfo.req);
    const result = this.authService.validateInvite({ email, token });

    return reqInfo.utils.createResponse$(() =>
      result.valid
        ? this.createSuccessResponse({ valid: true })
        : this.createErrorResponse(result.error || 'Invalid token', 400)
    );
  }

  private handleFirstLogin(reqInfo: RequestInfo) {
    const { email, password } = this.getBodyReq(reqInfo?.req);
    const result = this.authService.firstLogin(email, password);

    return reqInfo.utils.createResponse$(() =>
      result?.success
        ? this.createSuccessResponse({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private extractOriginFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
    } catch (e) {
      // Fallback manuel si `URL` échoue (rare)
      const [protocol, , hostAndPath] = url.split('/');
      const host = hostAndPath?.split('/')?.[0] ?? 'localhost:4200';
      return `${protocol}//${host}`;
    }
  }
}
