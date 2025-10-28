import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

import {
  NotificationPreferences,
  Profile,
  AccountInformation,
  AccountField,
  SecuritySettings,
  NotificationCategory,
  FinancialField,
  AdministrativeField,
  WebsiteRequest,
  AdministrativeRequest,
  SecurityRequest,
} from '../../domain/entities/profile.entity';
import { GetProfileUseCase } from '../../domain/use-cases/profile/get-profile.use-case';
import { UpdateProfileUseCase } from '../../domain/use-cases/profile/update-profile.use-case';
import { ChangePasswordUseCase } from '../../domain/use-cases/profile/change-password.use-case';
import { UpdateNotificationPreferencesUseCase } from '../../domain/use-cases/profile/update-notification-preferences.use-case';
import { PasswordChangeRequest } from '../../domain/entities/user.entity';
import { UpdateWebsiteUseCase } from '../../domain/use-cases/profile/update-website.use-case';
import { UpdateAdministrativeUseCase } from '../../domain/use-cases/profile/update-administrative.use-case';
import { UpdateSecurityUseCase } from '../../domain/use-cases/profile/update-security.use-case';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  currentProfile$ = this.currentProfileSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  // Subjects spécialisés pour chaque section
  private accountFieldsSubject = new BehaviorSubject<AccountField[]>([]);
  accountFields$ = this.accountFieldsSubject.asObservable();

  private financialFieldsSubject = new BehaviorSubject<FinancialField[]>([]);
  financialFields$ = this.financialFieldsSubject.asObservable();

  private administrativeFieldsSubject = new BehaviorSubject<
    AdministrativeField[]
  >([]);
  administrativeFields$ = this.administrativeFieldsSubject.asObservable();

  private securitySettingsSubject =
    new BehaviorSubject<SecuritySettings | null>(null);
  securitySettings$ = this.securitySettingsSubject.asObservable();

  private notificationCategoriesSubject = new BehaviorSubject<
    NotificationCategory[]
  >([]);
  notificationCategories$ = this.notificationCategoriesSubject.asObservable();

  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private changePasswordUseCase: ChangePasswordUseCase,
    private updateNotificationPreferencesUseCase: UpdateNotificationPreferencesUseCase,
    private updateWebsiteUseCase: UpdateWebsiteUseCase,
    private updateAdministrativeUseCase: UpdateAdministrativeUseCase,
    private updateSecurityUseCase: UpdateSecurityUseCase
  ) {
    this.initializeNotificationCategories();
  }

  /**
   * Load user profile from API
   */
  loadProfile(email: string = ''): Observable<Profile> {
    this.isLoadingSubject.next(true);
    this.getProfileUseCase.execute(email).pipe(
      catchError((res) => {
        return res;
      })
    );

    return this.getProfileUseCase.execute(email).pipe(
      tap((res) => {
        const profile = res;
        this.currentProfileSubject.next(profile);
        this.updateAccountFields(profile);
        this.updateFinancialFields(profile);
        this.updateAdministrativeFields(profile);
        this.updateSecurityFields(profile?.security_settings);
        this.updateNotificationCategories(profile?.notification_preferences);
        this.isLoadingSubject.next(false);
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);

        // Ensure we always return a proper error Observable
        const errorMessage =
          error?.message || error?.error?.message || 'Failed to load profile';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Update user profile
   */
  updateProfile(profileData: Partial<AccountInformation>): Observable<Profile> {
    this.isLoadingSubject.next(true);

    return this.updateProfileUseCase.execute(profileData).pipe(
      tap((updatedProfile) => {
        this.currentProfileSubject.next(updatedProfile);
        this.isLoadingSubject.next(false);
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        console.error('Failed to update profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Change user password
   */
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    this.isLoadingSubject.next(true);

    return this.changePasswordUseCase
      .execute(currentPassword, newPassword)
      .pipe(
        tap(() => {
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Failed to change password:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Observable<void> {
    this.isLoadingSubject.next(true);

    return this.updateNotificationPreferencesUseCase.execute(preferences).pipe(
      tap(() => {
        // Update current profile with new preferences
        const currentProfile = this.currentProfileSubject.value;
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            notificationPreferences: preferences,
          };
          this.currentProfileSubject.next(updatedProfile);
        }
        this.isLoadingSubject.next(false);
      }),
      catchError((error) => {
        this.isLoadingSubject.next(false);
        console.error('Failed to update notification preferences:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current profile synchronously
   */
  getCurrentProfile(): Profile | null {
    return this.currentProfileSubject.value;
  }

  /**
   * Clear profile data (useful for logout)
   */
  clearProfile(): void {
    this.currentProfileSubject.next(null);
  }

  /**
   * Update specific profile field
   */
  updateProfileField(field: string, value: any): Observable<Profile> {
    const currentProfile = this.getCurrentProfile();
    if (!currentProfile) {
      return throwError(() => new Error('No profile loaded'));
    }

    const updateData = { [field]: value };
    return this.updateProfile(updateData);
  }

  // ========================================
  // ACCOUNT INFO METHODS
  // ========================================

  /**
   * Get account fields for AccountInfoComponent
   */
  getAccountFields(): AccountField[] {
    return this.accountFieldsSubject.value;
  }

  /**
   * Update account field
   */
  updateAccountField(field: AccountField, newValue: any): Observable<Profile> {
    const updateData: any = {};

    // Determine if it's a profile field or user field
    if (field.key === 'email') {
      updateData.email_address = newValue;
    } else {
      updateData[field.key] = newValue;
    }

    return this.updateProfile(updateData).pipe(
      tap((updatedUser) => {
        this.updateAccountFields(updatedUser);
      })
    );
  }

  updateWebsite(req: WebsiteRequest): Observable<Profile> {
    return this.updateWebsiteUseCase.execute(req).pipe(
      tap(() => {
        const currentProfile = this.getCurrentProfile();
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            account_information: {
              ...currentProfile.account_information,
              website: req.newWebsite,
            },
          };
          this.currentProfileSubject.next(updatedProfile);

          this.updateAccountFields(updatedProfile);
        }
      })
    );
  }

  updateAdministrativeSettings(
    settings: AdministrativeRequest
  ): Observable<Profile> {
    return this.updateAdministrativeUseCase.execute(settings).pipe(
      tap(() => {
        const currentProfile = this.getCurrentProfile();
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            administrative_settings: {
              ...currentProfile.administrative_settings,
              ...{
                primary_contact_name: settings.primaryContactName,
                primary_contact_post: settings.primaryContactPost,
                communication_method: settings?.methodName?.join(', '),
                notification: settings.notification,
              },
            },
          };

          this.currentProfileSubject.next(updatedProfile);

          this.updateAdministrativeFields(updatedProfile);
        }
      })
    );
  }

  updateSecuritySettings(settings: SecurityRequest): Observable<Profile> {
    return this.updateSecurityUseCase.execute(settings).pipe(
      tap(() => {
        const currentProfile = this.getCurrentProfile();
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            security_settings: {
              ...currentProfile.security_settings,
              ...{
                password: settings.newPassword,
                backup_email: settings.backupEmail,
              },
            },
          };

          this.currentProfileSubject.next(updatedProfile);

          this.updateSecurityFields(updatedProfile.security_settings);
        }
      })
    );
  }

  /**
   * Validate account field
   */
  validateFields(
    field: AccountField | AdministrativeField,
    value: any
  ): { valid: boolean; error?: string } {
    if (field.required && (!value || value.toString().trim() === '')) {
      return { valid: false, error: `${field.label} is required` };
    }

    if (value && field.validation) {
      const validation = field.validation;
      const stringValue = value.toString();

      if (validation.minLength && stringValue.length < validation.minLength) {
        return {
          valid: false,
          error: `${field.label} must be at least ${validation.minLength} characters`,
        };
      }

      if (validation.maxLength && stringValue.length > validation.maxLength) {
        return {
          valid: false,
          error: `${field.label} must not exceed ${validation.maxLength} characters`,
        };
      }

      if (validation.pattern && !validation.pattern.test(stringValue)) {
        return { valid: false, error: this.getPatternErrorMessage(field) };
      }
    }

    return { valid: true };
  }

  private getPatternErrorMessage(field: any): string {
    switch (field.type) {
      case 'email':
        return 'Please enter a valid email address';
      case 'tel':
        return 'Please enter a valid phone number';
      case 'url':
        return 'Please enter a valid website URL';
      default:
        if (field.key === 'business_registration_number') {
          return 'Business registration number must be 8-15 alphanumeric characters';
        }
        if (field.key === 'postal_code') {
          return 'Postal code must be 3-10 alphanumeric characters';
        }
        return `Invalid ${field.label.toLowerCase()} format`;
    }
  }

  private updateAccountFields(profile: Profile): void {
    const fields: AccountField[] = [
      {
        label: 'Business name',
        value: profile?.account_information?.business_name || '',
        key: 'business_name',
        editable: false,
        required: true,
        type: 'text',
        validation: {
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        label: 'Business registration number',
        value: profile?.account_information?.business_registration_number || '',
        key: 'business_registration_number',
        editable: false,
        required: true,
        type: 'text',
        validation: {
          pattern: /^[A-Z0-9]{8,15}$/,
          minLength: 8,
          maxLength: 15,
        },
      },
      {
        label: 'Business address',
        value: profile?.account_information?.business_address || '',
        key: 'business_address',
        editable: false,
        required: true,
        type: 'text',
        validation: {
          minLength: 5,
          maxLength: 200,
        },
      },
      {
        label: 'City',
        value: profile?.account_information?.city || '',
        key: 'city',
        editable: false,
        required: true,
        type: 'text',
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        label: 'Postal code',
        value: profile?.account_information?.postal_code || '',
        key: 'postal_code',
        editable: false,
        required: true,
        type: 'text',
        validation: {
          pattern: /^[A-Z0-9]{3,10}$/,
          minLength: 3,
          maxLength: 10,
        },
      },
      {
        label: 'Phone number',
        value: profile?.account_information?.phone_number || '',
        key: 'phone_number',
        type: 'tel',
        editable: false,
        required: true,
        validation: {
          pattern: /^[\+]?[1-9][\d]{0,15}$/,
        },
      },
      {
        label: 'Email address',
        value: profile?.account_information?.email_address || '',
        key: 'email',
        type: 'email',
        editable: false,
        required: true,
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
      },
      {
        label: 'Website',
        value: profile?.account_information?.website || '',
        key: 'website',
        type: 'url',
        editable: false,
        required: false,
        validation: {
          pattern:
            /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([\/?#][\w-./?%=&]*)?$/,
        },
      },
    ];

    this.accountFieldsSubject.next(fields);
  }

  private updateFinancialFields(profile: Profile): void {
    const fields: FinancialField[] = [
      {
        label: 'VAT number',
        value: profile.financial_information?.vat_number || '',
        key: 'vat_number',
      },
      {
        label: 'Tax Identification Number (TIN)',
        value: profile.financial_information?.tax_identification_number || '',
        key: 'tax_identification_number',
      },
      {
        label: 'Bank Name',
        value: profile.financial_information?.bank_name || '',
        key: 'bank_name',
      },
      {
        label: 'Bank Account Number',
        value: profile.financial_information?.bank_account_number || '',
        key: 'bank_account_number',
      },
      {
        label: 'SWIFT Code',
        value: profile.financial_information?.swift_code || '',
        key: 'swift_code',
      },
    ];

    this.financialFieldsSubject.next(fields);
  }

  private updateAdministrativeFields(profile: Profile): void {
    const fields: AdministrativeField[] = [
      {
        label: 'Primary Contact Name',
        value: profile?.administrative_settings?.primary_contact_name || '',
        key: 'primary_contact_name',
        type: 'text',
        editable: false,
        required: true
      },
      {
        label: 'Primary Contact Position',
        value: profile?.administrative_settings?.primary_contact_post || '',
        key: 'primary_contact_post',
        editable: false,
        type: 'text',
        required: true
      },
      {
        label: 'Preferred communication method',
        value:
          profile?.administrative_settings?.communication_method
            ?.split(',')
            ?.map((method: string) => method.trim()) || [],
        key: 'communication_method',
        editable: false,
        type: 'multiselect',
        options: ['SMS', 'Portal', 'Email'],
        required: true,
      },
      {
        label: 'Notifications',
        value: profile?.administrative_settings?.notification || false,
        key: 'notification',
        editable: false,
        type: 'switch',
      },
    ];

    this.administrativeFieldsSubject.next(fields);
  }

  // ========================================
  // SECURITY SETTINGS METHODS
  // ========================================

  /**
   * Get security settings for SecuritySettingsComponent
   */
  getSecuritySettings(): SecuritySettings | null {
    return this.securitySettingsSubject.value;
  }

  /**
   * Change password with validation
   */
  changePasswordWithValidation(
    passwordRequest: PasswordChangeRequest
  ): Observable<void> {
    // Validate password request
    const validation = this.validatePasswordRequest(passwordRequest);
    if (!validation.valid) {
      return throwError(() => new Error(validation.error));
    }

    return this.changePassword(
      passwordRequest.currentPassword,
      passwordRequest.newPassword
    ).pipe(
      tap(() => {
        // Update last password change date
        const currentSettings = this.securitySettingsSubject.value;
        if (currentSettings) {
          const updatedSettings = {
            ...currentSettings,
            lastPasswordChange: new Date(),
          };
          this.securitySettingsSubject.next(updatedSettings);
        }
      })
    );
  }

  /**
   * Update email address
   */
  updateEmail(newEmail: string): Observable<Profile> {
    // Validate email
    if (!this.isValidEmail(newEmail)) {
      return throwError(() => new Error('Invalid email format'));
    }

    return this.updateProfile({ email_address: newEmail }).pipe(
      tap((updatedUser) => {
        this.updateSecurityFields(updatedUser?.security_settings as any);
      })
    );
  }

  /**
   * Validate password request
   */
  validatePasswordRequest(request: PasswordChangeRequest): {
    valid: boolean;
    error?: string;
  } {
    if (!request.currentPassword) {
      return { valid: false, error: 'Current password is required' };
    }

    if (!request.newPassword) {
      return { valid: false, error: 'New password is required' };
    }

    if (!request.confirmPassword) {
      return { valid: false, error: 'Password confirmation is required' };
    }

    if (request.newPassword !== request.confirmPassword) {
      return { valid: false, error: 'Passwords do not match' };
    }

    if (request.currentPassword === request.newPassword) {
      return {
        valid: false,
        error: 'New password must be different from current password',
      };
    }

    // Validate password strength
    const strengthValidation = this.validatePasswordStrength(
      request.newPassword
    );
    if (!strengthValidation.valid) {
      return strengthValidation;
    }

    return { valid: true };
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    valid: boolean;
    error?: string;
    requirements?: any;
  } {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(requirements).every((req) => req);

    if (!isValid) {
      const missingRequirements = [];
      if (!requirements.minLength)
        missingRequirements.push('at least 8 characters');
      if (!requirements.hasUpperCase)
        missingRequirements.push('one uppercase letter');
      if (!requirements.hasLowerCase)
        missingRequirements.push('one lowercase letter');
      if (!requirements.hasNumbers) missingRequirements.push('one number');
      if (!requirements.hasSpecialChar)
        missingRequirements.push('one special character');

      return {
        valid: false,
        error: `Password must contain: ${missingRequirements.join(', ')}`,
        requirements,
      };
    }

    return { valid: true, requirements };
  }

  /**
   * Get password strength score
   */
  getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
  } {
    if (!password) {
      return { score: 0, label: 'No password', color: 'gray' };
    }

    const validation = this.validatePasswordStrength(password);
    if (!validation.requirements) {
      return { score: 0, label: 'Weak', color: 'red' };
    }

    const requirements = validation.requirements;
    const score = Object.values(requirements).filter(Boolean).length;

    if (score <= 2) {
      return { score, label: 'Weak', color: 'red' };
    } else if (score <= 4) {
      return { score, label: 'Medium', color: 'orange' };
    } else {
      return { score, label: 'Strong', color: 'green' };
    }
  }

  private updateSecurityFields(security: SecuritySettings | null): void {
    const settings: SecuritySettings = {
      password: security?.password ?? '',
      backup_email: security?.backup_email ?? '',
      masked_email: this.maskEmail(security?.backup_email ?? ''),
    };

    this.securitySettingsSubject.next(settings);
  }

  private maskEmail(email: string): string {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}****` : name;
    return `${maskedName}@${domain}`;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ========================================
  // NOTIFICATION PREFERENCES METHODS
  // ========================================

  /**
   * Get notification categories for NotificationPreferencesComponent
   */
  getNotificationCategories(): NotificationCategory[] {
    return this.notificationCategoriesSubject.value;
  }

  /**
   * Update single notification preference
   */
  updateSingleNotificationPreference(
    preferenceId: keyof NotificationPreferences,
    enabled: boolean
  ): Observable<void> {
    const currentProfile = this.getCurrentProfile();
    if (!currentProfile) {
      return throwError(() => new Error('No profile loaded'));
    }

    const currentPreferences =
      currentProfile?.notification_preferences ||
      this.getDefaultNotificationPreferences();
    const updatedPreferences = {
      ...currentPreferences,
      [preferenceId]: enabled,
    };

    // Validate the change
    const validation = this.validateNotificationPreferences(updatedPreferences);
    if (!validation.valid) {
      return throwError(() => new Error(validation.error));
    }

    return this.updateNotificationPreferences(updatedPreferences);
  }

  /**
   * Validate notification preferences
   */
  validateNotificationPreferences(preferences: NotificationPreferences): {
    valid: boolean;
    error?: string;
  } {
    // Ensure at least one notification method is enabled for critical updates
    const hasCriticalNotification =
      preferences.emailNotifications ||
      preferences.smsNotifications ||
      preferences.pushNotifications;

    if (!hasCriticalNotification) {
      return {
        valid: false,
        error:
          'At least one notification method (Email, SMS, or Push) must be enabled for critical updates',
      };
    }

    // Ensure system alerts are enabled (required for security)
    if (!preferences.systemAlerts) {
      return {
        valid: false,
        error: 'System alerts cannot be disabled for security reasons',
      };
    }

    return { valid: true };
  }

  /**
   * Get default notification preferences
   */
  getDefaultNotificationPreferences(): NotificationPreferences {
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      claimUpdates: true,
      systemAlerts: true,
      marketingEmails: false,
    };
  }

  /**
   * Reset notification preferences to defaults
   */
  resetNotificationPreferencesToDefaults(): Observable<void> {
    const defaultPreferences = this.getDefaultNotificationPreferences();
    return this.updateNotificationPreferences(defaultPreferences);
  }

  private initializeNotificationCategories(): void {
    const categories: NotificationCategory[] = [
      {
        id: 'communication',
        name: 'Communication Methods',
        description: 'Choose how you want to receive notifications',
        preferences: [
          {
            id: 'emailNotifications',
            name: 'Email Notifications',
            description: 'Receive notifications via email',
            enabled: true,
            category: 'communication',
          },
          {
            id: 'smsNotifications',
            name: 'SMS Notifications',
            description: 'Receive notifications via SMS',
            enabled: false,
            category: 'communication',
          },
          {
            id: 'pushNotifications',
            name: 'Push Notifications',
            description: 'Receive browser push notifications',
            enabled: true,
            category: 'communication',
          },
        ],
      },
      {
        id: 'content',
        name: 'Notification Types',
        description: 'Choose what types of notifications you want to receive',
        preferences: [
          {
            id: 'claimUpdates',
            name: 'Claim Updates',
            description: 'Get notified about claim status changes',
            enabled: true,
            category: 'content',
          },
          {
            id: 'systemAlerts',
            name: 'System Alerts',
            description:
              'Important system notifications and maintenance alerts',
            enabled: true,
            required: true,
            category: 'content',
          },
          {
            id: 'marketingEmails',
            name: 'Marketing Emails',
            description: 'Receive promotional emails and newsletters',
            enabled: false,
            category: 'content',
          },
        ],
      },
    ];

    this.notificationCategoriesSubject.next(categories);
  }

  private updateNotificationCategories(
    preferences?: NotificationPreferences
  ): void {
    if (!preferences) {
      preferences = this.getDefaultNotificationPreferences();
    }

    const categories = this.notificationCategoriesSubject.value.map(
      (category) => ({
        ...category,
        preferences: category.preferences.map((pref) => ({
          ...pref,
          enabled: preferences![pref.id],
        })),
      })
    );

    this.notificationCategoriesSubject.next(categories);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Clear all profile data (useful for logout)
   */
  clearAllProfileData(): void {
    this.currentProfileSubject.next(null);
    this.accountFieldsSubject.next([]);
    this.securitySettingsSubject.next(null);
    this.initializeNotificationCategories(); // Reset to default categories
  }
}
