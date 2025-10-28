import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { IProfileRepository } from "../../repositories/profile.repository";

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  claimUpdates: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateNotificationPreferencesUseCase {
  constructor(private profileRepository: IProfileRepository) { }

  execute(preferences: NotificationPreferences): Observable<void> {
    // Validate preferences
    if (!this.isValidPreferences(preferences)) {
      return throwError(() => new Error('Invalid notification preferences'));
    }

    return this.profileRepository.updateNotificationPreferences(preferences);
  }

  private isValidPreferences(preferences: NotificationPreferences): boolean {
    // Ensure at least one notification method is enabled for critical updates
    const hasCriticalNotification = preferences.emailNotifications || 
                                   preferences.smsNotifications || 
                                   preferences.pushNotifications;

    return hasCriticalNotification;
  }
}
