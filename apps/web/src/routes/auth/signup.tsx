import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from '@/components/auth/signup-form'

export const Route = createFileRoute('/auth/signup')({
  component: SignUp,
})

function SignUp() {
  return <SignUpForm />
}
