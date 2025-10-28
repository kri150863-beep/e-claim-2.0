import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, of, throwError } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

import { FirstLoginComponent } from './first-login.component';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { AuthRepository } from '../../../../core/domain/repositories/auth.repository';
import { VerifyInviteTokenUseCase } from '../../../../core/domain/use-cases/auth/verify-invite-token.use-case';
import { FirstLoginUseCase } from '../../../../core/domain/use-cases/auth/first-login.use-case';

describe('FirstLoginComponent', () => {
  let component: FirstLoginComponent;
  let fixture: ComponentFixture<FirstLoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let authRepository: jasmine.SpyObj<AuthRepository>;
  let verifyInviteTokenUseCase: jasmine.SpyObj<VerifyInviteTokenUseCase>;
  let firstLoginUseCase: jasmine.SpyObj<FirstLoginUseCase>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'firstLogin',
      'verifyInviteToken',
      'setRememberedEmail',
      'setRememberedPassword',
      'clearRememberedEmail'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'success']);
    const authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['verifyInviteToken', 'firstLogin']);
    const verifyInviteTokenUseCaseSpy = jasmine.createSpyObj('VerifyInviteTokenUseCase', ['execute']);
    const firstLoginUseCaseSpy = jasmine.createSpyObj('FirstLoginUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LucideAngularModule,
        FirstLoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: AuthRepository, useValue: authRepositorySpy },
        { provide: VerifyInviteTokenUseCase, useValue: verifyInviteTokenUseCaseSpy },
        { provide: FirstLoginUseCase, useValue: firstLoginUseCaseSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => {
                  const params: { [key: string]: string } = {
                    'token': 'valid-invite-token',
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

    fixture = TestBed.createComponent(FirstLoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    authRepository = TestBed.inject(AuthRepository) as jasmine.SpyObj<AuthRepository>;
    verifyInviteTokenUseCase = TestBed.inject(VerifyInviteTokenUseCase) as jasmine.SpyObj<VerifyInviteTokenUseCase>;
    firstLoginUseCase = TestBed.inject(FirstLoginUseCase) as jasmine.SpyObj<FirstLoginUseCase>;
    router = TestBed.inject(Router);

    // Create a proper mock JWT token (header.payload.signature format)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    // Setup default behavior for dependencies
    authRepository.verifyInviteToken.and.returnValue(of({ data: { valid: true } }));
    authRepository.firstLogin.and.returnValue(of({ data: { accessToken: mockToken, refreshToken: 'mock-refresh' } }));
    verifyInviteTokenUseCase.execute.and.returnValue(of({ data: { valid: true } }));
    firstLoginUseCase.execute.and.returnValue(of({ data: { accessToken: mockToken, refreshToken: 'mock-refresh' } }));
    authService.verifyInviteToken.and.returnValue(of({ data: { valid: true } }));
    authService.firstLogin.and.returnValue(of({ data: { accessToken: mockToken, refreshToken: 'mock-refresh' } }));

    // Create a properly typed spy for router.navigate
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should invalidate form with empty fields', () => {
      component.firstLoginForm.setValue({
        email: '',
        password: '',
        rememberMe: false
      });

      expect(component.firstLoginForm.valid).toBeFalse();
    });

    it('should invalidate form with invalid email', () => {
      component.firstLoginForm.setValue({
        email: 'invalid-email',
        password: 'StrongPass123!',
        rememberMe: false
      });

      expect(component.firstLoginForm.get('email')?.valid).toBeFalse();
    });

    it('should invalidate form with weak password', () => {
      component.firstLoginForm.setValue({
        email: 'valid@email.com',
        password: 'weak',
        rememberMe: false
      });

      expect(component.firstLoginForm.get('password')?.valid).toBeFalse();
    });

    it('should validate form with valid inputs', () => {
      component.firstLoginForm.setValue({
        email: 'valid@email.com',
        password: 'StrongPass123!',
        rememberMe: false
      });

      expect(component.firstLoginForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authService.firstLogin.calls.reset();
      (router.navigate as jasmine.Spy).calls.reset();
    });

    it('should not submit invalid form', () => {
      component.firstLoginForm.setValue({
        email: 'invalid-email',
        password: 'weak',
        rememberMe: false
      });

      component.onSubmit();

      expect(authService.firstLogin).not.toHaveBeenCalled();
      expect(component.firstLoginForm.touched).toBeTrue();
    });

    it('should call AuthService.firstLogin with correct credentials', () => {
      const credentials = {
        email: 'valid@email.com',
        password: 'StrongPass123!',
        rememberMe: false
      };

      component.firstLoginForm.setValue(credentials);
      component.onSubmit();

      expect(authService.firstLogin).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });
    });

    it('should handle firstLogin success', fakeAsync(() => {
      const credentials = {
        email: 'valid@email.com',
        password: 'StrongPass123!',
        rememberMe: true
      };

      // Create a Subject that we can manually trigger
      const firstLoginSubject = new Subject<any>();
      authService.firstLogin.and.returnValue(firstLoginSubject);

      component.firstLoginForm.setValue(credentials);
      component.onSubmit();

      // Trigger the success path
      firstLoginSubject.next({});

      // Handle any setTimeout if present
      tick();

      expect(authService.setRememberedEmail).toHaveBeenCalledWith(credentials.email);
      expect(authService.setRememberedPassword).toHaveBeenCalledWith(credentials.password);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/claims']);
    }));

    it('should handle firstLogin error', fakeAsync(() => {
      const error = { message: 'Invalid credentials' };
      authService.firstLogin.and.returnValue(throwError(() => error));

      component.firstLoginForm.setValue({
        email: 'valid@email.com',
        password: 'StrongPass123!',
        rememberMe: false
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