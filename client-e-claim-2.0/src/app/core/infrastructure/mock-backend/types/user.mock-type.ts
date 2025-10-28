export interface MockUser {
  id: number;
  name: string;
  email: string;
  username?: string;
  business_name: string;
  password?: string;
  phone?: string;
  address?: string;
  role?: string[];
  resetToken?: string;
  resetTokenExpires?: Date;
  resetTokenUsed?: boolean;
  inviteToken?: string;
  inviteTokenExpiry?: string;
  inviteTokenUsed?: boolean;
}