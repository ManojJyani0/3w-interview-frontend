/**
 * Auth React Query Hooks
 * Custom hooks for managing authentication state
 */

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from './api'
import type { LoginCredentials, SignupData } from './types'

const QUERY_KEYS = {
  auth: {
    me: ['auth-user'] as const,
    session: ['auth', 'session'] as const,
  },
}

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to handle login
 */
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Cookie is automatically set by the server and included in subsequent requests
      // No need to store token manually
      
      // Update the cache immediately with the logged-in user
      queryClient.setQueryData(QUERY_KEYS.auth.me, data.user)
      
      // Invalidate and refetch current user to ensure freshness
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
    },
  })
}

/**
 * Hook to handle signup
 */
export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: (data) => {
      // Cookie is automatically set by the server and included in subsequent requests
      // No need to store token manually
      
      // Update the cache immediately with the signed-up user
      queryClient.setQueryData(QUERY_KEYS.auth.me, data.user)
      
      // Invalidate and refetch current user to ensure freshness
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
    },
  })
}

/**
 * Hook to handle logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Server clears the cookie
      // No need to manually remove token from localStorage
      
      // Clear all queries
      queryClient.clear()
      
      // Redirect to home or login
      window.location.href = '/'
    },
  })
}

/**
 * Hook to check if user is authenticated
 */
export const useAuth = () => {
  const { data, isLoading, error } = useCurrentUser()
  
  return {
    isAuthenticated: !!data,
    user: data?.user,
    isLoading,
    isError: !!error,
  }
}

/**
 * Helper to check if user is authenticated
 * With cookies, we rely on the server session
 */
export const isAuthenticated = (): boolean => {
  // In a cookie-based auth system, we check if there's an active session
  // This is typically done by trying to fetch the current user
  // For synchronous checks, we can use document.cookie as a basic check
  if (typeof window === 'undefined') return false
  
  // Check if authentication cookie exists (adjust cookie name based on your backend)
  const cookies = document.cookie.split(';')
  return cookies.some(cookie => {
    const [name] = cookie.trim().split('=')
    return name === 'auth_token' || name === 'session' || name === 'accessToken'
  })
}

export { QUERY_KEYS }
