// lib/auth/route-guard.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReactNode } from 'react'

export function withAuthGuard(Component: React.ComponentType) {
  return {
    beforeLoad: async ({ context, location }) => {
      const { isAuthenticated } = context.auth
      
      if (!isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
          replace: true,
        })
      }
    },
    component: Component,
  }
}

// Usage in protected routes:
// export const Route = createFileRoute('/dashboard')(withAuthGuard(DashboardPage))