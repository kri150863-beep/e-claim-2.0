import { Injectable } from '@angular/core';
import { RequestInfo } from 'angular-in-memory-web-api';
import { BaseMockController } from './base.mock-controller';
import { ProfileMockService } from '../services/profile-mock.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileMockController extends BaseMockController {
  constructor(
    private profileService: ProfileMockService
  ) {
    super();
  }

  createDb() {
    return {
      profile: this.profileService.getCurrentProfile()
    };
  }

  get(reqInfo: RequestInfo) {
    // Handle direct profile endpoint
    if (reqInfo.url.includes('/profile?email=') && !reqInfo.id) {
      return this.handleGetProfile(reqInfo);
    }

    return undefined;
  }

  put(reqInfo: RequestInfo) {
    if (reqInfo.url.endsWith('/profile')) {
      return this.handleUpdateProfile(reqInfo);
    }

    return undefined;
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.url.includes('profile/notifications')) {
      return this.handleUpdateNotifications(reqInfo);
    }

    if (reqInfo.url.includes('auth/change-password')) {
      return this.handleChangePassword(reqInfo);
    }

    return undefined;
  }

  patch(reqInfo: RequestInfo) {
    if (reqInfo.url.includes('profile/website')) {
      return this.handleUpdateWebsite(reqInfo);
    }

    if (reqInfo.url.includes('profile/administrative')) {
      return this.handleUpdateAdministrativeSettings(reqInfo);
    }

    if (reqInfo.url.includes('profile/security')) {
      return this.handleUpdateSecuritySettings(reqInfo);
    }

    return undefined;
  }

  private handleGetProfile(reqInfo: RequestInfo) {
    const result = this.profileService.getProfile();

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse(result.data)
        : this.createErrorResponse(result.error!, 404)
    );
  }

  private handleUpdateWebsite(reqInfo: RequestInfo) {
    const { newWebsite } = this.getBodyReq(reqInfo.req);
    const result = this.profileService.updateWebsite(newWebsite);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleUpdateAdministrativeSettings(reqInfo: RequestInfo) {
    const settings = this.getBodyReq(reqInfo.req);
    const result = this.profileService.updateAdministrativeSettings(settings);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleUpdateSecuritySettings(reqInfo: RequestInfo) {
    const settings = this.getBodyReq(reqInfo.req);
    const result = this.profileService.updateSecuritySettings(settings);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleUpdateProfile(reqInfo: RequestInfo) {
    const updateData = this.getBodyReq(reqInfo.req);
    const result = this.profileService.updateProfile(updateData);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse(result.data)
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleUpdateNotifications(reqInfo: RequestInfo) {
    const preferences = this.getBodyReq(reqInfo.req);
    const result = this.profileService.updateNotificationPreferences(preferences);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 400)
    );
  }

  private handleChangePassword(reqInfo: RequestInfo) {
    const { currentPassword, newPassword } = this.getBodyReq(reqInfo.req);
    const result = this.profileService.changePassword(currentPassword, newPassword);

    return reqInfo.utils.createResponse$(() =>
      result.success
        ? this.createSuccessResponse({ message: result.message })
        : this.createErrorResponse(result.error!, 400)
    );
  }
}
