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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { CreateSpaceSchema } from '@/lib/schema'
import { CreateSpaceSchemaType } from '@/lib/types'
import { useNavigate } from '@tanstack/react-router'
import { Plus, FolderPlus } from 'lucide-react'
import { useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

export const SpaceForm = ({ ownerId }: { ownerId: string }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
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
    onSuccess: async (data) => {
      const response = await data.json()
      form.reset()
      setOpen(false)
      navigate({ to: `/space/${response.id}` })
    },
  })

  function onSubmit(values: CreateSpaceSchemaType) {
    mutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Create space">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Create New Space
          </DialogTitle>
          <DialogDescription>
            Create a new space to organize your links and share with others
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Reading List" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the display name of your space
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Articles and links about..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: describe what this space is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Space'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
