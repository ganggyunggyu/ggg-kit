import type { UserRole, UserStatus } from '../constants/user';

export interface User {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  nickname: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
