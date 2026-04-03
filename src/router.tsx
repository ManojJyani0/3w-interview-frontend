import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import type { ReactNode } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import TanstackQueryProvider, {
  getContext,
} from './integrations/tanstack-query/root-provider'
import { AuthProvider, useAuthContext } from './lib/auth-context'

// Enhanced router context with auth
class RouterContext {
  queryClient: QueryClient
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
  }
  
  // Get current user from cache (synchronous)
  getUser() {
    const userQuery = this.queryClient.getQueryData(['auth-user'])
    return userQuery || null
  }
  
  // Check if user is authenticated (synchronous)
  isAuthenticated() {
    const user = this.getUser()
    return !!user
  }
}

export function getRouter() {
  const queryClient = getContext().queryClient
  const routerContext = new RouterContext(queryClient)

  const router = createTanStackRouter({
    routeTree,
    context: {
      ...routerContext,
      queryClient,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
