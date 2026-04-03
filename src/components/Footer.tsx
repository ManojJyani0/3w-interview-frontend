import { Box, Container, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function Footer() {
  const year = new Date().getFullYear()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        borderTop: '1px solid var(--line)',
        backgroundColor: 'var(--header-bg)',
        px: 2,
        py: 7,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography variant="body2" sx={{ color: 'var(--sea-ink-soft)', m: 0 }}>
          &copy; {year} Your name here. All rights reserved.
        </Typography>
        <Typography
          className="island-kicker"
          sx={{ m: 0, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.69rem', color: 'var(--kicker)' }}
        >
          Built with TanStack Start
        </Typography>
      </Container>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          href="https://x.com/tan_stack"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: 'var(--sea-ink-soft)',
            '&:hover': {
              backgroundColor: 'var(--link-bg-hover)',
              color: 'var(--sea-ink)',
            },
          }}
        >
          <XIcon fontSize="large" />
        </IconButton>
        <IconButton
          href="https://github.com/TanStack"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: 'var(--sea-ink-soft)',
            '&:hover': {
              backgroundColor: 'var(--link-bg-hover)',
              color: 'var(--sea-ink)',
            },
          }}
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  )
}
