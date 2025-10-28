import { Observable } from "rxjs";
import { IClaimRepository } from "../../repositories/claim.repository";
import { CardItem } from "../../entities/claim.entity";
import { Injectable } from "@angular/core";
import { ClaimApiService } from "../../../infrastructure/api/claim.api.service";

@Injectable({
  providedIn: 'root'
})
export class GetCardUseCase {
  constructor(private claimRepository: ClaimApiService) {}

  execute(userId: string): Observable<any> {
    return this.claimRepository.getClaimCards(userId);
  }
}