/**
 * Signup Page Component
 * User registration with name, email and password
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
  Person as PersonIcon,
} from '@mui/icons-material'
import { useSignup } from '../hooks'

export default function SignupPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const signupMutation = useSignup()

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

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    // Name validation
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (formData.password.length > 50) {
      setError('Password must be less than 50 characters')
      return
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain uppercase, lowercase, and numbers')
      return
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await signupMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      
      // Redirect to home page on success
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  const isLoading = signupMutation.isPending

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
          maxWidth: 450,
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join our community and start sharing your stories
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
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
              helperText="Min 8 characters with uppercase, lowercase & numbers"
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                mt: 3,
                mb: 2,
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
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

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>

            {/* Terms Notice */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                By creating an account, you agree to our{' '}
                <Link underline="hover" href="#" sx={{ color: 'primary.main' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link underline="hover" href="#" sx={{ color: 'primary.main' }}>
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
