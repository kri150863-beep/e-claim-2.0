import { Component, inject } from '@angular/core';
import { Payment } from '../../../../core/domain/entities/payment.entity';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Download, LucideAngularModule } from 'lucide-angular';
import { exportInvoiceToPDF, Field } from '../../../../core/shared/utils/export.util';
import { UserRoles } from '../../../../core/shared/constants/roles.const';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import { TableComponent } from '../../../shared/ui/table/table.component';
import { PaymentStatus, Status } from '../../../../core/shared/constants/payment-status.const';

@Component({
  selector: 'payments-details',
  imports: [ MatIconModule, LucideAngularModule, MatIconModule, TableComponent, CommonModule, ButtonComponent, ReactiveFormsModule ],
  templateUrl: './payments-details.component.html',
  styleUrl: './payments-details.component.scss'
})
export class PaymentsDetailsComponent {
  role: string
  className: string
  payment: Payment | undefined
  tableDatas: string [][]
  pTableDatas: any
  paymentTitle: string
  detailsFields: Field[]
  inputDetailsFields: Field[]
  lucideIcons = { download: Download }
  readonly dialog = inject(MatDialog)

  form: FormGroup
  private fb = inject(FormBuilder)

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation()
    this.payment = nav?.extras.state?.['payment']
    this.tableDatas = nav?.extras.state?.['tableDatas']
    this.detailsFields = nav?.extras.state?.['detailsFields']
    this.role = nav?.extras.state?.['role']
    this.paymentTitle = nav?.extras.state?.['paymentTitle']
    this.inputDetailsFields = nav?.extras.state?.['inputDetailsFields']
    this.pTableDatas = nav?.extras.state?.['pTableDatas']
    this.className = (()=>{
      switch(this.role) {
        case UserRoles.SURVEYOR: return "surveyor"
        case UserRoles.GARAGE: return "garage"
        case UserRoles.SPARE_PARTS: return "spare_part"
        default: return ""
      }
    })()
    this.form = this.fb.group({
      invoiceId: ['', Validators.required]
    })
  }


  getData(column: string) {
    return this.payment?.[column as keyof Payment] ?? ""
  }

  openPaymentList(){
    this.router.navigate(['dashboard/payments'])
  }

  statusSeverity: Record<string, Status[]> = {
    info: [ PaymentStatus.PAID ],
    warning: [ PaymentStatus.UNDER_REVIEW ],
    success: [ PaymentStatus.APPROVED, PaymentStatus.SUBMITTED ],
    new: [ PaymentStatus.NEW ],
  }

  getStatusSeverity(value: string= PaymentStatus.PAID) {
    return Object.entries(this.statusSeverity).find(([key, values]) =>
      values.includes(value as Status)
    )?.[0]
  }

  onDownload(event: Event, row?: Payment) {
    event.stopPropagation()
    if (row) {
      const { claimId } = row
      exportInvoiceToPDF(
        this.detailsFields,
        this.tableDatas,
        this.pTableDatas,
        `Claim_${claimId}`,
        `Claim n°: ${row.claimId}`
      )      
    }
  }

  openSubmitDialog(invoiceId: string) {
    const dialogRef = this.dialog.open(SubmitDialogComponent, { data: { invoiceId }})
    dialogRef.afterClosed().subscribe(() => this.openPaymentList())
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const { invoiceId } = this.form.value
    this.openSubmitDialog(invoiceId)
  }

  get invoiceId() {
    return this.form.get('invoiceId')
  }
}
