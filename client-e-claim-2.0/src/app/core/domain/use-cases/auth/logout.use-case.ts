import { Observable } from "rxjs";

import { AuthRepository } from "../../repositories/auth.repository";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root' // or specific module
})

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(refresToken: any): Observable<any> {
    return this.authRepository.logout(refresToken);
  }

}