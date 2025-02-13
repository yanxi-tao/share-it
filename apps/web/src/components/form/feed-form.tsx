import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeedSchemaType } from '@/lib/types'
import { CreateFeedSchema } from '@/lib/schema'
import { useState } from 'react'
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
  const [search, setSearch] = useState('')

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
    <Form {...form} className="flex">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verifiedURL"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Link URL</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="New Link or Search"
                  {...field}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Link</Button>
      </form>
    </Form>
  )
}
