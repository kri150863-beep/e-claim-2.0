import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CombinedMockController } from '../controllers/combined.mock-controller';
import { MockAuthService } from '../services/auth-mock.service';
import { ProfileMockService } from '../services/profile-mock.service';
import { AuthMockController } from '../controllers/auth.mock-controller';
import { ProfileMockController } from '../controllers/profile.mock-controller';
import { MOCK_BACKEND_CONFIG } from '../config/mock-backend.config';

export function provideHttpClientInMemoryWebApi(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Services
    MockAuthService,
    ProfileMockService,

    // Controllers
    AuthMockController,
    ProfileMockController,
    HttpClientInMemoryWebApiModule.forRoot(CombinedMockController, MOCK_BACKEND_CONFIG).providers!
  ]);
}