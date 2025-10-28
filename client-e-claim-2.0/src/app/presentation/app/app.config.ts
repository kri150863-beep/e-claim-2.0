import { ApplicationConfig, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthRepository } from '../../core/domain/repositories/auth.repository';
import { AuthApiService } from '../../core/infrastructure/api/auth.api.service';
import { IProfileRepository } from '../../core/domain/repositories/profile.repository';
import { ProfileApiService } from '../../core/infrastructure/api/profile.api.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { authInterceptor } from '../../core/infrastructure/interceptors/auth.interceptor';
import { mockApiInterceptor } from '../../core/infrastructure/mock-backend/interceptors/api-mock.interceptor';
import { provideMockBackend } from '../../core/infrastructure/mock-backend/providers/backend-mock.provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MockInitService } from '../../core/infrastructure/mock-backend/services/init-mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        ...(environment.useMockBackend ? [mockApiInterceptor] : []),
      ])
    ),
    ...(environment.useMockBackend ? [provideMockBackend()] : []),
     ...(environment.useMockBackend ? [
      provideMockBackend(),
      {
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => inject(MockInitService).initializeAllMockData(),
        multi: true
      }
    ] : []),
    { provide: AuthRepository, useClass: AuthApiService },
    { provide: IProfileRepository, useClass: ProfileApiService },
    importProvidersFrom(
      BrowserAnimationsModule, // Required for animations
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
      }),
    ),
  ],
};
