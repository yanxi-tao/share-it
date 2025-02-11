import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@/lib/devtools/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
  component: () => (
    <main className="h-screen w-screen flex justify-center items-center flex-col">
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </main>
  ),
})
