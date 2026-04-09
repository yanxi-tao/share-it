import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SpaceForm } from '@/components/form/space-form'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Home,
  Bell,
  LogOut,
  Settings,
  Bookmark,
  FolderOpen,
  RefreshCw,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import logo from '/src/assets/share-it_logo.png'

const apiUrl = import.meta.env.VITE_API_URL

interface LeftSidebarProps {
  setShowAddPeopleForm: (spaceId: string, userId: string) => void
  setShowInvites: (userId: string) => void
}

interface Space {
  id: string
  name: string
  description?: string
}

export function LeftSidebar({ setShowAddPeopleForm, setShowInvites }: LeftSidebarProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: spaces, isLoading } = useQuery<Space[]>({
    queryKey: ['spaces', session?.session.userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${session?.session.userId}/spaces`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
    enabled: !!session?.session.userId,
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['spaces'] })
    await queryClient.invalidateQueries({ queryKey: ['feeds'] })
    setTimeout(() => setIsRefreshing(false), 500)
  }

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/' })
        },
      },
    })
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <Sidebar className="border-r bg-card dark:border-[hsl(194,10%,25%)]">
      <SidebarHeader className="border-b px-4 py-4 dark:border-[hsl(194,10%,25%)]">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10 rounded-xl border shadow-sm dark:border-[hsl(194,10%,25%)]">
            <AvatarImage src={logo} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bookmark className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <span className="font-bold text-lg tracking-tight">Share-It</span>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Click to refresh'}
            </p>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <div className="px-3 mb-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 font-medium"
              onClick={() => navigate({ to: '/home' })}
            >
              <Home className="h-5 w-5" />
              All Links
            </Button>
          </div>

          <div className="px-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Spaces
            </span>
            <SpaceForm ownerId={session?.session.userId ?? ''} />
          </div>

          {isLoading && (
            <div className="px-3 space-y-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {spaces && spaces.length > 0 && (
            <div className="px-3 space-y-1 mt-1">
              {spaces.map((space) => (
                <Button
                  key={space.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 h-10 text-sm"
                  onClick={() => navigate({ to: `/space/${space.id}` })}
                >
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{space.name}</span>
                </Button>
              ))}
            </div>
          )}

          {spaces && spaces.length === 0 && !isLoading && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">No spaces yet</p>
              <p className="text-xs text-muted-foreground">
                Create a space to organize your links
              </p>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 dark:border-[hsl(194,10%,25%)]">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={() => setShowInvites(session?.session.userId ?? '')}
          >
            <Bell className="h-4 w-4" />
            Invites
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="text-xs bg-primary/10">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/account' })}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
