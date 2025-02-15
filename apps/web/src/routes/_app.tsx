import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LeftSidebar } from '@/components/shared/left-sidebar'

export const Route = createFileRoute('/_app')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <SidebarProvider>
      <LeftSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
