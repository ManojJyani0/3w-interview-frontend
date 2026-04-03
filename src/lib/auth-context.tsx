/**
 * Auth Context & Provider
 * Centralized authentication state management
 * Works with Better Auth for cookie-based authentication
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser } from '../feature/auth/api'
import type { User } from '../feature/auth/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [isReady, setIsReady] = useState(false)

  // Use React Query to fetch and cache user session
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const result = await getCurrentUser()
        return result.user || null
      } catch (error) {
        // If request fails (401, etc.), treat as not authenticated
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
  })

  // Mark auth as ready after initial load
  useEffect(() => {
    if (!isLoading) {
      setIsReady(true)
    }
  }, [isLoading])

  // Refresh authentication (useful after login/logout)
  const refreshAuth = async () => {
    await refetch()
  }

  // Listen for Better Auth events (if available)
  useEffect(() => {
    // Optional: Listen for storage events for cross-tab auth sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'better-auth.session-token') {
        refreshAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = {
    user: data || null,
    isAuthenticated: !!data,
    isLoading: !isReady,
    error: error instanceof Error ? error.message : null,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 * Must be used within AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  
  return context
}
