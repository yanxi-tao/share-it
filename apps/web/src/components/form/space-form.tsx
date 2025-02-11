import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { CreateSpaceSchema } from '@/lib/schema'
import { CreateSpaceSchemaType } from '@/lib/types'
// import { useNavigate } from '@tanstack/react-router'

const apiUrl = import.meta.env.VITE_API_URL

export const SpaceForm = ({ ownerId }: { ownerId: string }) => {
  //   const navigate = useNavigate()
  const form = useForm<CreateSpaceSchemaType>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateSpaceSchemaType) => {
      return fetch(`${apiUrl}/spaces/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          ownerId,
        }),
      })
    },
    // onSuccess: () => navigate({to: '/spaces'}), // need to add a route for this
  })

  function onSubmit(values: CreateSpaceSchemaType) {
    console.log(values)
    mutation.mutate(values)
  }
  return (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  )
}
