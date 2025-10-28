import {
  Observable,
  BehaviorSubject,
  map,
  filter,
  take
} from "rxjs";
import { Payment } from "../../domain/entities/payment.entity";
import { GetPaymentsUseCase } from "../../domain/use-cases/payments/get-payments.use-case";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentsSubject = new BehaviorSubject<Payment[]>([])
  payments$ = this.paymentsSubject.asObservable()

  constructor(private getPaymentsUseCase: GetPaymentsUseCase) { }

  loadPayments(role: string, filter?: { status?: string, sort?: string }): void {
    this.getPaymentsUseCase.execute(role, filter).subscribe(payments => {
      this.paymentsSubject.next(payments)
    })
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.payments$.pipe(
      map(payments => payments.find(payment => payment.id === id)),
      filter(payment => !!payment),
      take(1)
    )
  }
}