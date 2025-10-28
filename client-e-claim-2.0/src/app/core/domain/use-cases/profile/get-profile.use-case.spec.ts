import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GetProfileUseCase } from './get-profile.use-case';
import { IProfileRepository } from '../../repositories/profile.repository';
import { User } from '../../entities/user.entity';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;
  let profileRepository: jasmine.SpyObj<IProfileRepository>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    roles: ['user'],
    profile: {
      businessName: 'Test Business',
      businessRegistrationNumber: 'BRN123',
      businessAddress: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      phoneNumber: '+1234567890',
      website: 'https://test.com'
    }
  };

  beforeEach(() => {
    const profileRepositorySpy = jasmine.createSpyObj('IProfileRepository', ['getProfile']);

    TestBed.configureTestingModule({
      providers: [
        GetProfileUseCase,
        { provide: IProfileRepository, useValue: profileRepositorySpy }
      ]
    });

    useCase = TestBed.inject(GetProfileUseCase);
    profileRepository = TestBed.inject(IProfileRepository) as jasmine.SpyObj<IProfileRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should get profile from repository', () => {
    profileRepository.getProfile.and.returnValue(of(mockUser));

    useCase.execute().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    expect(profileRepository.getProfile).toHaveBeenCalled();
  });
});
