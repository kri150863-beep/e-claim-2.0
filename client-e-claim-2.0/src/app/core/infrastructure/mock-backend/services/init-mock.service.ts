// src/app/core/services/mock-init.service.ts
import { Injectable } from '@angular/core';
import { MOCK_USERS } from '../data/users.mock-data';
import { MockUser } from '../types/user.mock-type';
import { MockStorageService } from './storage-mock.service';

@Injectable({ providedIn: 'root' })
export class MockInitService {
  private readonly USERS_KEY = 'mock_users_data';
  private readonly CLAIMS_KEY = 'mock_claims_data';

  constructor(private storageMockService: MockStorageService,) {}

  initializeAllMockData(): void {
    this.initializeUsersData();
    // this.initializeClaimsData();
  }

  private initializeUsersData(): void {
    if (!this.storageMockService.getItem(this.USERS_KEY)) {
      const usersData = MOCK_USERS.map(user => ({
        ...user,
        resetToken: null,
        resetTokenExpires: null,
        resetTokenUsed: false
      }));
      this.storageMockService.setItem(this.USERS_KEY, JSON.stringify(usersData));
    }
  }

  getUsers(): MockUser[] {
    return this.getSessionData(this.USERS_KEY);
  }

  private getSessionData(key: string): any[] {
    const data = this.storageMockService.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  updateUsers(users: MockUser[]): void {
    this.storageMockService.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}
