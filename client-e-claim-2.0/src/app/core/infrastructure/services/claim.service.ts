import {
  Observable,
  BehaviorSubject,
  map,
  filter,
  take
} from "rxjs";

import { CardItem, Claim } from "../../domain/entities/claim.entity";
import { GetClaimsUseCase } from "../../domain/use-cases/claims/get-claims.use-case";
import { Injectable } from "@angular/core";
import { GetCardUseCase } from "../../domain/use-cases/claims/get-card.use-case";
import { GetClaimByIdUseCase } from "../../domain/use-cases/claims/get-claim-by-id.use-case";
import { GetClaimReportUseCase } from "../../domain/use-cases/claims/get-claim-report.use-case";
import { SaveClaimReportUseCase } from "../../domain/use-cases/claims/save-claim-report.use-case";

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private claimsSubject = new BehaviorSubject<any>({ data: [], total: 0 });
  claims$ = this.claimsSubject.asObservable();
  private claimSubject = new BehaviorSubject<any>({});
  claim$ = this.claimsSubject.asObservable();
  private reportSubject = new BehaviorSubject<any>({});
  report$ = this.reportSubject.asObservable();

  private cardsSubject = new BehaviorSubject<CardItem[]>([]);
  public cards$ = this.cardsSubject.asObservable();

  constructor(
    private getClaimsUseCase: GetClaimsUseCase,
    private getClaimByIdUseCase: GetClaimByIdUseCase,
    private getClaimReportUseCase: GetClaimReportUseCase,
    private getCardUseCase: GetCardUseCase,
    private saveClaimReportUseCase: SaveClaimReportUseCase,
  ) { }

  loadClaims(
    page: number = 1,
    pageSize: number = 10,
    filter?: { status?: string[], sort?: string }
  ): void {
    this.getClaimsUseCase.execute(page, pageSize, filter).subscribe(response => {
      this.claimsSubject.next(response);
    });
  }

  getClaimById({ claimNo = '', email = '' }: { claimNo: string, email: string }): void {
    this.getClaimByIdUseCase.execute({ claimNo, email }).subscribe(response => {
      this.claimsSubject.next(response);
    });
    // return this.claims$.pipe(
    //   map(claims => claims.data.find((claim: any) => claim.id === id)),
    //   filter(claim => !!claim),
    //   take(1)
    // );
  }

  getClaimReport({ claimNo = '', email = '' }: { claimNo: string, email: string }): void {
    this.getClaimReportUseCase.execute({ claimNo, email }).subscribe(response => {
      this.reportSubject.next(response);
    });
  }

  loadCards(email: string): void {
    this.getCardUseCase.execute(email).subscribe({
      next: (cards) => {
        this.cardsSubject.next(cards)
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.cardsSubject.next([]);
      }
    });
  }

  saveClaimReport({claimId, surveyorId, status, currentStep, reportData}: any): Observable<any> {
    return this.saveClaimReportUseCase.execute({claimId, surveyorId, status, currentStep, reportData});
  }
}