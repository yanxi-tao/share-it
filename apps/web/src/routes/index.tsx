import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/`)
      return response.text()
    },
  })

  return (
    <body className="flex min-h-screen flex-col overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent bg-background">
      <div className="relative flex flex-col item-center gap-8">
        <div className="relative flex flex-col w-screen my-2 p-5">
          <div className="relative flex flex-row p-3 space-x-4 bg-muted text-muted-foreground rounded-xl shadow-md">
            <div className="relative flex">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="relative flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col w-screen my-2 p-8 bg-background text-foreground">
          <h1 className="flex my-10 text-center text-6xl font-extrabold tracking-tight">
            Share and organize links effortlessly on a single, collaborative hub
            with Share-It.
          </h1>
          <Button size="sm" variant="outline">
            <Link to="/auth/signup">Sign up Here</Link>
          </Button>
        </div>
      </div>
    </body>
  )
}
