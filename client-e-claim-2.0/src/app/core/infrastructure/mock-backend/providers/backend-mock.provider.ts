import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { MockAuthService } from '../services/auth-mock.service';
import { AuthMockController } from '../controllers/auth.mock-controller';
import { provideHttpClientInMemoryWebApi } from './http-client-in-memory-web-api-provider';
import { ProfileMockController } from '../controllers/profile.mock-controller';

export function provideMockBackend(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClientInMemoryWebApi(),
    MockAuthService,
    AuthMockController,
    ProfileMockController
  ]);
}