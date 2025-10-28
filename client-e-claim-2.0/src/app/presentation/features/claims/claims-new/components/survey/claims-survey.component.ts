
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { UploadComponent } from "../../../../../shared/ui/form/upload/upload.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-claims-survey',
  templateUrl: './claims-survey.component.html',
  styleUrls: ['./claims-survey.component.scss'],
  imports: [MatIconModule, UploadComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
  providers: []
})
export class ClaimsSurveyComponent implements OnInit {
  @Input() surveyInfo: any;
  @Output() formSubmitted = new EventEmitter<any>();
  surveyForm: FormGroup;
  formSubmittedAttempt = false;

  surveyTypes = [
    { id: 'PHYSICAL', name: 'Physical Inspection' },
    { id: 'VIRTUAL', name: 'Virtual Inspection' },
    { id: 'HYBRID', name: 'Hybrid Inspection' }
  ];
  documents = [
    { name: 'EOR1.pdf' },
    { name: 'EOR2.pdf' },
    { name: 'EOR3.pdf' }
  ];
  constructor(private fb: FormBuilder) {
    this.surveyForm = this.fb.group({
      garage: [{ value: 'Mercedes', disabled: true }, Validators.required],
      garageAddress: [{ value: 'Royal Road Port-Louis', disabled: true }, Validators.required],
      garageContactNumber: [{ value: '(230) 5 444 2000', disabled: true }, Validators.required],
      eorValue: [{ value: 'Rs. 950,000.00', disabled: true }, Validators.required],
      invoiceNumber: ['', Validators.required],
      surveyType: ['', Validators.required],
      dateOfSurvey: ['', Validators.required],
      timeOfSurvey: ['', Validators.required],
      preAccidentValue: [''],
      showroomPrice: [''],
      wreckValue: ['', Validators.required],
      excessApplicable: ['']
    });
  }

  ngOnInit() {
    this.patchFormValues();
  }

  patchFormValues(): void {
    this.surveyForm.patchValue({
      garage: this.surveyInfo?.garage,
      garageAddress: this.surveyInfo?.garage_address,
      garageContactNumber: this.surveyInfo?.garage_contact_number,
      eorValue: this.surveyInfo?.eor_value,
      invoiceNumber: this.surveyInfo?.invoice_number,
      surveyType: this.surveyInfo?.survey_type,
      dateOfSurvey: this.surveyInfo?.survey_date,
      timeOfSurvey: this.surveyInfo?.survey_time,
      preAccidentValue: this.surveyInfo?.pre_accident_value,
      showroomPrice: this.surveyInfo?.showroom_price,
      wreckValue: this.surveyInfo?.wreck_value,
      excessApplicable: this.surveyInfo?.excess_applicable
    });
  }

  handleUploadedFiles($event: File[]) {
    console.log($event);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.surveyForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.formSubmittedAttempt));
  }

  async submitForm(): Promise<boolean> {
    if (this.surveyForm.invalid) {
      this.markAllAsTouched();
      console.error('Vehicle form is invalid');
      return false;
    }

    const formValue = this.getFormValue();

    // Emit the form values to parent component
    this.formSubmitted.emit(formValue);

    // Add your form submission logic here (API call, etc.)
    try {
      // Simulate API call
      // await this.claimService.updateVehicleInfo(formValue).toPromise();
      return true;
    } catch (error) {
      console.error('Error submitting vehicle form:', error);
      return false;
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.surveyForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private getFormValue(): any {
    return {
      ...this.surveyForm.value,
      // Include disabled fields if needed
      garage: this.surveyForm.get('garage')?.value,
      garageAddress: this.surveyForm.get('garageAddress')?.value,
      garageContactNumber: this.surveyForm.get('garageContactNumber')?.value,
      eorValue: this.surveyForm.get('eorValue')?.value,
    };
  }
}