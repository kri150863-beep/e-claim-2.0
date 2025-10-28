import { faker } from '@faker-js/faker';
import { MockUser } from '../types/user.mock-type';

export function generateMockUser(id: number): MockUser {
  const ROLES = ['admin', 'surveyor', 'garagist', 'spare-parte'];

  return {
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
    role: [faker.helpers.arrayElement(ROLES)]
  };
}

export function generateMockUsers(count = 10): MockUser[] {
  return Array.from({ length: count }, (_, index) => generateMockUser(index + 1));
}