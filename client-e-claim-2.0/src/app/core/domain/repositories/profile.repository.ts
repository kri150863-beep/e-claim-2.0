import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AccountInformation,
  NotificationPreferences,
  Profile,
  WebsiteRequest,
  AdministrativeRequest,
  SecurityRequest,
} from "../entities/profile.entity";

@Injectable({
  providedIn: 'root',
})
export abstract class IProfileRepository {
  abstract getProfile(email: string): Observable<Profile>;
  abstract updateProfile(profileData: Partial<AccountInformation>): Observable<Profile>;
  abstract updateNotificationPreferences(preferences: NotificationPreferences): Observable<void>;
  abstract updateWebsite(requestData: WebsiteRequest): Observable<any>;
  abstract updateAdministrativeSettings(settings: AdministrativeRequest): Observable<any>;
  abstract updateSecuritySettings(settings: SecurityRequest): Observable<any>;
}