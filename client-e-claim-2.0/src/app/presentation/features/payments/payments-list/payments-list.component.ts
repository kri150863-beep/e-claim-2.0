import { Component, inject, OnInit } from '@angular/core';
import { PaymentsTableComponent } from '../components/payments-table/payments-table.component';
import { Observable } from 'rxjs';
import { Payment } from '../../../../core/domain/entities/payment.entity';
import { PaymentService } from '../../../../core/infrastructure/services/payments.service';
import { StatusStatsComponent } from '../components/status-stats/status-stats.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from '../components/export-dialog/export-dialog.component';
import { SortDirection } from '../components/payments-table/payments-table.types';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ExportHeader } from '../../../../core/shared/utils/export.util';
import { UserRoles } from '../../../../core/shared/constants/roles.const';
import getSurveyorParams from "../params/surveyor"
import getGarageParams from "../params/garage"
import getSparePartParams from '../params/sparepart';
import { CommonModule, formatDate } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import getCarRentalParams from '../params/carrental';

@Component({
  selector: 'payments-list',
  imports: [PaymentsTableComponent, StatusStatsComponent, MatIconModule, ButtonComponent, CommonModule],
  standalone: true,
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss'
})
export class PaymentsListComponent implements OnInit {
  vat = 15
  columnProps: any[] = []
  exportColumns: ExportHeader[] = []
  detailsFields: (payment: Payment) => any[] = () => { return [] }
  inputDetailsFields: (payment: Payment) => any[] = () => { return [] }
  pTableDatas: (payment: Payment) => any = () => { return {} }
  role!: string
  tableDatas: (payment: Payment) => string[][] = () => { return [] }
  payments$: Observable<Payment[]>
  payments: Payment[] = []
  filteredPayments: Payment[] = []
  currentStatus: string | null = null
  currentPage = 1
  activeSort: { column: string; direction: SortDirection } = { column: '', direction: 'asc' }
  filters: { status?: string, sort?: string } = {}
  paymentTitle: string= "Payments"
  listTitle: string = "Payments list"
  currency: string = "Rs"
  readonly dialog = inject(MatDialog)
  private authService = inject(AuthService)

  constructor(
    private paymentService: PaymentService
  ){
    this.payments$ = this.paymentService.payments$
  }

  numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format

  dateFormat(value: string): string {
    if (!value) return "-"
    const [month, day, year] = value.split('-')
    const date = new Date(`${year}-${month}-${day}`)
    if (isNaN(date.getTime())) return "-"
    return formatDate(date, 'dd-MMM-yyyy', 'en-US')
  }

  filter(list: Payment[], status: string) {
    return list.filter(({ status: s }) => s === status )
  }

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser()
    const roles = user?.roles ?? []
    let getParams = null
  
    if (roles.includes(UserRoles.SURVEYOR)) {
      this.role = UserRoles.SURVEYOR
      getParams = getSurveyorParams
    }
    if (roles.includes(UserRoles.GARAGE)) {
      this.role = UserRoles.GARAGE
      getParams = getGarageParams
    }
    if (roles.includes(UserRoles.SPARE_PARTS)) {
      this.role = UserRoles.SPARE_PARTS
      getParams = getSparePartParams
    }
  
    if (getParams) {
      const { columnProps, exportColumns, detailsFields, inputDetailsFields, tableDatas, pTableDatas, currency, listTitle, paymentTitle } = getParams(this.vat, this.numberFormat, this.dateFormat)
      this.columnProps = columnProps
      this.exportColumns = exportColumns
      this.detailsFields = detailsFields
      this.tableDatas = tableDatas
      this.currency = currency
      this.listTitle = listTitle
      this.paymentTitle = paymentTitle
      this.inputDetailsFields = inputDetailsFields
      this.pTableDatas = pTableDatas
    }
    this.paymentService.payments$.subscribe((data) => {
      this.payments = data
      this.filteredPayments = (!!this.filters.status) ? this.filter(data, this.filters.status) : data
    })
    this.paymentService.loadPayments(this.role)
  }
 
  formatValue(key: string, value: any) {
    const dataFormat = this.columnProps.find(({ id }) => id === key)?.dataFormat
    return dataFormat ? dataFormat(value) : value
  }
  formatDatas(datas: Payment[]) { return datas.map((row: Payment) => {
    return Object.keys(row).reduce((acc, key) => {
        const value = row[key as keyof Payment]
        acc[key] = this.formatValue(key, value)
        return acc
      }, {} as Record<string, any>) as Payment
  }) }

  openExportDialog() {
    this.dialog.open(ExportDialogComponent, { data: {
      role: this.role,
      payments: this.formatDatas(this.filteredPayments),
      exportColumns: this.exportColumns
    }})
  }

  toggleSort(column: string) {
    let newDirection: SortDirection = 'asc';

    if (this.activeSort.column === column) 
      newDirection = this.activeSort.direction === 'asc' ? 'desc' : 'asc'

    this.activeSort = { column, direction: newDirection }
    const sort = `${column}-${newDirection}`
    this.filters = { ...this.filters, sort }
    this.paymentService.loadPayments(this.role, { sort })
  }

  handleCurrentStatusChange(status: string) {
    this.currentStatus = status
    if (!!status) {
      this.filters = { ...this.filters, status }
      this.filteredPayments = this.filter(this.payments, status)
    }
    this.currentPage = 1
  }
}
