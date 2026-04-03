import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material'
import PostList from '../feature/post/components/PostList'
import { useAuthContext } from '@/lib/auth-context'

export const Route = createFileRoute('/')({
  // Redirect unauthenticated users to signup
  beforeLoad: async ({ context, location }) => {
    // Check auth status from query cache (synchronous)
    const userQuery = context.queryClient.getQueryData(['auth-user'])
    const isAuthenticated = !!userQuery
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/signup',
        replace: true,
        state: {
          redirectUrl: location.href || '/',
        },
      })
    }
  },
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuthContext()

  // Backup: Redirect if somehow beforeLoad didn't catch it
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/signup', replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <Box
      className="page-wrap"
      sx={{
        px: { xs: 1, sm: 2 },
        pb: 4,
        pt: { xs: 5, sm: 7 },
      }}
    >

      {/* Posts Feed */}
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 0 } }}>
        <PostList />
      </Container>
    </Box>
  )
}
