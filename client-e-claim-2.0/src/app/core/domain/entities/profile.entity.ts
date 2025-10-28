export interface Profile {
  account_information?: AccountInformation;
  financial_information?: FinancialInformation;
  administrative_settings?: AdministrativeSettings;
  security_settings?: SecuritySettings;
  notification_preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  claimUpdates: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

export interface AccountInformation {
  business_name?: string;
  business_registration_number?: string;
  business_address?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  email_address?: string;
  website?: string;
}

export interface FinancialInformation {
  vat_number: any;
  tax_identification_number: any;
  bank_name: any;
  bank_account_number: any;
  swift_code: any;
}

export interface AdministrativeSettings {
  primary_contact_name: any;
  primary_contact_post: any;
  notification: any;
  communication_method: any;
  administrative_updated_at?: any;
}

export interface SecuritySettings {
  password?: string;
  backup_email?: any;
  masked_email?: any;
}

export interface LoginSession {
  id: string;
  email: string;
  maskedEmail: string;
  lastPasswordChange?: Date;
  twoFactorEnabled: boolean;
  loginSessions: LoginSession[];
}

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  preferences: NotificationPreference[];
}

export interface NotificationPreference {
  id: keyof NotificationPreferences;
  name: string;
  description: string;
  enabled: boolean;
  required?: boolean;
  category: string;
}

export interface AccountField {
  label: string;
  value: string;
  key: keyof AccountInformation | 'email';
  editable?: boolean;
  editing?: boolean;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FinancialField {
  label: string;
  value: string;
  key: keyof FinancialInformation;
}

export interface AdministrativeField {
  label: string;
  value: any;
  key: keyof AdministrativeSettings;
  editable?: boolean;
  editing?: boolean;
  editedValue?: string;
  type?: 'text' | 'switch' | 'multiselect';
  options?: string[]; // For select fields
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
}

export interface SecurityField {
  label: string;
  value: string;
  key: keyof SecuritySettings;
  editable?: boolean;
  editing?: boolean;
  type?: 'text' | 'tel';
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
}

export interface WebsiteRequest {
  email?: string;
  newWebsite: string;
}

export interface AdministrativeRequest {
  email?: string;
  primaryContactName?: string;
  primaryContactPost?: string;
  methodName?: string[];
  notification?: boolean;
}

export interface SecurityRequest {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  backupEmail?: string;
}
