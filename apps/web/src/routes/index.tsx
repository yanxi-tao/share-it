import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import logo from '/src/assets/share-it_logo.png'
import { useState } from 'react'
import { Menu, X, Sun, Moon, Bookmark, Users, Link2, Search, ArrowRight } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { useTheme } from '@/lib/providers/theme-provider'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const features = [
    {
      icon: Bookmark,
      title: 'Organize',
      description: 'Create spaces for topics, projects, or teams',
    },
    {
      icon: Users,
      title: 'Collaborate',
      description: 'Share spaces and invite others to contribute',
    },
    {
      icon: Link2,
      title: 'Preview',
      description: 'Links show rich previews with images and text',
    },
    {
      icon: Search,
      title: 'Discover',
      description: 'Find any link instantly with powerful search',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={logo} />
              <AvatarFallback>SI</AvatarFallback>
            </Avatar>
            <span className="text-xl font-bold tracking-tight">Share-It</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Toggle
              onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </Toggle>
            <Link to="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t p-4 space-y-4 bg-background">
            <Link to="/about" className="block text-sm font-medium py-2">About</Link>
            <div className="flex items-center gap-4 py-2">
              <Toggle
                onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
                className="rounded-full"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </Toggle>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link to="/auth/signin">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <Bookmark className="h-3 w-3" />
            Collaborative bookmark management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            Share links with your team
            <br />
            <span className="text-primary">without the chaos</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Create spaces, save links, and collaborate with your team.
            Beautiful previews, instant search, zero clutter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="gap-2">
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Simple tools to organize, share, and discover links with your team
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border bg-card hover:bg-card/80 hover:border-primary/30 transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of teams who organize their links with Share-It.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={logo} />
                <AvatarFallback>SI</AvatarFallback>
              </Avatar>
              <span className="font-semibold">Share-It</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Collaborative bookmark management
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
