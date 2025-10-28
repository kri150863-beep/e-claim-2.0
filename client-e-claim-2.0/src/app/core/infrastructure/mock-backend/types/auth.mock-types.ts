import { MockUser } from "./user.mock-type";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<MockUser, 'password'>;
}