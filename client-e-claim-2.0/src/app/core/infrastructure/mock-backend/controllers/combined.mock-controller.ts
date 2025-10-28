import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { AuthMockController } from './auth.mock-controller';
import { ProfileMockController } from './profile.mock-controller';

@Injectable()
export class CombinedMockController implements InMemoryDbService {
  constructor(
    private authController: AuthMockController,
    private profileController: ProfileMockController
  ) {}

  createDb() {
    const authDb = this.authController.createDb();
    const profileDb = this.profileController.createDb();

    return {
      ...authDb,
      ...profileDb
    };
  }

  get(reqInfo: RequestInfo) {
    // Try profile controller first
    const profileResult = this.profileController.get(reqInfo);
    if (profileResult) {
      return profileResult;
    }

    return undefined;
  }

  post(reqInfo: RequestInfo) {
    // Try profile controller first
    const profileResult = this.profileController.post(reqInfo);
    if (profileResult) {
      return profileResult;
    }

    // Try auth controller
    const authResult = this.authController.post(reqInfo);
    if (authResult) {
      return authResult;
    }

    return undefined;
  }

  put(reqInfo: RequestInfo) {
    // Try profile controller first
    const profileResult = this.profileController.put(reqInfo);
    if (profileResult) {
      return profileResult;
    }

    return undefined;
  }

  patch(reqInfo: RequestInfo) {
    // Try profile controller first
    const profileResult = this.profileController.patch(reqInfo);
    if (profileResult) {
      return profileResult;
    }

    return undefined;
  }
}