import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { IProfileRepository } from "../../repositories/profile.repository";
import { SecurityRequest } from "../../entities/profile.entity";
import { ValidatorsService } from "../../../infrastructure/services/validators.service";

@Injectable({
  providedIn: 'root'
})
export class UpdateSecurityUseCase {
  constructor(private profileRepository: IProfileRepository, private validatorsService: ValidatorsService) { }

  execute(req: SecurityRequest): Observable<any> {
    // Validate profile data before updating
    return this.profileRepository.updateSecuritySettings(req);
  }
}