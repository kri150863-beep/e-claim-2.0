import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  CircleCheck,
  CircleX,
  LucideAngularModule,
  PencilLine,
} from 'lucide-angular';
import { Subject, takeUntil, Observable } from 'rxjs';

import { ToastService } from '../../../../core/infrastructure/services/toast.service';
import { ProfileService } from '../../../../core/infrastructure/services/profile.service';
import {
  AccountField,
  WebsiteRequest,
} from '../../../../core/domain/entities/profile.entity';
import { ValidatorsService } from '../../../../core/infrastructure/services/validators.service';
import { User } from '../../../../core/domain/entities/user.entity';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: [
    './account-info.component.scss',
    '../setting/setting.component.scss',
  ],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  @Input() currentUser: User | null = null;

  private destroy$ = new Subject<void>();

  icons = {
    edit: PencilLine,
    close: CircleX,
    check: CircleCheck,
  };

  accountForm!: FormGroup;
  fields: AccountField[] = [];
  isLoading$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private profileService: ProfileService,
    private validatorsService: ValidatorsService
  ) {
    this.initializeForm();
    this.isLoading$ = this.profileService.isLoading$;
  }

  ngOnInit(): void {
    this.subscribeToAccountChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.accountForm = this.fb.group({
      website: [
        '',
        [Validators.required, this.validatorsService.urlValidator()],
      ],
    });
  }

  private subscribeToAccountChanges(): void {
    this.profileService.accountFields$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields) => {
        this.fields = fields;
        this.updateFormFromFields(fields);
      });
  }

  private updateFormFromFields(fields: AccountField[]): void {
    const formValue: any = {};
    fields.forEach((field) => {
      if (field.key === 'website') {
        formValue[field.key] = field.value;
      }
    });
    this.accountForm.patchValue(formValue);
  }

  startEdit(field: AccountField): void {
    field.editing = true;
    field.editable = true;

    // Set form control value
    const formControl = this.accountForm.get(field.key);
    if (formControl) {
      formControl.setValue(field.value);
    }
  }

  cancelEdit(field: AccountField): void {
    field.editing = false;
    field.editable = false;

    // Reset form control value
    const formControl = this.accountForm.get(field.key);
    if (formControl) {
      formControl.setValue(field.value);
    }
  }

  saveEdit(field: AccountField): void {
    const formControl = this.accountForm.get(field.key);

    if (!formControl || formControl.invalid) {
      formControl?.markAsTouched();
      const validation = this.profileService.validateFields(
        field,
        formControl?.value
      );
      this.toast.error(
        validation.error || `Invalid ${field.label.toLowerCase()}`
      );
      return;
    }

    const request: WebsiteRequest = {
      newWebsite: formControl.value,
      email: this.currentUser?.username,
    };

    this.profileService
      .updateWebsite(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toast.success(`${field.label} updated successfully`);
        },
        error: (error: any) => {
          this.toast.error(`Failed to update ${field.label.toLowerCase()}`);
          console.error('Update error:', error);
        },
      });
  }

  getFieldError(field: AccountField): string | null {
    const formControl = this.accountForm.get(field.key);
    if (formControl?.errors && formControl.touched) {
      const validation = this.profileService.validateFields(
        field,
        formControl.value
      );
      return validation.error || null;
    }
    return null;
  }

  isWebsiteField(key: string): boolean {
    return key === 'website';
  }

  isEditable(field: AccountField): boolean {
    return field.editable || false;
  }

  // Legacy methods for backward compatibility
  onEdit(field: AccountField): void {
    this.startEdit(field);
  }

  startWebsiteEdit(item: AccountField): void {
    this.startEdit(item);
  }

  saveWebsiteEdit(item: AccountField): void {
    this.saveEdit(item);
  }

  cancelWebsiteEdit(item: AccountField): void {
    this.cancelEdit(item);
  }

  saveField(field: AccountField): void {
    this.saveEdit(field);
  }
}
