import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Footer from '../components/Footer'
import Header from '../components/Header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '@/lib/auth-context'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

// Custom Material UI theme with your color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#4fb8b2', // lagoon
      light: '#60d7cf',
      dark: '#328f97',
    },
    secondary: {
      main: '#2f6a4a', // palm
      light: '#6ec89a',
      dark: '#1f4a32',
    },
    text: {
      primary: '#173a40', // sea-ink
      secondary: '#416166', // sea-ink-soft
    },
    background: {
      default: '#e7f3ec', // bg-base
      paper: 'rgba(255, 255, 255, 0.9)', // surface-strong
    },
  },
  typography: {
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
    h5: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
    h6: {
      fontFamily: '"Fraunces", Georgia, serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: 'Share, discover, and engage with community posts in a lightweight social feed app.',
      },
      {
        name: 'keywords',
        content: 'social, posts, community, blog, like, comment, infinite scroll',
      },
      {
        name: 'theme-color',
        content: '#4fb8b2',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: '3W Full Stack Social Feed',
      },
      {
        property: 'og:description',
        content: 'A modern social feed with likes, comments, and infinite scrolling.',
      },
      {
        property: 'og:image',
        content: '/logo192.png',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
    title: '3W Feed | Full Stack Social',
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            <Header />
            {children}
            <Footer />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html >
  )
}
