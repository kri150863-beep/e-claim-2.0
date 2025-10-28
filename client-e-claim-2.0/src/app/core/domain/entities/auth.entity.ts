export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordType {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetToken {
  email: string;
  token: string;
}

export interface InviteToken {
  email: string;
  token: string;
}