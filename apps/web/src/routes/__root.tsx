import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@/lib/devtools/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModeToggle } from '@/components/shared/mode-toggle'

export const Route = createRootRoute({
  component: () => (
    <main className="h-screen w-screen flex justify-center items-center flex-col">
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <ModeToggle />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </main>
  ),
})
