import { Observable } from "rxjs";
import { CardItem, Claim } from "../entities/claim.entity";


export interface IClaimRepository {

  // getClaims(): Observable<Claim[]>
  getClaims(page?: number, pageSize?: number, filters?: any): Observable<{ data: Claim[], total_claims: number }>;

  getClaimById({claimNo, email}: {claimNo: string, email: string}): Observable<any>
  getClaimReport({claimNo, email}: {claimNo: string, email: string}): Observable<any>

  saveClaimReport(claimId: string, reportData: any): Observable<Claim>

  updateClaimReport(claimId: string, reportData: any): Observable<Claim>

  submitClaimReport(claimId: string): Observable<Claim>

  returnClaim(claimId: string): Observable<void>

  downloadClaimReport(claimId: string): Observable<Blob>

  getClaimCards(email: string): Observable<any>;
}