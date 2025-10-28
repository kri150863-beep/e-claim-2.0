import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { IProfileRepository } from "../../repositories/profile.repository";
import { AccountInformation, Profile } from "../../entities/profile.entity";

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileUseCase {
  constructor(private profileRepository: IProfileRepository) { }

  execute(profileData: Partial<AccountInformation>): Observable<Profile> {
    // Validate profile data before updating
    if (profileData.email_address && !this.isValidEmail(profileData.email_address)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (profileData?.phone_number && !this.isValidPhoneNumber(profileData.phone_number)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    if (profileData?.website && !this.isValidWebsite(profileData.website)) {
      return throwError(() => new Error('Invalid website URL format'));
    }

    return this.profileRepository.updateProfile(profileData);
  }

  private isValidEmail(email: string): boolean {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Phone validation logic - supports international formats
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidWebsite(website: string): boolean {
    // Website URL validation
    return /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([\/?#][\w-./?%=&]*)?$/.test(website);
  }
}