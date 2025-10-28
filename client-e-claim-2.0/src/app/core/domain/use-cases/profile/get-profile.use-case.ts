import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IProfileRepository } from "../../repositories/profile.repository";
import { User } from "../../entities/user.entity";

@Injectable({
  providedIn: 'root'
})
export class GetProfileUseCase {
  constructor(private profileRepository: IProfileRepository) { }

  execute(email: string = ''): Observable<any> {
    return this.profileRepository.getProfile(email);
  }
}
