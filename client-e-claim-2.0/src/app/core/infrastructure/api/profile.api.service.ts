import { Observable, tap, map, catchError, throwError } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AccountInformation, Profile, WebsiteRequest } from "../../domain/entities/profile.entity";
import { IProfileRepository } from "../../domain/repositories/profile.repository";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService implements IProfileRepository {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(email: string): Observable<any> {
    this.http.get<any>(`${this.apiUrl}/profile?email=${email}`).subscribe({
      next: (res) => {},
      error: (error) => {
        console.error('ProfileApiService: HTTP error:', error);
      }
    });

    return this.http.get<any>(`${this.apiUrl}/profile?email=${email}`).pipe(
      // tap(rawResponse => {}),
      map(response => {
        // Handle different response structures
        if (response && response?.status === 'success' && response?.data) {
          return response.data;
        } else if (response && response?.id) {
          return response;
        } else if (Array.isArray(response) && response.length > 0) {
          return response[0];
        } else {
          return response;
        }
      }),
      // tap(profile => {
      // }),
      catchError(error => {
        console.error('ProfileApiService: HTTP error:', error);
        console.error('ProfileApiService: Error type:', typeof error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(profileData: Partial<AccountInformation>): Observable<Profile> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData).pipe(
      map(response => {
        // Handle mock API response structure
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      }),
      // tap(updatedProfile => {
      //   console.log('Profile updated:', updatedProfile);
      // })
    );
  }

  updateNotificationPreferences(preferences: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/notifications`, preferences).pipe(
      // tap(() => {
      //   console.log('Notification preferences updated:', preferences);
      // })
    );
  }

  updateWebsite(req: WebsiteRequest): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile/website`, req);
  }

  updateAdministrativeSettings(settings: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile/administrative`, settings);
  }

  updateSecuritySettings(settings: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile/security`, settings);
  }
}
