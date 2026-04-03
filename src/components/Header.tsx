import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useLogout } from '../feature/auth'
import { useAuthContext } from '@/lib/auth-context'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isAuthenticated, user, isLoading } = useAuthContext()
  const logout = useLogout()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout.mutateAsync()
    handleMenuClose()
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar
        sx={{
          flexWrap: 'wrap',
          gap: 1,
          py: 1.5,
          px: 2,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Chip
            component={Link}
            to="/"
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    width: 8,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(90deg, #56c6be, #7ed3bf)',
                  }}
                />
                3W – Full Stack
              </Box>
            }
            sx={{
              backgroundColor: 'var(--chip-bg)',
              borderColor: 'var(--chip-line)',
              color: 'var(--sea-ink)',
              fontWeight: 600,
              fontSize: '0.875rem',
              px: 2,
              height: 36,
              boxShadow: '0 8px 24px rgba(30,90,72,0.08)',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'var(--link-bg-hover)',
              },
            }}
          />
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>        
          
          {/* Auth Buttons */}
          {isLoading ? (
            // Show loading indicator
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid var(--line)',
                borderTopColor: 'var(--primary)',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          ) : isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen} size="medium">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.name?.charAt(0) || <AccountCircleIcon />}
                </Avatar>
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Button>
            </>
          )}
          
          <ThemeToggle />
        </Box>

        <Box
          sx={{
            order: { xs: 3, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mt: { xs: 1, sm: 0 },
          }}
        >
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{
              color: 'var(--sea-ink-soft)',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                color: 'var(--sea-ink)',
              },
            }}
          >
            Home
          </Button>        
        </Box>
      </Toolbar>
    </AppBar>
  )
}
