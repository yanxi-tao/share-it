import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { useTheme } from '@/lib/providers/theme-provider'
import logo from '/src/assets/share-it_logo.png'
import { Link } from '@tanstack/react-router'
import { Sun, Moon, Bookmark, Github, Heart } from 'lucide-react'

export const Route = createFileRoute('/_app/about')({
  component: About,
})

function About() {
  const { setTheme } = useTheme()

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b dark:border-[hsl(194,10%,25%)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={logo} />
              <AvatarFallback>SI</AvatarFallback>
            </Avatar>
            <span className="font-bold">Share-It</span>
          </Link>
          <Toggle
            onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Toggle>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <Avatar className="h-20 w-20 mx-auto mb-6">
            <AvatarImage src={logo} />
            <AvatarFallback className="text-2xl">SI</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-4">About Share-It</h1>
          <p className="text-xl text-muted-foreground">
            A collaborative bookmark manager for teams and individuals
          </p>
        </div>

        <Separator className="my-8" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">What is Share-It?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Share-It is a modern bookmark management tool designed for collaboration.
            Create spaces for different topics, projects, or teams, and share links
            with the people who matter most.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Unlike traditional bookmark managers, Share-It focuses on sharing and
            collaboration. Invite others to your spaces, see their contributions,
            and build shared knowledge bases together.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Spaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize your links into spaces. Each space can have its own
                  theme, members, and purpose.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Rich Previews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Links automatically show beautiful previews with title,
                  description, and image. No more guessing what a link contains.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Technology</h2>
          <p className="text-muted-foreground leading-relaxed">
            Built with modern web technologies: React, TypeScript, Hono, and SQLite.
            Fast, reliable, and easy to deploy.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Hono', 'SQLite', 'Tailwind CSS', 'TanStack Router'].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-muted rounded-full"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Open Source</h2>
          <p className="text-muted-foreground">
            Share-It is built with love and open to contributions.
          </p>
          <Button variant="outline" className="gap-2" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </section>

        <Separator className="my-8" />

        <footer className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using Share-It
          </p>
        </footer>
      </main>
    </div>
  )
}
