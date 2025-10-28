import { Profile } from '../../../domain/entities/profile.entity';

export const MOCK_USER_PROFILE: Profile = {
  account_information: {
    business_name: "Christoper",
    business_registration_number: "94 NOV 07",
    business_address: "Moka 2",
    city: "Saint Pierre 2",
    postal_code: "75202",
    phone_number: "547895122",
    email_address: "rene@gmail.com",
    website: "www.rene.com2"
  },
  financial_information: {
    vat_number: "VAT0012345678",
    tax_identification_number: "TINA567890123",
    bank_name: "Global Bank PLC",
    bank_account_number: "1224567890123456",
    swift_code: "GLBPPLM0123"
  },
  administrative_settings: {
    primary_contact_name: "Ann Smith",
    primary_contact_post: "SWAN Surveyor",
    notification: true,
    communication_method: "Portal, Email, SMS",
    administrative_updated_at: new Date(),
  },
  security_settings: {
    password: "bzVwzPz45RkeC1g!",
    backup_email: "rene@gmail.com"
  }
};

export const MOCK_PROFILE_UPDATE_RESPONSE = {
  success: true,
  data: MOCK_USER_PROFILE,
  message: 'Profile updated successfully'
};

export const MOCK_NOTIFICATION_UPDATE_RESPONSE = {
  success: true,
  message: 'Notification preferences updated successfully'
};

export const MOCK_PASSWORD_CHANGE_RESPONSE = {
  success: true,
  message: 'Password changed successfully'
};
