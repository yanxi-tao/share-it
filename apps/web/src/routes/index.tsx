import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { cn } from '@/lib/utils'
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
import { buttonVariants } from '@/components/ui/button'

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

  //drop down components
  const components: { title: string; href: string }[] = [
    {
      title: 'Home',
      href: '/home',
    },
    {
      title: 'Profile',
      href: '/docs/primitives/hover-card',
    },
    {
      title: 'Settings',
      href: '/docs/primitives/progress',
    },
    {
      title: 'Logout',
      href: '/auth/signin',
    },
  ]

  return (
    <>
      <div className="fixed top-0 flex-row flew-grow justify-between items-center p-4 bg-background text-foreground">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[150px] gap-3 p-4">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    ></ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/auth/signup">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex justify-center items-center flex-grow flex-col space-y-5 p-4 mx-auto max-w-xxl px-4 bg-background text-foreground">
        <h1 className="flex scroll-m-20 text-4xl font-extrabold tracking-tight text-center py-4 px-50">
          Share and organize links effortlessly on a single, collaborative hub
          with Share-It.
        </h1>
        <Button size="xl" variant="outline">
          <Link to="/auth/signup">Sign up Here</Link>
        </Button>
      </div>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
