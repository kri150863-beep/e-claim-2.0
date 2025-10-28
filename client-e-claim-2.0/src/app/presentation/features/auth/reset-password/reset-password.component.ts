// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { CommonModule } from '@angular/common';
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  LockKeyhole,
  LucideAngularModule,
} from 'lucide-angular';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { PopupService } from '../../../../core/infrastructure/services/popup.service';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LucideAngularModule,
  ],
})
export class ResetPasswordComponent implements OnInit {
  icons = {
    lock: LockKeyhole,
    eye: Eye,
    eyeOff: EyeOff,
    close: CircleX,
    alert: CircleAlert,
    check: CircleCheck,
  };

  token: string | null = null;
  email: string | null = null;
  tokenValid = false;
  tokenError = '';
  isSubmitting = false;
  isLoading = true;
  passwordVisible = false;
  confirmPasswordVisible = false;
  resetPasswordForm: FormGroup;
  showRequirements = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private popupService: PopupService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.token = decodeURIComponent(params.get('token') || '');
    this.email = decodeURIComponent(params.get('email') || '');

    if (!this.token || !this.email) {
      this.tokenError = 'Invalid reset link';
      return;
    }

    this.validateToken();
  }

  validateToken() {
    this.authService
      .verifyResetToken({ email: this.email!, token: this.token! })
      .subscribe({
        next: (result) => {
          this.handleValidateTokenSuccess(result);
        },
        error: (error) => {
          this.handleValidateTokenError(error);
        },
      });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.tokenValid) return;
    console.log(this.email);
    this.isSubmitting = true;
    this.authService
      .resetPassword({
        email: this.email!,
        token: this.token!,
        newPassword: this.resetPasswordForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.handleResetPasswordSuccess();
        },
        error: (err) => {
          this.handleResetPasswordError(err);
        },
      });
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  private handleResetPasswordSuccess(): void {
    const popupRef = this.popupService.open(SuccessPopupComponent);

    if (popupRef?.instance) {
      // TypeScript sait maintenant que instance est de type SuccessPopupComponent
      popupRef.instance.close.subscribe(() => {
        this.popupService.close();
        this.router.navigate(['auth/login']);
      });
    }
    this.isSubmitting = false;
    // this.toast.success('Password reset successful');
  }

  private handleResetPasswordError(error: any): void {
    // this.tokenError = error.message || 'Password reset failed';
    this.toast.error(error.message || 'Password reset failed');
    this.isSubmitting = false;
  }

  private handleValidateTokenSuccess(result: any): void {
    this.isLoading = false;
    this.tokenValid = result?.data.valid;
    if (!result?.data.valid) {
      this.tokenError = result.error || 'Invalid token';
    }
  }

  private handleValidateTokenError(error: any): void {
    this.isLoading = false;
    this.tokenError = error.message;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  hasUppercase(): boolean {
    return this.password?.value && /[A-Z]/.test(this.password.value);
  }

  hasNumber(): boolean {
    return this.password?.value && /[0-9]/.test(this.password.value);
  }

  hasSpecialChar(): boolean {
    return (
      this.password?.value &&
      /[\!\@\#\$\%\^\&\*\(\)\,\?\"\:\{\}\|\<\>]/.test(this.password.value)
    );
  }

  hasMinLength(): boolean {
    return this.password?.value && this.password.value.length >= 8;
  }
}
