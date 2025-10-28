import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, CircleX } from 'lucide-angular';

import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ForgotPassword } from '../../../../core/domain/entities/auth.entity';

@Component({
  selector: 'app-login',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LucideAngularModule,
  ],
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  icons = {
    mail: Mail,
    alert: CircleX,
  };

  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const payload: ForgotPassword = this.forgotPasswordForm.value;

    this.authService.requestPasswordReset(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.handleForgotPasswordSuccess(res),
        error: (err) => this.handleForgotPasswordError(err)
      });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  private handleForgotPasswordSuccess(data: any): void {
    this.isLoading = false;
    this.toast.success(data?.message || "Link has been successfull sent");
  }

  private handleForgotPasswordError(error: any): void {
    this.isLoading = false;
    this.errorMessage =
      error.message || 'Forgot password fail';
    this.toast.error(error.message);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
