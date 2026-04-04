# 3W Full Stack Social Feed

A modern, responsive social media feed application built with React, TypeScript, and TanStack Router. Features infinite scrolling, real-time like/comment interactions, and seamless user authentication.

## 🚀 Features

- **Infinite Scroll Feed**: Load posts dynamically as you scroll
- **Real-time Interactions**: Like/unlike posts and add comments with immediate UI updates
- **User Authentication**: Secure signup/login with Better Auth
- **Responsive Design**: Mobile-first design with Material-UI
- **SEO Optimized**: Meta tags, Open Graph, and proper head management
- **Type-Safe**: Full TypeScript implementation
- **Modern Stack**: React 19, TanStack Query, TanStack Router

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
- **UI**: Material-UI (MUI), Emotion
- **Build**: Vite
- **Auth**: Better Auth
- **Deployment**: Netlify/Vercel ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManojJyani0/3w-interview-frontend.git
   cd 3w-interview-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file with:
   ```env
   VITE_API_BASE_URL=https://your-backend-api-url
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## 🏗️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Testing
```bash
npm run test
```

### Linting & Formatting
```bash
npm run lint
npm run format
npm run check
```

## 🚀 Deployment

### Netlify
- Connect your GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect configured in `netlify.toml`

### Vercel
- Connect your GitHub repo
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing configured in `vercel.json`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── feature/            # Feature-based modules
│   ├── auth/          # Authentication
│   └── post/          # Post management
├── integrations/       # Third-party integrations
├── lib/               # Utilities and providers
├── routes/            # TanStack Router routes
└── styles.css         # Global styles
```

## 🔧 Configuration

- **Vite**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **ESLint**: `eslint.config.js`
- **Prettier**: `prettier.config.js`
- **Netlify**: `netlify.toml`
- **Vercel**: `vercel.json`

## 🌐 API Integration

This frontend connects to a backend API for:
- User authentication
- Post CRUD operations
- Like/unlike functionality
- Comment management

Backend repository: [3W Backend](https://github.com/ManojJyani0/3w-interview-backend)

## 📱 Features in Detail

### Infinite Scroll
- Uses `IntersectionObserver` for performance
- Loads posts in pages of 10
- Shows loading indicator at bottom

### Real-time Updates
- Optimistic UI updates for likes/comments
- React Query cache invalidation
- Immediate feedback without page refresh

### Authentication Flow
- Protected routes with redirects
- Persistent sessions
- Secure logout

### SEO & Performance
- Dynamic meta tags per route
- Open Graph tags for social sharing
- Optimized bundle splitting
- Progressive Web App ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is part of a technical interview assignment.

---

Built with ❤️ using TanStack Start


## Setting up Better Auth

1. Generate and set the `BETTER_AUTH_SECRET` environment variable in your `.env.local`:

   ```bash
   pnpm dlx @better-auth/cli secret
   ```

2. Visit the [Better Auth documentation](https://www.better-auth.com) to unlock the full potential of authentication in your app.

### Adding a Database (Optional)

Better Auth can work in stateless mode, but to persist user data, add a database:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // ... rest of config
});
```

Then run migrations:

```bash
pnpm dlx @better-auth/cli migrate
```



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
