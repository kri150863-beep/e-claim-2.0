import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CircleCheck,
  CircleX,
  LucideAngularModule,
  PencilLine,
} from 'lucide-angular';
import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { MultiSelectComponent } from '../../../shared/ui/form/multi-select/multi-select.component';
import {
  AdministrativeField,
  AdministrativeRequest,
} from '../../../../core/domain/entities/profile.entity';
import { ProfileService } from '../../../../core/infrastructure/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../../core/domain/entities/user.entity';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule,
    MultiSelectComponent,
  ],
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: [
    './admin-settings.component.scss',
    '../setting/setting.component.scss',
  ],
})
export class AdminSettingsComponent {
  @Input() currentUser: User | null = null;

  icons = {
    edit: PencilLine,
    close: CircleX,
    confirm: CircleCheck,
  };

  adminForm!: FormGroup;
  private destroy$ = new Subject<void>();

  fields: AdministrativeField[] = [];

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private profileService: ProfileService
  ) {
    this.initializeForm();
    this.subscribeToAdminChanges();
  }

  private initializeForm(): void {
    this.adminForm = this.fb.group({
      primary_contact_name: ['', Validators.required],
      primary_contact_post: ['', Validators.required],
      communication_method: ['', Validators.required],
      notification: [false],
    });
  }

  private subscribeToAdminChanges(): void {
    this.profileService.administrativeFields$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields) => {
        this.fields = fields;
        this.updateFormFromFields(fields);
      });
  }

  private updateFormFromFields(fields: AdministrativeField[]): void {
    const formValue: any = {};
    fields.forEach((field) => {
      if (field.key === 'communication_method') {
        formValue[field.key] = field.value;
      } else {
        formValue[field.key] = field.value;
      }
    });
    this.adminForm.patchValue(formValue);
  }

  startEdit(field: any): void {
    // if (!field.editable) return;

    field.editing = true;
    field.editedValue = field.value;
    this.adminForm.get(this.getFieldControlName(field))?.setValue(field.value);
  }

  getFieldControlName(field: any): string {
    return field.key;
  }

  getFieldType(field: any): string {
    return field.type || 'text';
  }

  isFieldInvalid(field: any): boolean {
    const control = this.adminForm.get(this.getFieldControlName(field));
    return control ? control.invalid : false;
  }

  cancelEdit(field: any): void {
    field.editing = false;
    field.editedValue = field.value;
  }

  saveEdit(field: any): void {
    console.log(field);
    const controlName = this.getFieldControlName(field);
    const control = this.adminForm.get(controlName);

    if (!control || control.invalid) {
      control?.markAsTouched();
      const validation = this.profileService.validateFields(
        field,
        control?.value
      );
      this.toast.error(
        validation.error || `Invalid ${field.label.toLowerCase()}`
      );
      return;
    }

    const request: AdministrativeRequest = {
      email: this.currentUser?.username,
      primaryContactName: this.adminForm.get('primary_contact_name')?.value,
      primaryContactPost: this.adminForm.get('primary_contact_post')?.value,
      methodName: this.adminForm.get('communication_method')?.value,
      notification: this.adminForm.get('notification')?.value,
    };

    this.profileService
      .updateAdministrativeSettings(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success(`${field.label} updated successfully`);
          field.editing = false;
        },
        error: (error: any) => {
          this.toast.error(`Failed to update ${field.label.toLowerCase()}`);
          console.error('Update error:', error);
        },
      });
  }

  toggleSwitch(field: AdministrativeField): void {
    if (!field.editable || field.editing) return;

    const newValue = !field.value;
    field.value = newValue;
    // You might want to save this immediately or show a save button
    this.toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
  }

  toggleSelection(field: AdministrativeField, option: string): void {
    if (!field.editing) return;

    const currentValue =
      this.adminForm.get(this.getFieldControlName(field))?.value || [];
    const index = currentValue.indexOf(option);

    if (index === -1) {
      currentValue.push(option);
    } else {
      currentValue.splice(index, 1);
    }

    this.adminForm.get(this.getFieldControlName(field))?.setValue(currentValue);
  }

  isSelected(field: AdministrativeField, option: string): boolean {
    const value = this.adminForm.get(this.getFieldControlName(field))?.value;
    return Array.isArray(value) ? value.includes(option) : false;
  }

  getFieldError(field: AdministrativeField): string | null {
    const formControl = this.adminForm.get(field.key);
    if (formControl?.errors && formControl.touched) {
      const validation = this.profileService.validateFields(
        field,
        formControl.value
      );
      return validation.error || null;
    }
    return null;
  }
}
