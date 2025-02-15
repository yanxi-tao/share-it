import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '@/components/auth/signin-form'

export const Route = createFileRoute('/auth/signin')({
  component: SignIn,
})

function SignIn() {
  return <SignInForm />
}
