import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, throwError, of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { LoginUseCase } from '../../../../core/domain/use-cases/auth/login.use-case';
import { AuthRepository } from '../../../../core/domain/repositories/auth.repository';
import { LoginComponent } from './login.component';
import { LucideAngularModule } from 'lucide-angular';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let loginUseCase: jasmine.SpyObj<LoginUseCase>;
  let authRepository: jasmine.SpyObj<AuthRepository>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: Router;

  beforeEach(async () => {
    authRepository = jasmine.createSpyObj('AuthRepository', ['login']);
    loginUseCase = jasmine.createSpyObj('LoginUseCase', ['execute'], {
      authRepository: authRepository,
    });
    const authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      [
        'login',
        'getRememberedEmail',
        'getRememberedPassword',
        'setRememberedEmail',
        'setRememberedPassword',
        'clearRememberedEmail',
      ],
      { loginUseCase: loginUseCase }
    );
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LucideAngularModule,
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoginUseCase, useValue: loginUseCase },
        { provide: AuthRepository, useValue: authRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router);
    
    // Setup default behavior for auth service
    authRepository.login.and.returnValue(of({ token: 'mock-token' }));
    loginUseCase.execute.and.returnValue(of({ success: true }));
    authService.login.and.returnValue(of({ success: true }));
    
    // Clear any previous calls
    authService.getRememberedEmail.calls.reset();
    authService.getRememberedPassword.calls.reset();
    
    // Create a properly typed spy for router.navigate
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should invalidate empty email', () => {
      component.loginForm.get('email')?.setValue('');
      expect(component.loginForm.get('email')?.invalid).toBeTrue();
    });

    it('should invalidate incorrect email format', () => {
      component.loginForm.get('email')?.setValue('invalid-email');
      expect(component.loginForm.get('email')?.invalid).toBeTrue();
    });

    it('should validate correct email format', () => {
      component.loginForm.get('email')?.setValue('valid@email.com');
      expect(component.loginForm.get('email')?.valid).toBeTrue();
    });

    it('should invalidate empty password', () => {
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.get('password')?.invalid).toBeTrue();
    });

    it('should invalidate weak password', () => {
      component.loginForm.get('password')?.setValue('weak');
      expect(component.loginForm.get('password')?.invalid).toBeTrue();
    });

    it('should validate strong password', () => {
      component.loginForm.get('password')?.setValue('StrongPass123!');
      expect(component.loginForm.get('password')?.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authService.login.calls.reset();
      authService.setRememberedEmail.calls.reset();
      authService.setRememberedPassword.calls.reset();
      authService.clearRememberedEmail.calls.reset();
      (router.navigate as jasmine.Spy).calls.reset();
      fixture.detectChanges();
    });

    it('should not submit invalid form', () => {
      component.loginForm.setValue({
        email: 'invalid',
        password: '',
        rememberMe: false,
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
      expect(component.loginForm.touched).toBeTrue();
    });

    it('should call AuthService.login with correct credentials', fakeAsync(() => {
      const credentials = {
        email: 'test@valid.com',
        password: 'ValidPass123!',
        rememberMe: true,
      };

      component.loginForm.setValue(credentials);

      // Debug: Check if form is valid
      expect(component.loginForm.valid).toBeTrue();

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith(credentials);
    }));

    it('should handle login success with rememberMe true', fakeAsync(() => {
      const credentials = {
        email: 'test@valid.com',
        password: 'ValidPass123!',
        rememberMe: true,
      };

      // Create a Subject that we can manually trigger
      const loginSubject = new Subject<any>();
      authService.login.and.returnValue(loginSubject);

      component.loginForm.setValue(credentials);
      component.onSubmit();
      
      // Trigger the success path
      loginSubject.next({});
      
      // Handle the setTimeout
      tick();

      expect(authService.setRememberedEmail).toHaveBeenCalledWith(credentials.email);
      expect(authService.setRememberedPassword).toHaveBeenCalledWith(credentials.password);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/claims']);
    }));

    it('should handle login success with rememberMe false', fakeAsync(() => {
      const credentials = {
        email: 'test@valid.com',
        password: 'ValidPass123!',
        rememberMe: false,
      };

      // Create a Subject that we can manually trigger
      const loginSubject = new Subject<any>();
      authService.login.and.returnValue(loginSubject);

      component.loginForm.setValue(credentials);
      component.onSubmit();
      
      // Trigger the success path
      loginSubject.next({});
      
      // Handle the setTimeout
      tick();

      expect(authService.clearRememberedEmail).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/claims']);
    }));

    it('should handle login error', fakeAsync(() => {
      const error = { message: 'No token received' };
      authService.login.and.returnValue(throwError(() => error));

      component.loginForm.setValue({
        email: 'test@valid.com',
        password: 'ValidPass123!',
        rememberMe: false,
      });

      component.onSubmit();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe(error.message);
      expect(toastService.error).toHaveBeenCalledWith(error.message);
    }));
  });

  describe('Remember Me Functionality', () => {
    it('should load remembered email and password', () => {
      // First destroy the existing component to start fresh
      fixture.destroy();
      
      // Reset the spies
      authService.getRememberedEmail.calls.reset();
      authService.getRememberedPassword.calls.reset();
      
      // Setup the mock return values with explicit returns
      authService.getRememberedEmail.and.returnValue('remembered@email.com');
      authService.getRememberedPassword.and.returnValue('rememberedPass123!');

      // Create a new component instance
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      
      // This will trigger ngOnInit which calls loadRememberedEmail
      fixture.detectChanges();

      // Verify the form values
      expect(component.loginForm.get('email')?.value).toBe('remembered@email.com');
      expect(component.loginForm.get('password')?.value).toBe('rememberedPass123!');
      expect(component.loginForm.get('rememberMe')?.value).toBe(true);
      
      // Verify the spies were called
      expect(authService.getRememberedEmail).toHaveBeenCalled();
      expect(authService.getRememberedPassword).toHaveBeenCalled();
    });
  });

  describe('UI Interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle password visibility', () => {
      expect(component.passwordVisible).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeTrue();
      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeFalse();
    });

    it('should navigate to forgot password', () => {
      component.forgotPassword();
      expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
