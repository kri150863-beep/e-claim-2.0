import { Observable, throwError } from "rxjs";
import { User } from "../../entities/user.entity";

import { AuthCredentials } from "../../entities/auth.entity";
import { AuthRepository } from "../../repositories/auth.repository";
import { Injectable } from "@angular/core";
import { ValidatorsService } from "../../../infrastructure/services/validators.service";
import { ClaimApiService } from "../../../infrastructure/api/claim.api.service";

@Injectable({
  providedIn: 'root' // or specific module
})

export class SaveClaimReportUseCase {
  constructor(private claimRepository: ClaimApiService) { }

  execute({claimId, surveyorId, status, currentStep, reportData}: any): Observable<any> {
    return this.claimRepository.saveClaimReport({claimId, surveyorId, status, currentStep, reportData});
  }
}