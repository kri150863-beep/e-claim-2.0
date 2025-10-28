import { Component, computed, inject, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Calendar } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop'
import { DialogData } from './export-dialog.types';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { exportTableToCSV, exportTableToExcel, exportTableToPDF } from '../../../../../core/shared/utils/export.util';
import { UserRoles } from '../../../../../core/shared/constants/roles.const';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { PaymentStatus, Status } from '../../../../../core/shared/constants/payment-status.const';

@Component({
  selector: 'export-dialog',
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [ ButtonComponent, CommonModule, ReactiveFormsModule, MatDialogTitle, MatSelectModule, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, MatDatepickerModule, LucideAngularModule, NgClass ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss'
})
export class ExportDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ExportDialogComponent>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  role = this.data.role
  order = [ PaymentStatus.NEW, PaymentStatus.SUBMITTED, PaymentStatus.UNDER_REVIEW, PaymentStatus.APPROVED, PaymentStatus.PAID]
  payments = this.data.payments
  exportColumns = this.data.exportColumns
  csvFormat = "CSV"
  excelFormat = "Excel"
  pdfFormat = "PDF"
  supportedFormats = [this.csvFormat, this.excelFormat, this.pdfFormat]

  exportForm: FormGroup
  icons = {
    calendar: Calendar
  }
  today = new Date()
  private fb = inject(FormBuilder)

  startDateSig!: Signal<Date | null>
  endDateSig!: Signal<Date | null>

  className = (()=>{
    switch(this.role) {
      case UserRoles.SURVEYOR: return "surveyor"
      case UserRoles.GARAGE: return "garage"
      case UserRoles.SPARE_PARTS: return "spare_part"
      default: return ""
    }
  })()
  stats = computed(() => {
    const values: string[] = []
    this.payments.forEach(({ status }) => {
      const index = values.findIndex(stat => stat === status)
      if (index < 0) values.push(status)
    })
    return values.sort((a, b) => this.order.indexOf(a as Status) - this.order.indexOf(b as Status))
  })
  private updateStatusValidator() {
    const statusControl = this.exportForm.get('status')
    if (['garage', 'spare_part'].includes(this.className)) statusControl?.setValidators([Validators.required])
    else statusControl?.clearValidators()
    statusControl?.updateValueAndValidity()
  }

  constructor(
    private datePipe: DatePipe
  ) {
    this.exportForm =  this.fb.group({
      startDate: ['', [ Validators.required ]],
      endDate: ['', [ Validators.required ]],
      format: ['', [ Validators.required ]],
      status: [''],
    })

    this.updateStatusValidator()

    this.startDateSig = toSignal(this.exportForm.get('startDate')!.valueChanges, {
      initialValue: this.exportForm.get('startDate')!.value
    })

    this.endDateSig = toSignal(this.exportForm.get('endDate')!.valueChanges, {
      initialValue: this.exportForm.get('endDate')!.value
    })
  }

  startMaxDate = computed(() => {
    const end = this.endDateSig()
    return end ? new Date(end) : this.today
  })

  endMinDate = computed(() => {
    const start = this.startDateSig()
    return start ? new Date(start) : null
  })

  formatDate(date: Date | string) { return this.datePipe.transform(date, "MM-dd-yyyy") }
  
  close() { this.dialogRef.close() }
  onSubmit() {
    if (this.exportForm.invalid) {
      this.exportForm.markAllAsTouched()
      return
    }
    const { startDate, endDate, format, status } = this.exportForm.value
    const filteredPayments = this.payments.filter((payment) => {
      const createdAt = new Date(payment.createdAt)
      return createdAt >= new Date(startDate) && createdAt <= new Date(endDate) && ((!status) || (payment.status === status))
    })

    const filename = `Payments_${this.formatDate(startDate)}_${this.formatDate(endDate)}`

    if (format === this.csvFormat) exportTableToCSV(filteredPayments, this.exportColumns, filename)
    if (format === this.excelFormat) exportTableToExcel(filteredPayments, this.exportColumns, filename)
    if (format === this.pdfFormat) exportTableToPDF(filteredPayments, this.exportColumns, filename)

    this.close()
  }

  get startDate() {
    return this.exportForm.get('startDate')
  }
  get endDate() {
    return this.exportForm.get('endDate')
  }
  get format() {
    return this.exportForm.get('format')
  }
  get status() {
    return this.exportForm.get('status')
  }
}