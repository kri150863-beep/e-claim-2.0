import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../../../core/domain/entities/payment.entity';
import { Router } from '@angular/router';
import { exportInvoiceToPDF } from '../../../../../core/shared/utils/export.util';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { PaymentStatus } from '../../../../../core/shared/constants/payment-status.const';

@Component({
  selector: 'payments-table',
  imports: [ CommonModule, TableComponent ],
  templateUrl: './payments-table.component.html',
  styleUrl: './payments-table.component.scss'
})
export class PaymentsTableComponent {
    itemsPerPageOptions: number[] = [ 6, 8, 10 ]
    itemsPerPage = this.itemsPerPageOptions[0]
    @Input() payments!: any[]
    @Input() currentPage: number = 1
    @Input() columnProps: any[] = []
    @Input() detailsFields: (payment: Payment) => any[] = () => { return [] }
    @Input() tableDatas!: (row: Payment) => string [][]
    @Input() role!: string
    @Input() vat!: number
    @Input() filters!: { status?: string, sort?: string }
    @Input() formatValue!: (key: string, value: any) => any
    @Input() formatDatas!: (payments: Payment[]) => Payment[]
    @Input() numberFormat!: (value: number) => string
    @Input() paymentTitle!: string
    @Input() inputDetailsFields: (payment: Payment) => any[] = () => { return [] }
    @Input() pTableDatas: (payment: Payment) => any = () => { return {} }
    @Output() sort = new EventEmitter<string>()
    @Output() paginate = new EventEmitter<number>()
    displayedColumns: string[] = this.columnProps.map(({ id }) => id )
    displayedColumnProps = computed(() => {
      return this.columnProps.filter(({ label }) => label !== undefined )
    })

    statusSeverity = {
      primary: [ PaymentStatus.PAID ],
      warning: [ PaymentStatus.UNDER_REVIEW ],
      success: [ PaymentStatus.APPROVED, PaymentStatus.SUBMITTED ],
      info: [ PaymentStatus.NEW ],
    }

    constructor(
      private router: Router
    ){ }

    onPaymentDetail(index: number){
      const payment = this.payments[index]
      this.router.navigate(['dashboard/payments-details'], { state: {
        payment,
        paymentTitle: this.paymentTitle,
        role: this.role,
        detailsFields: this.detailsFields(payment),
        inputDetailsFields: this.inputDetailsFields(payment),
        tableDatas: this.tableDatas(payment),
        pTableDatas: this.pTableDatas(payment)
      } })
    }

    onDownload(index: number) {
      const row = this.payments[index]
      const { claimId } = row
      exportInvoiceToPDF(
        this.detailsFields(row),
        this.tableDatas(row),
        this.pTableDatas(row),
        `Claim_${claimId}`,
        `Claim n°: ${row.claimId}`
      )      
    }

}