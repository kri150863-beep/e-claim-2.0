import { Observable, map } from "rxjs";
import { Claim } from "../../entities/claim.entity";
import { ClaimApiService } from "../../../infrastructure/api/claim.api.service";

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GetClaimsUseCase {
  constructor(private claimRepository: ClaimApiService) { }

  execute(page: number = 1, pageSize: number = 10, filter?: { status?: string[], sort?: string }): Observable<{ data: Claim[], total_claims: number }> {
    return this.claimRepository.getClaims(page, pageSize, filter);
  }
}