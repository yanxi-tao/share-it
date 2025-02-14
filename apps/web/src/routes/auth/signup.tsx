import { createFileRoute } from '@tanstack/react-router'
import { createAuthClient } from 'better-auth/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateSignUpSchemaType } from '@/lib/types'
import { CreateSignUpSchema } from '@/lib/schema'

export const Route = createFileRoute('/auth/signup')({
  component: signUp,
})

const authClient = createAuthClient()

function signUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const form = useForm<CreateSignUpSchemaType>({
    resolver: zodResolver(CreateSignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repassword: '',
    },
  })

  function onSubmit(values: CreateSignUpSchemaType) {
    console.log(values)
    const { error } = authClient.signUp.email(
      {
        email: values.email, // user email address
        password: values.password, // user password -> min 8 characters by default
        name: values.name, // user display name

        callbackURL: '/home', // a url to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message)
        },
      }
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sign-up</CardTitle>
          <CardDescription>Signup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Link URL</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        // onChange={(e) => {
                        //   setSearch(e.target.value)
                        //   field.onChange(e)
                        // }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Link URL</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        type="email"
                        // onChange={(e) => {
                        //   setSearch(e.target.value)
                        //   field.onChange(e)
                        // }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Link URL</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                        // onChange={(e) => {
                        //   setSearch(e.target.value)
                        //   field.onChange(e)
                        // }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Link URL</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="Re-enter Password"
                        {...field}
                        type="password"
                        // onChange={(e) => {
                        //   setSearch(e.target.value)
                        //   field.onChange(e)
                        // }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign-Up</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
