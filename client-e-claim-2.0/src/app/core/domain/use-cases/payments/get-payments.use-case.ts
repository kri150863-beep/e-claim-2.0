import { Observable, map } from "rxjs";
import { Payment } from "../../entities/payment.entity";
import { PaymentApiService } from "../../../infrastructure/api/payment.api.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GetPaymentsUseCase {
    constructor(private paymentRepository: PaymentApiService) { }

    execute(role: string, filter?: { status?: string, sort?: string }): Observable<Payment[]> {
        return this.paymentRepository.getPayments(role).pipe(
            map(payments => {
                if (filter?.status)
                    payments = payments.filter(payment => payment.status === filter.status)
                
                if (filter?.sort)
                    payments = this.sortPayments(payments, filter.sort)
            
                return payments
            })
        )
    }

    private sortPayments(payments: Payment[], sortBy: string): Payment[] {
        switch (sortBy) {
            case 'createdAt-asc':
            return [...payments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            case 'createdAt-desc':
            return [...payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            case 'submitDate-asc':
            return [...payments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            case 'submitDate-desc':
            return [...payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            case 'paymentDate-asc':
            return [...payments].sort((a, b) => {
                const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0
                const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0
                return dateA - dateB
            })

            case 'paymentDate-desc':
            return [...payments].sort((a, b) => {
                const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0
                const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0
                return dateB - dateA
            })
            
            default:
                return payments;
        }
    }
}