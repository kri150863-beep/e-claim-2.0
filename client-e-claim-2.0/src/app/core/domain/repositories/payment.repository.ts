
import { Observable } from "rxjs";
import { Payment } from "../entities/payment.entity";

export interface IPaymentRepository {
  getPayments(role: string): Observable<Payment[]>;
  getPaymentById(id: string): Observable<Payment>;
  exportPayments(startDate: Date, endDate: Date, format: 'csv' | 'excel' | 'pdf'): Observable<Blob>;
}