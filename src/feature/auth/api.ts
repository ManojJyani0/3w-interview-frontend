/**
 * Auth API Functions
 * Authentication-related API calls using Better Auth client
 * Follows backend-api-integration.md guidelines
 */


import { authClient } from '#/lib/auth-client'
import type { User, LoginCredentials, SignupData, Session } from './types'

/**
 * Login user with email and password
 * Uses Better Auth client: signIn.email()
 */
export const login = async (credentials: LoginCredentials) => {
  const result = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
  })
  
  if (result.error) {
    throw new Error(result.error.message || 'Login failed')
  }
  
  return {
    user: result.data?.user as User,
    token: undefined, // Cookie-based, no token needed
  }
}

/**
 * Register a new user
 * Uses Better Auth client: signUp.email()
 */
export const signup = async (data: SignupData) => {
  const result = await authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
  })
  
  if (result.error) {
    throw new Error(result.error.message || 'Signup failed')
  }
  
  return {
    user: result.data?.user as User,
    token: undefined, // Cookie-based, no token needed
  }
}

/**
 * Logout current user
 * Uses Better Auth client: signOut()
 */
export const logout = async () => {
  await authClient.signOut()
}

/**
 * Get current user session
 * Uses Better Auth client: getSession()
 */
export const getCurrentUser = async () => {
  const result = await authClient.getSession()
  
  if (result.error || !result.data) {
    return { user: null }
  }
  
  return {
    user: result.data.user as User,
  }
}

// Note: Better Auth handles these operations internally
// - Token refresh is automatic with cookies
// - Password reset can be implemented via Better Auth plugins if needed
