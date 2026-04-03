import { useEffect, useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialModes = getInitialMode()
    setMode(initialModes)
    applyThemeMode(initialModes)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />
      case 'dark':
        return <DarkModeIcon />
      case 'auto':
        return <BrightnessAutoIcon />
    }
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMode}
        aria-label={label}
        sx={{
          border: '1px solid var(--chip-line)',
          backgroundColor: 'var(--chip-bg)',
          color: 'var(--sea-ink)',
          fontWeight: 600,
          boxShadow: '0 8px 22px rgba(30,90,72,0.08)',
          '&:hover': {
            backgroundColor: 'var(--link-bg-hover)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 180ms ease',
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  )
}
