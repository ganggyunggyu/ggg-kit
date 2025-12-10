export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 64;

export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 20;

export const MIN_USERNAME_LENGTH = 4;
export const MAX_USERNAME_LENGTH = 30;

export const USER_ROLES = ['ADMIN', 'MANAGER', 'USER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUS = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'] as const;
export type UserStatus = (typeof USER_STATUS)[number];
