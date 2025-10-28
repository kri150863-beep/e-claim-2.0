
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  selector: 'app-claims-vehicule',
  templateUrl: './claims-vehicule.component.html',
  styleUrls: ['./claims-vehicule.component.scss']
})
export class ClaimsVehiculeComponent {
  @Input() vehicleInfo: any;
  @Output() formSubmitted = new EventEmitter<any>();
  vehicleForm: FormGroup;
  formSubmittedAttempt = false;

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      make: [{ value: '', disabled: true }, [Validators.required]],
      model: [{ value: '', disabled: true }, [Validators.required]],
      cc: [{ value: '', disabled: true }, [Validators.required]],
      fuelType: [{ value: '', disabled: true }, [Validators.required]],
      transmission: [{ value: '', disabled: true }, [Validators.required]],
      engineNo: [{ value: '', disabled: true }, [Validators.required]],
      chassisNo: [{ value: '', disabled: true }, [Validators.required]],
      vehicleNo: [{ value: '', disabled: true }, [Validators.required]],
      color: ['', [Validators.required]],
      odometerReading: ['', [Validators.required]],
      isTotalLoss: [false, [Validators.required]],
      conditionOfVehicle: ['', [Validators.required]],
      placeOfSurvey: ['', [Validators.required]],
      pointOfImpact: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.patchFormValues();
  }

  private patchFormValues(): void {
    this.vehicleForm.patchValue({
      make: this.vehicleInfo?.make,
      model: this.vehicleInfo?.model,
      cc: this.vehicleInfo?.cc,
      fuelType: this.vehicleInfo?.fuel_type,
      transmission: this.vehicleInfo?.transmission,
      engineNo: this.vehicleInfo?.engine_no,
      chassisNo: this.vehicleInfo?.chassis_no,
      vehicleNo: this.vehicleInfo?.vehicle_no,
      color: this.vehicleInfo?.color,
      odometerReading: this.vehicleInfo?.odometer_reading,
      isTotalLoss: this.vehicleInfo?.is_total_loss ? 'Yes' : 'No',
      conditionOfVehicle: this.vehicleInfo?.condition_of_vehicle,
      placeOfSurvey: this.vehicleInfo?.place_of_survey,
      pointOfImpact: this.vehicleInfo?.point_of_impact
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.formSubmittedAttempt));
  }

  async submitForm(): Promise<boolean> {
    if (this.vehicleForm.invalid) {
      this.markAllAsTouched();
      console.error('Vehicle form is invalid');
      return false;
    }

    const formValue = this.getFormValue();
    this.formSubmitted.emit(formValue);

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
    Object.values(this.vehicleForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private getFormValue(): any {
    return {
      ...this.vehicleForm.value,
      make: this.vehicleInfo?.make,
      model: this.vehicleInfo?.model,
      cc: this.vehicleInfo?.cc,
      fuelType: this.vehicleInfo?.fuel_type,
      transmission: this.vehicleInfo?.transmission,
      engineNo: this.vehicleInfo?.engine_no,
      chassisNo: this.vehicleInfo?.chassis_no,
      vehicleNo: this.vehicleInfo?.vehicle_no,
    };
  }
}