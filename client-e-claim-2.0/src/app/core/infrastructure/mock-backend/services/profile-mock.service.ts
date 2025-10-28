import { Injectable } from '@angular/core';
import {
  NotificationPreferences,
  Profile,
  AccountInformation,
  AdministrativeRequest,
  SecurityRequest,
} from '../../../domain/entities/profile.entity';
import { MOCK_USER_PROFILE } from '../data/profile.mock-data';

export interface ProfileUpdateResult {
  success: boolean;
  data?: Profile;
  error?: string;
  message?: string;
}

export interface PasswordChangeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface NotificationUpdateResult {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileMockService {
  private currentProfile: Profile = { ...MOCK_USER_PROFILE };

  constructor() {
    // console.log('ProfileMockService: Initialized with profile:', this.currentProfile);
  }

  /**
   * Get user profile
   */
  getProfile(): ProfileUpdateResult {
    try {
      return {
        success: true,
        data: { ...this.currentProfile },
      };
    } catch (error) {
      console.error('ProfileMockService: Error getting profile:', error);
      return {
        success: false,
        error: 'Failed to retrieve profile',
      };
    }
  }

  updateWebsite(website: string): ProfileUpdateResult {
    try {
      // Validate website
      if (!website || !/^(https?:\/\/)?[^\s/$.?#].[^\s]*$/.test(website)) {
        return {
          success: false,
          error: 'Invalid website URL format',
        };
      }

      // Update website
      this.currentProfile = {
        ...this.currentProfile,
        account_information: {
          ...this.currentProfile.account_information,
          website,
        },
      };

      return {
        success: true,
        message: 'Website updated successfully',
        data: { ...this.currentProfile },
      };
    } catch (error) {
      console.error('ProfileMockService: Error updating website:', error);
      return {
        success: false,
        error: 'Failed to update website',
      };
    }
  }

  updateAdministrativeSettings(
    settings: AdministrativeRequest
  ): ProfileUpdateResult {
    try {
      // Validate settings
      if (!settings.primaryContactName || !settings.primaryContactPost) {
        return {
          success: false,
          error: 'Primary contact name and post are required',
        };
      }

      // Update settings
      this.currentProfile = {
        ...this.currentProfile,
        administrative_settings: {
          ...this.currentProfile.administrative_settings,
          ...{
            primary_contact_name: settings.primaryContactName,
            primary_contact_post: settings.primaryContactPost,
            communication_method: settings.methodName,
            notification: settings.notification,
          },
        },
      };

      return {
        success: true,
        message: 'Administrative settings updated successfully',
        data: { ...this.currentProfile },
      };
    } catch (error) {
      console.error(
        'ProfileMockService: Error updating administrative settings:',
        error
      );
      return {
        success: false,
        error: 'Failed to update administrative settings',
      };
    }
  }

  updateSecuritySettings(settings: SecurityRequest): ProfileUpdateResult {
    try {
      // Validate settings
      // if (!settings.newPassword) {
      //   return {
      //     success: false,
      //     error: 'New password is required',
      //   };
      // }

      // Update settings
      this.currentProfile = {
        ...this.currentProfile,
        security_settings: {
          ...this.currentProfile.security_settings,
          ...{
            password: settings.newPassword,
            backup_email: settings.backupEmail,
          },
        },
      };

      return {
        success: true,
        message: 'Security settings updated successfully',
        data: { ...this.currentProfile },
      };
    } catch (error) {
      console.error(
        'ProfileMockService: Error updating security settings:',
        error
      );
      return {
        success: false,
        error: 'Failed to update security settings',
      };
    }
  }

  /**
   * Update user profile
   */
  updateProfile(updateData: Partial<AccountInformation>): ProfileUpdateResult {
    try {
      // Validate required fields if updating profile section
      if (updateData) {
        const profileUpdate = updateData;

        // Validate business name
        if (profileUpdate.business_name !== undefined) {
          if (
            !profileUpdate.business_name ||
            profileUpdate.business_name.length < 2
          ) {
            return {
              success: false,
              error: 'Business name must be at least 2 characters long',
            };
          }
        }

        // Validate business registration number
        if (profileUpdate.business_registration_number !== undefined) {
          if (
            !profileUpdate.business_registration_number ||
            !/^[A-Z0-9]{8,15}$/.test(profileUpdate.business_registration_number)
          ) {
            return {
              success: false,
              error:
                'Business registration number must be 8-15 alphanumeric characters',
            };
          }
        }

        // Validate phone number
        if (profileUpdate.phone_number !== undefined) {
          if (
            !profileUpdate.phone_number ||
            !/^[\+]?[1-9][\d]{0,15}$/.test(profileUpdate.phone_number)
          ) {
            return {
              success: false,
              error: 'Invalid phone number format',
            };
          }
        }
      }

      // Validate email if updating
      if (updateData.email_address !== undefined) {
        if (
          !updateData.email_address ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email_address)
        ) {
          return {
            success: false,
            error: 'Invalid email format',
          };
        }
      }

      // Update the profile
      this.currentProfile = {
        ...this.currentProfile,
        ...updateData,
        // profile: {
        //   ...this.currentProfile.profile,
        //   ...updateData.profile
        // }
      };

      return {
        success: true,
        data: { ...this.currentProfile },
      };
    } catch (error) {
      console.error('ProfileMockService: Error updating profile:', error);
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }
  }

  /**
   * Change user password
   */
  changePassword(
    currentPassword: string,
    newPassword: string
  ): PasswordChangeResult {
    try {
      // Validate current password (simulate check)
      if (currentPassword === 'wrongpassword') {
        return {
          success: false,
          error: 'Current password is incorrect',
        };
      }

      // Validate new password strength
      if (!newPassword || newPassword.length < 8) {
        return {
          success: false,
          error: 'New password must be at least 8 characters long',
        };
      }

      if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(
          newPassword
        )
      ) {
        return {
          success: false,
          error:
            'Password must contain uppercase, lowercase, number and special character',
        };
      }

      if (currentPassword === newPassword) {
        return {
          success: false,
          error: 'New password must be different from current password',
        };
      }

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('ProfileMockService: Error changing password:', error);
      return {
        success: false,
        error: 'Failed to change password',
      };
    }
  }

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(
    preferences: NotificationPreferences
  ): NotificationUpdateResult {
    try {
      // Validate preferences
      if (!preferences.systemAlerts) {
        return {
          success: false,
          error: 'System alerts cannot be disabled for security reasons',
        };
      }

      // Ensure at least one notification method is enabled
      if (
        !preferences.emailNotifications &&
        !preferences.smsNotifications &&
        !preferences.pushNotifications
      ) {
        return {
          success: false,
          error: 'At least one notification method must be enabled',
        };
      }

      // Update preferences
      this.currentProfile = {
        ...this.currentProfile,
        notification_preferences: { ...preferences },
      };

      return {
        success: true,
        message: 'Notification preferences updated successfully',
      };
    } catch (error) {
      console.error(
        'ProfileMockService: Error updating notification preferences:',
        error
      );
      return {
        success: false,
        error: 'Failed to update notification preferences',
      };
    }
  }

  /**
   * Reset profile to default (for testing)
   */
  resetProfile(): void {
    this.currentProfile = { ...MOCK_USER_PROFILE };
  }

  /**
   * Get current profile (for internal use)
   */
  getCurrentProfile(): Profile {
    return { ...this.currentProfile };
  }
}
