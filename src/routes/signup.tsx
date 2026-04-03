import { SignupPage } from '#/feature/auth'
import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuthContext } from '@/lib/auth-context'
import { AuthError } from '#/feature/auth/components/AuthError'

export const Route = createFileRoute('/signup')({
  // 1. Before load redirect (best for performance)
  beforeLoad: async ({ context, location }) => {
    // Check auth status from query cache (synchronous)
    const userQuery = context.queryClient.getQueryData(['auth-user'])
    const isAuthenticated = !!userQuery
    
    if (isAuthenticated) {
      throw redirect({
        to: location.state?.redirectUrl || '/',
        replace: true,
      })
    }
  },
  component: Signup,
  // 2. Error boundary for auth failures
  errorComponent: AuthError,
})

function Signup() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, user } = useAuthContext()
  const redirectAttempted = useRef(false)

  // Redirect to home if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Don't render signup page if already authenticated
  if (isAuthenticated) {
    return null
  }

  return <SignupPage />
}

