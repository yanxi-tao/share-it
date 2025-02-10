import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ReactQueryProvider } from '@/lib/providers/react-query'
import { ThemeProvider } from '@/lib/providers/theme-provider'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ReactQueryProvider>
          <RouterProvider router={router} />
        </ReactQueryProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
