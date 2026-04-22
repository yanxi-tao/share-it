import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import logo from '/src/assets/share-it_logo.png'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { authClient } from '@/lib/auth-client'

type AuthCardWrapperProps = {
  children: React.ReactNode
  headerLabel: string
  redirectLabel: string
  redirectPath: string
}

export const AuthCardWrapper = ({
  children,
  headerLabel,
  redirectLabel,
  redirectPath,
}: AuthCardWrapperProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={logo} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">SI</AvatarFallback>
            </Avatar>
            <span className="text-3xl font-bold tracking-tight">Share-It</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center">
            Collaborative bookmark management
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">
              {headerLabel}
            </CardTitle>
            <CardDescription className="text-center">
              {headerLabel === 'Sign In'
                ? 'Welcome back!'
                : 'Get started for free'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="relative overflow-hidden group"
                onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/home' })}
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="relative overflow-hidden group"
                onClick={() => authClient.signIn.social({ provider: 'github', callbackURL: '/home' })}
              >
                <FaGithub className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-border/50 dark:bg-[hsl(194,10%,25%)]" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            {children}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-2 pb-6">
            <div className="text-sm text-muted-foreground text-center">
              {headerLabel === 'Sign In' ? (
                <>
                  Don't have an account?{' '}
                  <Link to={redirectPath} className="text-primary hover:underline font-medium">
                    {redirectLabel}
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to={redirectPath} className="text-primary hover:underline font-medium">
                    {redirectLabel}
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
