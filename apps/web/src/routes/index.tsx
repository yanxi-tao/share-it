import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import logo from '/src/assets/share-it_logo.png'
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { useTheme } from '@/lib/providers/theme-provider'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'About Us',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Donate',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Github',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
]

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { setTheme } = useTheme()

  const [menuOpen, setMenuOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/`)
      return response.text()
    },
  })
  return (
    <div className="flex min-h-screen flex-col overflow-hidden overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-accent bg-background">
      <div className="relative flex flex-col item-center gap-6">
        <div className="relative flex flex-col w-screen my-2 px-10 py-5">
          <div className="relative flex flex-row p-3 space-x-4 justify-between bg-muted text-muted-foreground rounded-xl shadow-md">
            <div className="relative flex items-center gap-2">
              <div className="relative flex">
                <Avatar>
                  <AvatarImage src={logo} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="relative flex">
                <h1 className="text-xl tracking-regular">Share-It</h1>
              </div>
            </div>

            {/* Hamburger menu for small screens */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className="hidden md:flex gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Getting started
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                shadcn/ui
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Beautifully designed components built with Radix
                                UI and Tailwind CSS.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/docs" title="Introduction">
                          Re-usable components built using Radix UI and Tailwind
                          CSS.
                        </ListItem>
                        <ListItem
                          href="/docs/installation"
                          title="Installation"
                        >
                          How to install dependencies and structure your app.
                        </ListItem>
                        <ListItem
                          href="/docs/primitives/typography"
                          title="Typography"
                        >
                          Styles for headings, paragraphs, lists...etc
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {components.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/auth/signup">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Documentation
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="hidden md:flex gap-2">
              <Toggle
                onPressedChange={(pressed) =>
                  setTheme(pressed ? 'dark' : 'light')
                }
                className="rounded-full"
              >
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
              </Toggle>
              <Link to="/auth/signup">
                <Button variant={'outline'}>Sign up</Button>
              </Link>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden flex flex-col items-center gap-4 mt-4 p-4 bg-muted text-muted-foreground rounded-xl shadow-md">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col gap-3">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Getting started
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-full">
                        <ListItem href="/docs" title="Introduction">
                          Re-usable components built using Radix UI and Tailwind
                          CSS.
                        </ListItem>
                        <ListItem
                          href="/docs/installation"
                          title="Installation"
                        >
                          How to install dependencies and structure your app.
                        </ListItem>
                        <ListItem
                          href="/docs/primitives/typography"
                          title="Typography"
                        >
                          Styles for headings, paragraphs, lists...etc
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-full">
                        {components.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/auth/signup">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Documentation
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link to="/auth/signup">
                <Button variant={'outline'}>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="relative flex flex-col w-screen my-2 p-8 bg-background text-foreground">
          <h1 className="flex my-10 text-center text-6xl font-extrabold tracking-tight">
            Share and organize links effortlessly on a single, collaborative hub
            with Share-It.
          </h1>
        </div>
        <div className="relative flex flex-col w-screen my-1 p-2 items-center bg-background text-foreground">
          <Link to="/auth/signup">
            <Button variant={'outline'}>Sign up now</Button>
          </Link>
        </div>
      </div>
    </div>
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
