import { Injectable } from '@angular/core';
import { MOCK_USERS } from '../data/users.mock-data';
import { MockUser } from '../types/user.mock-type';
import { MockInitService } from './init-mock.service';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private users: MockUser[] = [];

  constructor(private mockInitService: MockInitService) {
    this.users = this.mockInitService.getUsers();
  }

  login(
    email: string,
    password: string
  ): {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  } {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return { success: false, error: 'Incorrect email or password' };

    return this.generateTokens(user);
  }

  logout(): void {
    localStorage.removeItem('mock_users_data');
  }

  getUsers(): MockUser[] {
    return this.users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }

  forgotPassword({ email, url = '' }: { email: string, url: string }): {
    success: boolean;
    message?: string;
    error?: string;
  } {
    const userIndex = this.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = { ...this.users[userIndex] };

    // Generate secure token (use crypto in browser)
    const resetToken = this.generateSecureToken();

    // Set expiration (15 minutes from now)
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Update user with token info
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    user.resetTokenUsed = false;

    const updatedUsers = [...this.users];
    updatedUsers[userIndex] = user;
    this.mockInitService.updateUsers(updatedUsers);

    // Create reset link
    const resetLink = this.buildResetLink(url, email, resetToken);

    // Simulate sending email
    console.log(`📧 Sending forgot password email to: ${email}`);
    console.log(`🔗 Reset Link: ${resetLink}`);

    return {
      success: true,
      message: `Password reset link sent to ${email}. (mocked)`
    };
  }

  sendInvite({ email, url = '' }: { email: string, url: string }): any {
    const userIndex = this.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = { ...this.users[userIndex] };

    // Generate secure token
    const inviteToken = this.generateSecureToken();
    const tokenExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    // Update user with token info
    user.inviteToken = inviteToken;
    user.inviteTokenExpiry = tokenExpiry.toISOString();
    user.inviteTokenUsed = false;

    const updatedUsers = [...this.users];
    updatedUsers[userIndex] = user;
    this.mockInitService.updateUsers(updatedUsers);

    // Create invite link
    const inviteLink = this.buildInviteLink(url, email, inviteToken);

    // Simulate sending email
    console.log(`📧 Sending invite email to: ${email}`);
    console.log(`🔗 Invite Link: ${inviteLink}`);

    return {
      success: true,
      message: `Invite link sent to ${email} (mocked)`,
      inviteLink: inviteLink // For demo purposes only
    };
  }

  resetPassword(email: string, token: string, newPassword: string): {
    success: boolean;
    message?: string;
    error?: string;
  } {
    const verification = this.verifyResetToken({ email, token });
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const userIndex = this.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = { ...this.users[userIndex] };

    console.log(user.password, newPassword);

    if (user.password === newPassword) {
      return { success: false, error: "New password cannot be the same as the old password" };
    }

    // Update password and mark token as used
    user.password = newPassword;
    user.resetTokenUsed = true;
    user.resetToken = '';
    user.resetTokenExpires = undefined;

    const updatedUsers = [...this.users];
    updatedUsers[userIndex] = user;
    this.mockInitService.updateUsers(updatedUsers);

    return {
      success: true,
      message: 'Password reset successfully'
    };
  }

  refreshToken(token: string): {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  } {
    const payload = this.decodeMockToken(token);
    const user = this.users.find((u) => u.email === payload?.email);

    return user ? this.generateTokens(user) : { success: false };
  }

  private generateTokens(user: MockUser) {
    return {
      success: true,
      accessToken: this.generateMockToken(user, 3600), // 1 hour
      refreshToken: this.generateMockToken(user, 86400), // 24 hours
    };
  }

  private generateMockToken(user: MockUser, expiresIn: number): string {
    const now = Math.floor(Date.now() / 1000);
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        business_name: user.business_name,
        roles: user.role,
        phone: user.phone,
        address: user.address,
        iat: now,
        exp: now + expiresIn,
      })
    );
    return `${header}.${payload}.mock-signature`;
  }

  private generateSecureToken(): string {
    // In a real app, use proper cryptographic random bytes
    return Array.from(crypto.getRandomValues(new Uint32Array(4)))
      .map(n => n.toString(36))
      .join('')
      .substring(0, 32);
  }

  verifyResetToken({ email, token }: { email: string, token: string }): {
    valid: boolean;
    error?: string;
  } {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    if (user.resetTokenUsed) {
      return { valid: false, error: 'Token already used' };
    }

    console.log(user);

    if (!user.resetToken || user.resetToken !== token) {
      return { valid: false, error: 'Invalid token' };
    }

    if (!user.resetTokenExpires || new Date() > user.resetTokenExpires) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true };
  }

  validateInvite({ token, email }: { token: string, email: string }): any {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    if (user.inviteTokenUsed) {
      return { valid: false, error: 'Invite link already used' };
    }

    if (new Date(user.inviteTokenExpiry as string) < new Date()) {
      return { valid: false, error: 'Invite link expired' };
    }

    if (user.inviteToken !== token) {
      return { valid: false, error: 'Invalid token' };
    }

    return { valid: true };
  }

  firstLogin(email: string, password: string): any {
    console.log(email);
    const userIndex = this.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = { ...this.users[userIndex] };

    // Update user
    user.password = password; // In real app, hash this password
    user.inviteTokenUsed = true;

    const updatedUsers = [...this.users];
    updatedUsers[userIndex] = user;
    this.mockInitService.updateUsers(updatedUsers);

    return this.generateTokens(user);
  }

  decodeMockToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      console.error('Error decoding mock token', e);
      return null;
    }
  }

  private buildResetLink(baseUrl: string, email: string, token: string): string {
    const url = new URL('/auth/reset-password', baseUrl);
    url.searchParams.set('token', token);
    url.searchParams.set('email', encodeURIComponent(email));
    return url.toString();
  }

  private buildInviteLink(baseUrl: string, email: string, token: string): string {
    const url = new URL('/auth/first-login', baseUrl);
    url.searchParams.set('token', token);
    url.searchParams.set('email', encodeURIComponent(email));
    return url.toString();
  }
}
