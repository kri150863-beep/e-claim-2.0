import { Observable, map } from "rxjs";
import { Claim } from "../../entities/claim.entity";
import { ClaimApiService } from "../../../infrastructure/api/claim.api.service";

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GetClaimByIdUseCase {
  constructor(private claimRepository: ClaimApiService) { }

  execute({claimNo, email}:{claimNo: string, email: string}): Observable<any> {
    return this.claimRepository.getClaimById({claimNo, email});
  }
}