// feature/auth/AuthProvider.tsx
import { createContext, useEffect, useState, useCallback, useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { User } from 'better-auth'
import { authClient } from '#/lib/auth-client';

type Credentials = { email: string; password: string }
interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  error: Error | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  })
  
  const navigate = useNavigate()

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const session = await authClient.getSession()
      setState({
        isAuthenticated: !!session,
        isLoading: false,
        user: session?.data?.user || null,
        error: null,
      })
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error as Error,
      })
    }
  }, [])

  useEffect(() => {
    checkAuth()
    
    // Optional: Set up interval to refresh token
    const interval = setInterval(checkAuth, 5 * 60 * 1000) // every 5 minutes
    return () => clearInterval(interval)
  }, [checkAuth])

  const login = useCallback(async (credentials: Credentials) => {
    try {
      const user = await authClient.signIn.email(credentials)
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: user?.data?.user || null,
        error: null,
      })
      navigate({ to: '/' })
    } catch (error) {
      throw error
    }
  }, [navigate])

  const logout = useCallback(async () => {
    await authClient.signOut()
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    })
    navigate({ to: '/login' })
  }, [navigate])

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      refetch: checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
