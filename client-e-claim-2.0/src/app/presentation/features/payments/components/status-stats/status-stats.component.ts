import { Component, Output, EventEmitter, computed, input, Input } from '@angular/core';
import { Payment } from '../../../../../core/domain/entities/payment.entity';
import { Stat } from './status-stats.types';
import { CommonModule } from '@angular/common';
import { UserRole, UserRoles } from '../../../../../core/shared/constants/roles.const';
import { StatusCardComponent } from '../../../../shared/ui/card/status-card/status-card.component';
import { PaymentStatus, Status } from '../../../../../core/shared/constants/payment-status.const';

@Component({
  selector: 'status-stats',
  standalone: true,
  imports: [ CommonModule, StatusCardComponent ],
  templateUrl: './status-stats.component.html',
  styleUrl: './status-stats.component.scss'
})
export class StatusStatsComponent {
  payments = input<Payment[]>([])
  currentStatus= input<string | null>(null)
  @Input() currency!: string
  @Input() role!: string
  @Input() numberFormat!: (value: number) => string
  @Output() change = new EventEmitter<string>()

  order = [ PaymentStatus.NEW, PaymentStatus.SUBMITTED, PaymentStatus.UNDER_REVIEW, PaymentStatus.APPROVED, PaymentStatus.PAID]

  stats = computed(() => {
    const payments = this.payments()

    const values: Stat[] = []
    payments.forEach(({ status, claimAmount=0, repairItems=[], parts= [] }) => {
      const index = values.findIndex(stat => stat.name === status)
      if (index >= 0) {
        values[index].count++
        if (this.role === UserRoles.SURVEYOR) values[index].amount += claimAmount
        if (this.role === UserRoles.GARAGE) repairItems.map((({ amount }) => values[index].amount += amount ))
        if (this.role === UserRoles.SPARE_PARTS) parts.map(({ cost }) => values[index].amount += cost)
      } else {
        if (this.role === UserRoles.SURVEYOR) values.push({ name: status, count: 1, amount: claimAmount })
        if (this.role === UserRoles.GARAGE) {
          let itemAmout = 0
          repairItems.map((({ amount }) => itemAmout += amount ))
          values.push({ name: status, count: 1, amount: itemAmout })
        }
        if (this.role === UserRoles.SPARE_PARTS) {
          let itemAmout = 0
          parts.map((({ cost }) => itemAmout += cost ))
          values.push({ name: status, count: 1, amount: itemAmout })
        }
      }
    })

    return values.sort((a, b) => this.order.indexOf(a.name as Status) - this.order.indexOf(b.name as Status))
  })

  getAmount(amount: number) {
    // if ([UserRoles.SPARE_PARTS].includes(this.role as typeof UserRoles.SPARE_PARTS)) return null
    return this.numberFormat(amount)
  }
}
