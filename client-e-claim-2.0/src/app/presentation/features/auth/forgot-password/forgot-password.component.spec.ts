import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, of, throwError } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ForgotPasswordUseCase } from '../../../../core/domain/use-cases/auth/forgot-password.use-case';
import { AuthRepository } from '../../../../core/domain/repositories/auth.repository';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let forgotPasswordUseCase: jasmine.SpyObj<ForgotPasswordUseCase>;
  let authRepository: jasmine.SpyObj<AuthRepository>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['requestPasswordReset']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'success']);
    const forgotPasswordUseCaseSpy = jasmine.createSpyObj('ForgotPasswordUseCase', ['execute']);
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['requestPasswordReset']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LucideAngularModule,
        ForgotPasswordComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ForgotPasswordUseCase, useValue: forgotPasswordUseCaseSpy },
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    forgotPasswordUseCase = TestBed.inject(ForgotPasswordUseCase) as jasmine.SpyObj<ForgotPasswordUseCase>;
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
    router = TestBed.inject(Router);

    // Setup default behavior for dependencies
    authRepository.requestPasswordReset.and.returnValue(of(undefined));
    forgotPasswordUseCase.execute.and.returnValue(of({ data: { message: 'Reset link sent' } }));
    authService.requestPasswordReset.and.returnValue(of({ data: { message: 'Reset link sent' } }));

    // Create a properly typed spy for router.navigate
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should invalidate form with empty email', () => {
      component.forgotPasswordForm.setValue({
        email: ''
      });
      
      expect(component.forgotPasswordForm.valid).toBeFalse();
    });

    it('should invalidate form with invalid email', () => {
      component.forgotPasswordForm.setValue({
        email: 'invalid-email'
      });
      
      expect(component.forgotPasswordForm.valid).toBeFalse();
    });

    it('should validate form with valid email', () => {
      component.forgotPasswordForm.setValue({
        email: 'valid@email.com'
      });
      
      expect(component.forgotPasswordForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authService.requestPasswordReset.calls.reset();
      (router.navigate as jasmine.Spy).calls.reset();
    });

    it('should not submit invalid form', () => {
      component.forgotPasswordForm.setValue({
        email: 'invalid-email'
      });

      component.onSubmit();

      expect(authService.requestPasswordReset).not.toHaveBeenCalled();
      expect(component.forgotPasswordForm.touched).toBeTrue();
    });

    it('should call AuthService.requestPasswordReset with correct email', () => {
      const email = 'valid@email.com';
      
      component.forgotPasswordForm.setValue({ email });
      component.onSubmit();
      
      expect(authService.requestPasswordReset).toHaveBeenCalledWith({ email });
    });

    it('should handle requestPasswordReset success', fakeAsync(() => {
      const email = 'valid@email.com';

      // Create a Subject that we can manually trigger
      const resetSubject = new Subject<void>();
      authService.requestPasswordReset.and.returnValue(resetSubject);

      component.forgotPasswordForm.setValue({ email });
      component.onSubmit();
      
      // Trigger the success path
      resetSubject.next();
      resetSubject.complete();
      
      // Handle any setTimeout if present
      tick();

      expect(toastService.success).toHaveBeenCalled();
      // The component doesn't navigate after success, it just shows a success message
    }));

    it('should handle requestPasswordReset error', fakeAsync(() => {
      const error = { message: 'Email not found' };
      authService.requestPasswordReset.and.returnValue(throwError(() => error));

      component.forgotPasswordForm.setValue({
        email: 'valid@email.com'
      });

      component.onSubmit();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(toastService.error).toHaveBeenCalledWith(error.message);
    }));
  });

  describe('UI Interactions', () => {
    it('should navigate back to login', () => {
      component.backToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});