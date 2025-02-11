import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(5).max(100),
})

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

// function urlAddShow({}) {
//   if (ValidURL()) {
//     return (
//       <Button type="submit" onClick={}>
//         New Link
//       </Button>
//     )
//   }
// }

function Home() {
  // const [index, setIndex] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="New Link or Search" />
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit">New Space</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wanna create some spacey</DialogTitle>
              <DialogDescription>
                Create a new space to share with your friends
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space Name</FormLabel>
                      <FormControl>
                        <Input placeholder="some namy" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your space's public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Space Description</FormLabel>
                      <FormControl>
                        <Input placeholder="some descriptionnnn" {...field} />
                      </FormControl>
                      <FormDescription>
                        wanna explain what this space is about?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
