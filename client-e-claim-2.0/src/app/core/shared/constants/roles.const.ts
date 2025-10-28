export const UserRoles = {
  SURVEYOR: 'surveyor',
  GARAGE: 'garage',
  SPARE_PARTS: 'spare_part',
  ADMIN: "admin"
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];