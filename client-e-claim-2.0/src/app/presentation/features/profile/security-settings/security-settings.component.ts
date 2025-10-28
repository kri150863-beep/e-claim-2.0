import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  AlertCircle,
  CheckCircle,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  LucideAngularModule,
  PencilLine,
} from 'lucide-angular';
import { Subject, takeUntil, Observable } from 'rxjs';

import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ProfileService } from '../../../../core/infrastructure/services/profile.service';
import { User } from '../../../../core/domain/entities/user.entity';
import { PasswordChangeRequest } from '../../../../core/domain/entities/user.entity';
import {
  SecurityField,
  SecurityRequest,
  SecuritySettings,
} from '../../../../core/domain/entities/profile.entity';
import { fi, th } from '@faker-js/faker';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: [
    './security-settings.component.scss',
    '../setting/setting.component.scss',
  ],
})
export class SecuritySettingsComponent implements OnInit, OnDestroy {
  @Input() currentUser: User | null = null;

  private destroy$ = new Subject<void>();
  icons = {
    edit: PencilLine,
    close: CircleX,
    confirm: CircleCheck,
    eye: Eye,
    eyeOff: EyeOff,
    alert: AlertCircle,
    check: CheckCircle,
  };

  securityForm!: FormGroup;
  isEditingPassword = false;
  isEditingEmail = false;
  maskedEmail = '';
  isLoading$!: Observable<boolean>;
  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  showRequirements = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toast: ToastService
  ) {
    this.initializeForm();
    this.isLoading$ = this.profileService.isLoading$;
  }

  ngOnInit(): void {
    this.subscribeToSecurityChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.securityForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        backupEmail: ['', [Validators.required, Validators.email]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  private subscribeToSecurityChanges(): void {
    this.profileService.securitySettings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        if (settings) {
          this.maskedEmail = settings.masked_email;
          this.securityForm.patchValue({ backupEmail: settings.backup_email });
        }
      });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  passwordStrengthValidator(control: FormControl) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid =
      password.length >= 8 && hasUpperCase && hasNumbers && hasSpecialChar;

    return isValid
      ? null
      : {
          passwordStrength: {
            hasUpperCase,
            hasNumbers,
            hasSpecialChar,
            minLength: password.length >= 8,
          },
        };
  }

  startEdit(field: 'password' | 'email'): void {
    if (field === 'password') {
      this.isEditingPassword = true;
      this.securityForm.get('currentPassword')?.reset();
      this.securityForm.get('newPassword')?.reset();
      this.securityForm.get('confirmPassword')?.reset();
    } else {
      this.isEditingEmail = true;
      // this.securityForm.get('backupEmail')?.reset();
    }
  }

  cancelEdit(field: 'password' | 'email'): void {
    if (field === 'password') {
      this.isEditingPassword = false;
    } else {
      this.isEditingEmail = false;
    }
  }

  saveEdit(field: 'password' | 'email'): void {
    if (
      (field === 'password' && !this.securityForm.hasError('mismatch')) ||
      (field === 'email' && !this.securityForm.hasError('backupEmail'))
    ) {
      const securityRequest: SecurityRequest = {
        email: this.currentUser?.username,
        currentPassword: this.securityForm.value.currentPassword,
        newPassword: this.securityForm.value.newPassword,
        confirmNewPassword: this.securityForm.value.confirmNewPassword,
        backupEmail: this.securityForm.value.backupEmail,
      };

      console.log('SecurityRequest:', securityRequest);

      this.profileService
        .updateSecuritySettings(securityRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toast.success(
              `${
                field === 'password' ? 'Password' : 'Email'
              } updated successfully`
            );
            this.cancelEdit(field);
            this.securityForm.patchValue({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          },
          error: (error: any) => {
            this.toast.error(error.message || 'Failed to update password');
            console.error('Password update error:', error);
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  updateEmail(): void {
    if (this.securityForm.get('backupEmail')?.valid) {
      const newEmail = this.securityForm.value.backupEmail;

      this.profileService
        .updateEmail(newEmail)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toast.success('Email updated successfully');
            this.isEditingEmail = false;
            this.securityForm.patchValue({ backupEmail: '' });
          },
          error: (error: any) => {
            this.toast.error('Failed to update email');
            console.error('Email update error:', error);
          },
        });
    } else {
      this.securityForm.get('backupEmail')?.markAsTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.securityForm.controls).forEach((key) => {
      this.securityForm.get(key)?.markAsTouched();
    });
  }

  getPasswordStrength(): { score: number; label: string; color: string } {
    const password = this.securityForm.get('newPassword')?.value || '';
    return this.profileService.getPasswordStrength(password);
  }

  getPasswordStrengthErrors(): string[] {
    const password = this.securityForm.get('newPassword')?.value || '';
    const validation = this.profileService.validatePasswordStrength(password);

    if (!validation.valid && validation.requirements) {
      const errors: string[] = [];
      const requirements = validation.requirements;

      if (!requirements.minLength) {
        errors.push('At least 8 characters');
      }
      if (!requirements.hasUpperCase) {
        errors.push('One uppercase letter');
      }
      if (!requirements.hasLowerCase) {
        errors.push('One lowercase letter');
      }
      if (!requirements.hasNumbers) {
        errors.push('One number');
      }
      if (!requirements.hasSpecialChar) {
        errors.push('One special character');
      }

      return errors;
    }

    return [];
  }

  toggleCurrentPasswordVisibility(): void {
    this.currentPasswordVisible = !this.currentPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  hasUppercase(): boolean {
    return this.newPassword?.value && /[A-Z]/.test(this.newPassword.value);
  }

  hasNumber(): boolean {
    return this.newPassword?.value && /[0-9]/.test(this.newPassword.value);
  }

  hasSpecialChar(): boolean {
    return (
      this.newPassword?.value &&
      /[\!\@\#\$\%\^\&\*\(\)\,\?\"\:\{\}\|\<\>]/.test(this.newPassword.value)
    );
  }

  hasMinLength(): boolean {
    return this.newPassword?.value && this.newPassword.value.length >= 8;
  }

  // Form getters
  get currentPassword() {
    return this.securityForm.get('currentPassword');
  }
  get newPassword() {
    return this.securityForm.get('newPassword');
  }
  get confirmPassword() {
    return this.securityForm.get('confirmPassword');
  }
  get backupEmail() {
    return this.securityForm.get('backupEmail');
  }
}
