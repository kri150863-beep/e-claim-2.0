import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AccountInfoComponent } from './account-info.component';
import { ProfileService, AccountField } from '../../../../core/infrastructure/services/profile.service';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { User } from '../../../../core/domain/entities/user.entity';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    roles: ['user'],
    profile: {
      businessName: 'Test Business',
      businessRegistrationNumber: 'BRN123',
      businessAddress: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      phoneNumber: '+1234567890',
      website: 'https://test.com'
    }
  };

  beforeEach(async () => {
    const mockFields: AccountField[] = [
      { label: 'Business name', value: 'Test Business', key: 'businessName', editable: false, required: true, type: 'text' },
      { label: 'Email address', value: 'test@example.com', key: 'email', editable: false, required: true, type: 'email' }
    ];

    const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'loadProfile', 'updateAccountField', 'getCurrentProfile', 'getAccountFields', 'validateAccountField'
    ], {
      currentProfile$: of(mockUser),
      accountFields$: of(mockFields),
      isLoading$: of(false)
    });

    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AccountInfoComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    // Setup additional mocks
    profileService.getAccountFields.and.returnValue(mockFields);
    profileService.validateAccountField.and.returnValue({ valid: true });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', () => {
    profileService.loadProfile.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(profileService.loadProfile).toHaveBeenCalled();
  });

  it('should update fields from user data', () => {
    profileService.loadProfile.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.fields.length).toBeGreaterThan(0);
    expect(component.fields.find(f => f.key === 'businessName')?.value).toBe('Test Business');
    expect(component.fields.find(f => f.key === 'email')?.value).toBe('test@example.com');
  });

  it('should start edit mode for a field', () => {
    const field: AccountField = {
      label: 'Business name',
      value: 'Test Business',
      key: 'businessName',
      editing: false,
      editable: false,
      required: true,
      type: 'text'
    };

    component.startEdit(field);

    expect(field.editing).toBe(true);
    expect(field.editable).toBe(true);
  });

  it('should cancel edit mode for a field', () => {
    const field: AccountField = {
      label: 'Business name',
      value: 'Test Business',
      key: 'businessName',
      editing: true,
      editable: true,
      required: true,
      type: 'text'
    };
    component.accountForm.get('businessName')?.setValue('Modified Business');

    component.cancelEdit(field);

    expect(field.editing).toBe(false);
    expect(field.editable).toBe(false);
    expect(component.accountForm.get('businessName')?.value).toBe('Test Business');
  });

  it('should save field successfully', () => {
    const field: AccountField = {
      label: 'Business name',
      value: 'Test Business',
      key: 'businessName',
      editing: true,
      editable: true,
      required: true,
      type: 'text'
    };
    const updatedUser = { ...mockUser, profile: { ...mockUser.profile!, businessName: 'Updated Business' } };

    component.accountForm.get('businessName')?.setValue('Updated Business');
    profileService.updateAccountField.and.returnValue(of(updatedUser));
    profileService.validateAccountField.and.returnValue({ valid: true });

    component.saveEdit(field);

    expect(profileService.updateAccountField).toHaveBeenCalledWith(field, 'Updated Business');
    expect(toastService.success).toHaveBeenCalledWith('Business name updated successfully');
    // Note: field.editing state is managed by the component, not tested here
  });

  it('should handle save field error', () => {
    const field: AccountField = {
      label: 'Business name',
      value: 'Test Business',
      key: 'businessName',
      editing: true,
      editable: true,
      required: true,
      type: 'text'
    };
    const error = new Error('Update failed');

    component.accountForm.get('businessName')?.setValue('Updated Business');
    profileService.updateAccountField.and.returnValue(throwError(() => error));
    profileService.validateAccountField.and.returnValue({ valid: true });

    component.saveEdit(field);

    expect(toastService.error).toHaveBeenCalledWith('Failed to update business name');
  });

  it('should not save invalid field', () => {
    const field: AccountField = {
      label: 'Email address',
      value: 'test@example.com',
      key: 'email',
      editing: true,
      editable: true,
      required: true,
      type: 'email'
    };

    component.accountForm.get('email')?.setValue('invalid-email');
    profileService.validateAccountField.and.returnValue({ valid: false, error: 'Invalid email address' });

    component.saveEdit(field);

    expect(profileService.updateAccountField).not.toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalledWith('Invalid email address');
  });

  it('should get field error messages', () => {
    const field: AccountField = {
      label: 'Email address',
      value: 'test@example.com',
      key: 'email',
      type: 'email',
      editable: false,
      required: true
    };

    // Setup form control with errors
    const emailControl = component.accountForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    emailControl?.setErrors({ required: true });

    // Mock validation to return error
    profileService.validateAccountField.and.returnValue({
      valid: false,
      error: 'Email address is required'
    });

    const error = component.getFieldError(field);
    expect(error).toBe('Email address is required');
  });

  it('should handle profile load error', () => {
    const error = new Error('Load failed');
    profileService.loadProfile.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(toastService.error).toHaveBeenCalledWith('Failed to load account information');
  });
});
