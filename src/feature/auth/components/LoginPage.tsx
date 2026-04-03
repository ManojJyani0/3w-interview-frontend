/**
 * Login Page Component
 * User login with email and password
 * Mobile-first responsive design
 */

import { useState } from 'react'
import { Link as RouterLink, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material'
import { useLogin } from '../hooks'

export default function LoginPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const loginMutation = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      })
      
      // Redirect to home page on success
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  const isLoading = loginMutation.isPending

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background: 'var(--bg-base)',
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h4"
              className="display-title"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue sharing your stories
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 3,
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            {/* Divider */}
            <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flex: 1, borderTop: '1px solid var(--line)' }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2, fontSize: '0.75rem' }}
              >
                OR
              </Typography>
              <Box sx={{ flex: 1, borderTop: '1px solid var(--line)' }} />
            </Box>

            {/* Signup Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
