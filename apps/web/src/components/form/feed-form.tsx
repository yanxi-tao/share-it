import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeedSchemaType } from '@/lib/types'
import { CreateFeedSchema } from '@/lib/schema'

import { Button } from '@/components/ui/button'
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
import { useMutation } from '@tanstack/react-query'

const apiUrl = import.meta.env.VITE_API_URL

export const FeedForm = ({
  userId,
  spaceId,
}: {
  userId: string
  spaceId: string
}) => {
  const form = useForm<CreateFeedSchemaType>({
    resolver: zodResolver(CreateFeedSchema),
    defaultValues: {
      userId: '',
      spaceId: '',
      verifiedURL: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateFeedSchemaType) => {
      return fetch(`${apiUrl}/feeds/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          spaceId,
          verifiedURL: values.verifiedURL,
        }),
      })
    },
    // onSuccess: () => navigate({to: '/some_url'}), // need to add a route for this
  })

  function onSubmit(values: CreateFeedSchemaType) {
    console.log(values)
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verifiedURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feed URL</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
