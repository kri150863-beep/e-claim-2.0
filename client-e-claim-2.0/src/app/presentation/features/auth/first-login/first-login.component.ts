import { Component } from '@angular/core';
import { AuthCredentials } from '../../../../core/domain/entities/auth.entity';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CircleAlert, Eye, EyeOff, LockKeyhole, LucideAngularModule, Mail } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrl: './first-login.component.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LucideAngularModule,
  ],
})
export class FirstLoginComponent {
  icons = {
    lock: LockKeyhole,
    mail: Mail,
    eye: Eye,
    eyeOff: EyeOff,
    alert: CircleAlert,
  };

  tokenValid = false;
  tokenError = '';
  firstLoginForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  isLoading = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
  ) {
    this.firstLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const token = decodeURIComponent(params.get('token') || '');
    const email = decodeURIComponent(params.get('email') || '');

    if (!token || !email) {
      this.tokenError = 'Invalid invite link';
      return;
    }

    this.validateToken({ token, email });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateToken({ email, token }: { email: string, token: string }) {
    this.authService
      .verifyInviteToken({ email, token })
      .subscribe({
        next: (result) => {
          this.handleValidateTokenSuccess(result);
        },
        error: (error) => {
          this.handleValidateTokenError(error);
        },
      });
  }

  onSubmit(): void {
    if (this.firstLoginForm.invalid) {
      this.firstLoginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials: AuthCredentials = this.firstLoginForm.value;

    this.authService.firstLogin(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => setTimeout(() => this.handleFirstLoginSuccess()),
        error: (err) => this.handleFirstLoginError(err)
      });
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

  private handleFirstLoginSuccess(): void {
    if (this.firstLoginForm.value.rememberMe) {
      this.authService.setRememberedEmail(this.firstLoginForm.value.email);
      this.authService.setRememberedPassword(this.firstLoginForm.value.password);
    } else {
      this.authService.clearRememberedEmail();
    }

    this.router.navigate(['/dashboard/claims']);
  }

  private handleFirstLoginError(error: any): void {
    this.isLoading = false;
    this.errorMessage =
      error.message || 'Login failed. Please check your credentials.';
    this.toast.error(error.message);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get email() {
    return this.firstLoginForm.get('email');
  }
  get password() {
    return this.firstLoginForm.get('password');
  }
}
