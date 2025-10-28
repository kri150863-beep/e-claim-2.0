import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { IProfileRepository } from "../../repositories/profile.repository";
import { WebsiteRequest } from "../../entities/profile.entity";
import { ValidatorsService } from "../../../infrastructure/services/validators.service";

@Injectable({
  providedIn: 'root',
})
export class UpdateWebsiteUseCase {
  constructor(private profileRepository: IProfileRepository, private validatorsService: ValidatorsService) { }

  execute(req: WebsiteRequest): Observable<any> {
    // Validate profile data before updating
    if (!this.validatorsService.isValidUrl(req.newWebsite)) {
      return throwError(() => new Error('Invalid website URL format'));
    }

    return this.profileRepository.updateWebsite(req);
  }
}