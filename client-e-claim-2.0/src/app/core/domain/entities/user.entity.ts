export interface User {
  id?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: string[];
  rememberMe?: boolean;
  lastLogin?: Date;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
