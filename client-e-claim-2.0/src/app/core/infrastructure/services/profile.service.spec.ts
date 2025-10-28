import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProfileService } from './profile.service';
import { GetProfileUseCase } from '../../domain/use-cases/profile/get-profile.use-case';
import { UpdateProfileUseCase } from '../../domain/use-cases/profile/update-profile.use-case';
import { ChangePasswordUseCase } from '../../domain/use-cases/profile/change-password.use-case';
import { UpdateNotificationPreferencesUseCase } from '../../domain/use-cases/profile/update-notification-preferences.use-case';
import { User } from '../../domain/entities/user.entity';

describe('ProfileService', () => {
  let service: ProfileService;
  let getProfileUseCase: jasmine.SpyObj<GetProfileUseCase>;
  let updateProfileUseCase: jasmine.SpyObj<UpdateProfileUseCase>;
  let changePasswordUseCase: jasmine.SpyObj<ChangePasswordUseCase>;
  let updateNotificationPreferencesUseCase: jasmine.SpyObj<UpdateNotificationPreferencesUseCase>;

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
    const getProfileSpy = jasmine.createSpyObj('GetProfileUseCase', ['execute']);
    const updateProfileSpy = jasmine.createSpyObj('UpdateProfileUseCase', ['execute']);
    const changePasswordSpy = jasmine.createSpyObj('ChangePasswordUseCase', ['execute']);
    const updateNotificationSpy = jasmine.createSpyObj('UpdateNotificationPreferencesUseCase', ['execute']);

    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: GetProfileUseCase, useValue: getProfileSpy },
        { provide: UpdateProfileUseCase, useValue: updateProfileSpy },
        { provide: ChangePasswordUseCase, useValue: changePasswordSpy },
        { provide: UpdateNotificationPreferencesUseCase, useValue: updateNotificationSpy }
      ]
    });

    service = TestBed.inject(ProfileService);
    getProfileUseCase = TestBed.inject(GetProfileUseCase) as jasmine.SpyObj<GetProfileUseCase>;
    updateProfileUseCase = TestBed.inject(UpdateProfileUseCase) as jasmine.SpyObj<UpdateProfileUseCase>;
    changePasswordUseCase = TestBed.inject(ChangePasswordUseCase) as jasmine.SpyObj<ChangePasswordUseCase>;
    updateNotificationPreferencesUseCase = TestBed.inject(UpdateNotificationPreferencesUseCase) as jasmine.SpyObj<UpdateNotificationPreferencesUseCase>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadProfile', () => {
    it('should load profile and update current profile subject', () => {
      getProfileUseCase.execute.and.returnValue(of(mockUser));

      service.loadProfile().subscribe();

      expect(getProfileUseCase.execute).toHaveBeenCalled();
      expect(service.getCurrentProfile()).toEqual(mockUser);

      // Check that account fields are updated
      const accountFields = service.getAccountFields();
      expect(accountFields.length).toBeGreaterThan(0);
      expect(accountFields.find(f => f.key === 'businessName')?.value).toBe('Test Business');
    });

    it('should handle load profile error', () => {
      const error = new Error('Load failed');
      getProfileUseCase.execute.and.returnValue(throwError(() => error));

      service.loadProfile().subscribe({
        error: (err) => {
          expect(err.message).toBe('Load failed');
        }
      });

      expect(getProfileUseCase.execute).toHaveBeenCalled();
    });

    it('should update account fields when profile is loaded', () => {
      getProfileUseCase.execute.and.returnValue(of(mockUser));

      service.loadProfile().subscribe();

      const accountFields = service.getAccountFields();
      expect(accountFields.length).toBe(8); // All account fields

      const businessNameField = accountFields.find(f => f.key === 'businessName');
      expect(businessNameField?.value).toBe('Test Business');
      expect(businessNameField?.required).toBe(true);

      const websiteField = accountFields.find(f => f.key === 'website');
      expect(websiteField?.value).toBe('https://test.com');
      expect(websiteField?.required).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', () => {
      const updateData = { email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateData };
      
      updateProfileUseCase.execute.and.returnValue(of(updatedUser));

      service.updateProfile(updateData).subscribe();

      expect(updateProfileUseCase.execute).toHaveBeenCalledWith(updateData);
      expect(service.getCurrentProfile()).toEqual(updatedUser);
    });

    it('should handle update profile error', () => {
      const error = new Error('Update failed');
      const updateData = { email: 'updated@example.com' };
      
      updateProfileUseCase.execute.and.returnValue(throwError(() => error));

      service.updateProfile(updateData).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });

      expect(updateProfileUseCase.execute).toHaveBeenCalledWith(updateData);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', () => {
      changePasswordUseCase.execute.and.returnValue(of(undefined));

      service.changePassword('oldPassword', 'newPassword').subscribe();

      expect(changePasswordUseCase.execute).toHaveBeenCalledWith('oldPassword', 'newPassword');
    });

    it('should handle change password error', () => {
      const error = new Error('Password change failed');
      changePasswordUseCase.execute.and.returnValue(throwError(() => error));

      service.changePassword('oldPassword', 'newPassword').subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });

      expect(changePasswordUseCase.execute).toHaveBeenCalledWith('oldPassword', 'newPassword');
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences successfully', () => {
      const preferences = mockUser.notificationPreferences!;
      updateNotificationPreferencesUseCase.execute.and.returnValue(of(undefined));
      
      // Set initial profile
      service['currentProfileSubject'].next(mockUser);

      service.updateNotificationPreferences(preferences).subscribe();

      expect(updateNotificationPreferencesUseCase.execute).toHaveBeenCalledWith(preferences);
      
      const currentProfile = service.getCurrentProfile();
      expect(currentProfile?.notificationPreferences).toEqual(preferences);
    });

    it('should handle update notification preferences error', () => {
      const error = new Error('Update preferences failed');
      const preferences = mockUser.notificationPreferences!;
      
      updateNotificationPreferencesUseCase.execute.and.returnValue(throwError(() => error));

      service.updateNotificationPreferences(preferences).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });

      expect(updateNotificationPreferencesUseCase.execute).toHaveBeenCalledWith(preferences);
    });
  });

  describe('updateProfileField', () => {
    it('should update specific profile field', () => {
      const updatedUser = { ...mockUser, email: 'new@example.com' };
      updateProfileUseCase.execute.and.returnValue(of(updatedUser));

      // Set initial profile
      service['currentProfileSubject'].next(mockUser);

      service.updateProfileField('email', 'new@example.com').subscribe();

      expect(updateProfileUseCase.execute).toHaveBeenCalledWith({ email: 'new@example.com' });
    });

    it('should throw error when no profile is loaded', () => {
      service.updateProfileField('email', 'new@example.com').subscribe({
        error: (err) => {
          expect(err.message).toBe('No profile loaded');
        }
      });
    });
  });

  describe('Account Info Methods', () => {
    beforeEach(() => {
      getProfileUseCase.execute.and.returnValue(of(mockUser));
      service.loadProfile().subscribe();
    });

    it('should get account fields', () => {
      const fields = service.getAccountFields();
      expect(fields.length).toBe(8);
      expect(fields.find(f => f.key === 'businessName')?.value).toBe('Test Business');
    });

    it('should update account field', () => {
      const field = service.getAccountFields().find(f => f.key === 'businessName')!;
      const updatedUser = { ...mockUser, profile: { ...mockUser.profile!, businessName: 'New Business' } };
      updateProfileUseCase.execute.and.returnValue(of(updatedUser));

      service.updateAccountField(field, 'New Business').subscribe();

      expect(updateProfileUseCase.execute).toHaveBeenCalledWith({
        profile: { businessName: 'New Business' }
      });
    });

    it('should validate account field', () => {
      const field = service.getAccountFields().find(f => f.key === 'businessName')!;

      const validResult = service.validateAccountField(field, 'Valid Business Name');
      expect(validResult.valid).toBe(true);

      const invalidResult = service.validateAccountField(field, '');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('required');
    });
  });

  describe('Security Settings Methods', () => {
    beforeEach(() => {
      getProfileUseCase.execute.and.returnValue(of(mockUser));
      service.loadProfile().subscribe();
    });

    it('should get security settings', () => {
      const settings = service.getSecuritySettings();
      expect(settings).toBeTruthy();
      expect(settings?.email).toBe('test@example.com');
      expect(settings?.maskedEmail).toBe('te****@example.com');
    });

    it('should change password with validation', () => {
      const passwordRequest = {
        currentPassword: 'oldPass123!',
        newPassword: 'newPass123!',
        confirmPassword: 'newPass123!'
      };
      changePasswordUseCase.execute.and.returnValue(of(undefined));

      service.changePasswordWithValidation(passwordRequest).subscribe();

      expect(changePasswordUseCase.execute).toHaveBeenCalledWith('oldPass123!', 'newPass123!');
    });

    it('should validate password strength', () => {
      const weakPassword = service.validatePasswordStrength('weak');
      expect(weakPassword.valid).toBe(false);

      const strongPassword = service.validatePasswordStrength('StrongPass123!');
      expect(strongPassword.valid).toBe(true);
    });

    it('should get password strength score', () => {
      const weak = service.getPasswordStrength('weak');
      expect(weak.label).toBe('Weak');

      const strong = service.getPasswordStrength('StrongPass123!');
      expect(strong.label).toBe('Strong');
    });
  });

  describe('Notification Preferences Methods', () => {
    beforeEach(() => {
      getProfileUseCase.execute.and.returnValue(of(mockUser));
      service.loadProfile().subscribe();
    });

    it('should get notification categories', () => {
      const categories = service.getNotificationCategories();
      expect(categories.length).toBe(2);
      expect(categories[0].id).toBe('communication');
      expect(categories[1].id).toBe('content');
    });

    it('should validate notification preferences', () => {
      const validPrefs = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: false,
        claimUpdates: true,
        systemAlerts: true,
        marketingEmails: false
      };
      const result = service.validateNotificationPreferences(validPrefs);
      expect(result.valid).toBe(true);

      const invalidPrefs = { ...validPrefs, systemAlerts: false };
      const invalidResult = service.validateNotificationPreferences(invalidPrefs);
      expect(invalidResult.valid).toBe(false);
    });

    it('should get default notification preferences', () => {
      const defaults = service.getDefaultNotificationPreferences();
      expect(defaults.emailNotifications).toBe(true);
      expect(defaults.systemAlerts).toBe(true);
      expect(defaults.marketingEmails).toBe(false);
    });
  });

  describe('clearProfile', () => {
    it('should clear current profile', () => {
      service['currentProfileSubject'].next(mockUser);
      expect(service.getCurrentProfile()).toEqual(mockUser);

      service.clearProfile();
      expect(service.getCurrentProfile()).toBeNull();
    });
  });
});
