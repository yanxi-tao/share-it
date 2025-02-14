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
import { CreateSignInSchemaType } from '@/lib/types'
import { CreateSignInSchema } from '@/lib/schema'
import { useNavigate } from '@tanstack/react-router'

const authClient = createAuthClient()

export const Route = createFileRoute('/auth/signin')({
  component: signIn,
})

function signIn() {
  const navigate = useNavigate()

  const form = useForm<CreateSignInSchemaType>({
    resolver: zodResolver(CreateSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: CreateSignInSchemaType) {
    console.log(values)
    authClient.signIn.email(
      {
        email: values.email, // user email address
        password: values.password, // user password -> min 8 characters by default

        callbackURL: '/home', // a url to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          navigate({
            to: '/home',
          })
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
              <Button type="submit">Add Link</Button>
            </form>
          </Form>
          {/* 
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue=""
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="">Email</Label>
            <Input
              id="email"
              defaultValue=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="">Password</Label>
            <Input
              id="email"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="">Password Repeated</Label>
            <Input
              id="email"
              defaultValue=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
