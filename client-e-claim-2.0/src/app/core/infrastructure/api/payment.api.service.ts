import { Injectable } from "@angular/core";
import { MOCK_SURVEYOR_PAYMENT, MOCK_GARAGE_PAYMENT, MOCK_SPARE_PART_PAYMENT, MOCK_CAR_RENTAL_PAYMENT } from "../mock-backend/data/payments.mock-data";
import { IPaymentRepository } from "../../domain/repositories/payment.repository";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Payment } from "../../domain/entities/payment.entity";
import { UserRoles } from "../../shared/constants/roles.const";

@Injectable({
    providedIn: 'root'
})
export class PaymentApiService implements IPaymentRepository {
    private readonly apiUrl = "";
  
    constructor(private http: HttpClient) {
    }
  
    getPayments(role: string): Observable<Payment[]> {
      if (role === UserRoles.SURVEYOR) return of(MOCK_SURVEYOR_PAYMENT)
      if (role === UserRoles.GARAGE) return of(MOCK_GARAGE_PAYMENT)
      if (role === UserRoles.SPARE_PARTS) return of(MOCK_SPARE_PART_PAYMENT)
      return of([])
      return this.http.get<Payment[]>(`${this.apiUrl}/payments`)
    }
  
    getPaymentById(id: string): Observable<Payment> {
      return this.http.get<Payment>(`${this.apiUrl}/payments/${id}`);
    }

    exportPayments(startDate: Date, endDate: Date, format: 'csv' | 'excel' | 'pdf'): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/payments/${startDate}/${endDate}/${format}/download`, {
        responseType: 'blob'
      });
    }
  }