import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/_app/about')({
  component: About,
})

function About() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent bg-background">
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
  )
}
