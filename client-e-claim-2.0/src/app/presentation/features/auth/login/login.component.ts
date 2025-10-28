import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil} from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  CircleAlert,
} from 'lucide-angular';

import { AuthCredentials } from '../../../../core/domain/entities/auth.entity';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ValidatorsService } from '../../../../core/infrastructure/services/validators.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LucideAngularModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  icons = {
    lock: LockKeyhole,
    mail: Mail,
    eye: Eye,
    eyeOff: EyeOff,
    alert: CircleAlert,
  };

  loginForm: FormGroup;
  passwordVisible = false;
  isLoading = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private validatorsService: ValidatorsService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          // Validators.pattern(
          //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
          // ),
          this.validatorsService.passwordValidator()
        ],
      ],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.loadRememberedEmail();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRememberedEmail(): void {
    const rememberedEmail = this.authService.getRememberedEmail();
    const rememberedPassword = this.authService.getRememberedPassword();
    
    if (rememberedEmail || rememberedPassword) {
      this.loginForm.patchValue({
        email: rememberedEmail || '',
        password: rememberedPassword || '',
        rememberMe: true,
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials: AuthCredentials = this.loginForm.value;

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => setTimeout(() => this.handleLoginSuccess()),
        error: (err) => this.handleLoginError(err)
      });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private handleLoginSuccess(): void {
    if (this.loginForm.value.rememberMe) {
      this.authService.setRememberedEmail(this.loginForm.value.email);
      this.authService.setRememberedPassword(this.loginForm.value.password);
    } else {
      this.authService.clearRememberedEmail();
    }

    this.router.navigate(['/dashboard/claims']);
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.errorMessage =
      error.message || 'Login failed. Please check your credentials.';
    this.toast.error(error.message);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
