/**
 * Auth Feature Types
 */

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: User
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface AuthResponse {
  user: User
  token?: string
  session?: Session
}
