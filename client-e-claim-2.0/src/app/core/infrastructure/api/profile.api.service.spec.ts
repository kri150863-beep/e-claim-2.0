import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProfileApiService } from './profile.api.service';
import { User } from '../../domain/entities/user.entity';
import { environment } from '../../../../environments/environment';

describe('ProfileApiService', () => {
  let service: ProfileApiService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    roles: ['user'],
    profile: {
      businessName: 'Test Business',
      businessRegistrationNumber: 'BRN123',
      businessAddress: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      phoneNumber: '+1234567890',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileApiService]
    });

    service = TestBed.inject(ProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfile', () => {
    it('should retrieve user profile', () => {
      service.getProfile().subscribe(profile => {
        expect(profile).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle get profile error', () => {
      service.getProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile`);
      req.flush('Profile not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', () => {
      const updateData = { email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateData };

      service.updateProfile(updateData).subscribe(profile => {
        expect(profile).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedUser);
    });

    it('should handle update profile error', () => {
      const updateData = { email: 'invalid-email' };

      service.updateProfile(updateData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile`);
      expect(req.request.method).toBe('PUT');
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences', () => {
      const preferences = mockUser.notificationPreferences!;

      service.updateNotificationPreferences(preferences).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile/notifications`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(preferences);
      req.flush(null);
    });

    it('should handle update notification preferences error', () => {
      const preferences = mockUser.notificationPreferences!;

      service.updateNotificationPreferences(preferences).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.mockApiUrl}/profile/notifications`);
      expect(req.request.method).toBe('PUT');
      req.flush('Invalid preferences', { status: 400, statusText: 'Bad Request' });
    });
  });
});
