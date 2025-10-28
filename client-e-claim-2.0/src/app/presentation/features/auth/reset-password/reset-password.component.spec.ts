import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, of, throwError } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { PopupService } from '../../../../core/infrastructure/services/popup.service';
import { AuthRepository } from '../../../../core/domain/repositories/auth.repository';
import { VerifyResetTokenUseCase } from '../../../../core/domain/use-cases/auth/verify-reset-token.use-case';
import { ResetPasswordUseCase } from '../../../../core/domain/use-cases/auth/reset-password.use-case';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let popupService: jasmine.SpyObj<PopupService>;
  let authRepository: jasmine.SpyObj<AuthRepository>;
  let verifyResetTokenUseCase: jasmine.SpyObj<VerifyResetTokenUseCase>;
  let resetPasswordUseCase: jasmine.SpyObj<ResetPasswordUseCase>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyResetToken', 'resetPassword']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'success']);
    const popupServiceSpy = jasmine.createSpyObj('PopupService', ['open', 'close']);
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['verifyResetToken', 'resetPassword']);
    const verifyResetTokenUseCaseSpy = jasmine.createSpyObj('VerifyResetTokenUseCase', ['execute']);
    const resetPasswordUseCaseSpy = jasmine.createSpyObj('ResetPasswordUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LucideAngularModule,
        ResetPasswordComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: PopupService, useValue: popupServiceSpy },
        { provide: AuthRepository, useValue: authRepositorySpy },
        { provide: VerifyResetTokenUseCase, useValue: verifyResetTokenUseCaseSpy },
        { provide: ResetPasswordUseCase, useValue: resetPasswordUseCaseSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => {
                  const params: { [key: string]: string } = {
                    'token': 'valid-reset-token',
                    'email': 'test@example.com'
                  };
                  return params[key] || null;
                }
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    popupService = TestBed.inject(PopupService) as jasmine.SpyObj<PopupService>;
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
    verifyResetTokenUseCase = TestBed.inject(VerifyResetTokenUseCase) as jasmine.SpyObj<VerifyResetTokenUseCase>;
    resetPasswordUseCase = TestBed.inject(ResetPasswordUseCase) as jasmine.SpyObj<ResetPasswordUseCase>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    // Setup default behavior for dependencies
    authRepository.verifyResetToken.and.returnValue(of({ data: { valid: true } }));
    authRepository.resetPassword.and.returnValue(of(undefined));
    verifyResetTokenUseCase.execute.and.returnValue(of({ data: { valid: true } }));
    resetPasswordUseCase.execute.and.returnValue(of({ success: true }));
    authService.verifyResetToken.and.returnValue(of({ data: { valid: true } }));
    authService.resetPassword.and.returnValue(of({ success: true }));

    // Setup popupService mock
    const mockPopupRef = {
      instance: {
        close: of(true)
      }
    } as any;
    popupService.open.and.returnValue(mockPopupRef);

    // Create a properly typed spy for router.navigate
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Token Verification', () => {
    it('should verify token on init', () => {
      expect(authService.verifyResetToken).toHaveBeenCalledWith({ email: 'test@example.com', token: 'valid-reset-token' });
    });

    it('should navigate to login if token is invalid', fakeAsync(() => {
      authService.verifyResetToken.and.returnValue(of({ data: { valid: false } }));

      // Re-create component to trigger ngOnInit
      fixture = TestBed.createComponent(ResetPasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      tick();

      expect(component.tokenValid).toBeFalse();
      expect(component.tokenError).toBeTruthy();
    }));
  });

  describe('Form Validation', () => {
    it('should invalidate form with empty fields', () => {
      component.resetPasswordForm.setValue({
        password: '',
        confirmPassword: ''
      });
      
      expect(component.resetPasswordForm.valid).toBeFalse();
    });

    it('should invalidate form with weak password', () => {
      component.resetPasswordForm.setValue({
        password: 'weak',
        confirmPassword: 'weak'
      });
      
      expect(component.resetPasswordForm.get('password')?.valid).toBeFalse();
    });

    it('should invalidate form with mismatched passwords', () => {
      component.resetPasswordForm.setValue({
        password: 'StrongPass123!',
        confirmPassword: 'DifferentPass123!'
      });
      
      expect(component.resetPasswordForm.valid).toBeFalse();
    });

    it('should validate form with valid inputs', () => {
      component.resetPasswordForm.setValue({
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      });
      
      expect(component.resetPasswordForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authService.resetPassword.calls.reset();
      (router.navigate as jasmine.Spy).calls.reset();
    });

    it('should not submit invalid form', () => {
      component.resetPasswordForm.setValue({
        password: 'weak',
        confirmPassword: 'different'
      });

      component.onSubmit();

      expect(authService.resetPassword).not.toHaveBeenCalled();
      expect(component.resetPasswordForm.invalid).toBeTrue();
    });

    it('should call AuthService.resetPassword with correct data', () => {
      const passwords = {
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      };
      
      component.resetPasswordForm.setValue(passwords);
      component.onSubmit();
      
      expect(authService.resetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'valid-reset-token',
        newPassword: passwords.password
      });
    });

    it('should handle resetPassword success', fakeAsync(() => {
      const passwords = {
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      };

      // Create a Subject that we can manually trigger
      const resetSubject = new Subject<void>();
      authService.resetPassword.and.returnValue(resetSubject);

      component.resetPasswordForm.setValue(passwords);
      component.onSubmit();
      
      // Trigger the success path
      resetSubject.next();
      resetSubject.complete();
      
      // Handle any setTimeout if present
      tick();

      expect(popupService.open).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
    }));

    it('should handle resetPassword error', fakeAsync(() => {
      const error = { message: 'Invalid token' };
      authService.resetPassword.and.returnValue(throwError(() => error));

      component.resetPasswordForm.setValue({
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!'
      });

      component.onSubmit();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(toastService.error).toHaveBeenCalledWith(error.message);
    }));
  });

  describe('UI Interactions', () => {
    it('should toggle password visibility', () => {
      expect(component.passwordVisible).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeTrue();
      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeFalse();
    });

    it('should toggle confirm password visibility', () => {
      expect(component.confirmPasswordVisible).toBeFalse();
      component.toggleConfirmPasswordVisibility();
      expect(component.confirmPasswordVisible).toBeTrue();
      component.toggleConfirmPasswordVisibility();
      expect(component.confirmPasswordVisible).toBeFalse();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});