import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ChangePasswordUseCase } from './change-password.use-case';
import { AuthRepository } from '../../repositories/auth.repository';

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;
  let authRepository: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['changePassword']);

    TestBed.configureTestingModule({
      providers: [
        ChangePasswordUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(ChangePasswordUseCase);
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should change password successfully', () => {
    const currentPassword = 'CurrentPassword123!';
    const newPassword = 'NewPassword123!';
    
    authRepository.changePassword.and.returnValue(of(undefined));

    useCase.execute(currentPassword, newPassword).subscribe();

    expect(authRepository.changePassword).toHaveBeenCalledWith(currentPassword, newPassword);
  });

  it('should return error observable for invalid new password', () => {
    const currentPassword = 'CurrentPassword123!';
    const newPassword = 'weak'; // Invalid password

    useCase.execute(currentPassword, newPassword).subscribe({
      error: (error) => {
        expect(error.message).toBe('New password does not meet requirements');
      }
    });
  });

  it('should return error observable when new password is same as current', () => {
    const password = 'SamePassword123!';

    useCase.execute(password, password).subscribe({
      error: (error) => {
        expect(error.message).toBe('New password must be different from current password');
      }
    });
  });

  describe('password validation', () => {
    it('should reject password without uppercase', () => {
      useCase.execute('current123!', 'newpassword123!').subscribe({
        error: (error) => {
          expect(error.message).toBe('New password does not meet requirements');
        }
      });
    });

    it('should reject password without lowercase', () => {
      useCase.execute('CURRENT123!', 'NEWPASSWORD123!').subscribe({
        error: (error) => {
          expect(error.message).toBe('New password does not meet requirements');
        }
      });
    });

    it('should reject password without numbers', () => {
      useCase.execute('CurrentPass!', 'NewPassword!').subscribe({
        error: (error) => {
          expect(error.message).toBe('New password does not meet requirements');
        }
      });
    });

    it('should reject password without special characters', () => {
      useCase.execute('CurrentPass123', 'NewPassword123').subscribe({
        error: (error) => {
          expect(error.message).toBe('New password does not meet requirements');
        }
      });
    });

    it('should reject password shorter than 8 characters', () => {
      useCase.execute('Current123!', 'New123!').subscribe({
        error: (error) => {
          expect(error.message).toBe('New password does not meet requirements');
        }
      });
    });

    it('should accept valid password', () => {
      const currentPassword = 'CurrentPassword123!';
      const newPassword = 'NewPassword123!';

      authRepository.changePassword.and.returnValue(of(undefined));

      useCase.execute(currentPassword, newPassword).subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
        },
        error: () => {
          fail('Should not have thrown an error for valid password');
        }
      });

      expect(authRepository.changePassword).toHaveBeenCalledWith(currentPassword, newPassword);
    });
  });
});
