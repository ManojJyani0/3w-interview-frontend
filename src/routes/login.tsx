// routes/login.tsx
import { LoginPage } from '#/feature/auth'
import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuthContext } from '@/lib/auth-context'
import { AuthError } from '#/feature/auth/components/AuthError'

export const Route = createFileRoute('/login')({
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
  component: Login,
  // 2. Error boundary for auth failures
  errorComponent: AuthError,
})

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, user } = useAuthContext()
  const redirectAttempted = useRef(false)

  // 3. Handle post-auth redirect with proper cleanup
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectAttempted.current) {
      redirectAttempted.current = true
      
      // Get return URL from location state
      const returnUrl = (navigate as any).state?.returnUrl || '/'
      
      navigate({
        to: returnUrl,
        replace: true,
        // Optional: preserve some state
        state: { fromLogin: true, userId: user?.id },
      })
    }
  }, [isAuthenticated, isLoading, navigate, user])

  // 4. Show skeleton loading (better UX)
  if (isLoading) {
    return <AuthLoadingSkeleton />
  }

  // 5. Return null to prevent flash (already handled by befauthoreLoad)
  if (isAuthenticated) {
    return null
  }

  return <LoginPage />
}

// Reusable loading component
function AuthLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 animate-pulse">Checking authentication...</p>
      </div>
    </div>
  )
}

