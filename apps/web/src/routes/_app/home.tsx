import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
// import { useState } from 'react'
import { string, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from '@tanstack/react-query'

const formSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(5).max(100),
})

const queryClient = new QueryClient()

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

import validUrl from '@/lib/validURL'

const apiUrl = import.meta.env.VITE_API_URL

const NewFeed = async ({ url, spaceId }: { url: string; spaceId: string }) => {
  // const session = authClient.useSession()
  // if (session()?.data?.user?.id !== null) {
}

function Home() {
  const [validURL, setValidURL] = useState('')
  const [space, setSpace] = useState('')
  const [spaceName, setSpaceName] = useState('')
  const [spaceDescription, setSpaceDescription] = useState('')
  const [addingLink, setaddingLink] = useState(false)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  // const [index, setIndex] = useState(0)

  const newSpace = useMutation({
    mutationFn: ({
      name,
      description,
      ownerId,
    }: {
      name: string
      description: string
      ownerId: string
    }) => {
      return fetch(`${apiUrl}/spaces/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, ownerId }),
      })
    },
  })

  const newLink = useMutation({
    mutationFn: ({
      url,
      spaceId,
      ownerId,
    }: {
      url: string
      spaceId: string
      ownerId: string
    }) => {
      return fetch(`${apiUrl}/feeds/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spaceId, url, ownerId }),
      })
    },
  })

  useEffect(() => {
    console.log('url', search)
    const res = validUrl(search)
    if (!(res instanceof Error)) {
      setValidURL(String(res))
    }
  }, [search])

  function fetchData({ userId }: { userId: string }) {
    const { error, data, isFetching } = useQuery({
      queryKey: ['feeds', userId],
      queryFn: async () => {
        const response = await fetch(`${apiUrl}/feeds/[id]`, { method: 'GET' })
        return await response.json()
      },
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    newSpace.mutate({
      name: values.name,
      description: values.description,
      ownerId: 'wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA',
    })
  }

  const frameworks = [
    {
      value: 'next.js',
      label: 'Next.js',
    },
    {
      value: 'sveltekit',
      label: 'SvelteKit',
    },
    {
      value: 'nuxt.js',
      label: 'Nuxt.js',
    },
    {
      value: 'remix',
      label: 'Remix',
    },
    {
      value: 'astro',
      label: 'Astro',
    },
  ]

  return (
    <div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="New Link or Search"
          onChange={(e) => setSearch(e.target.value)}
          disabled={addingLink}
        />
        {validURL ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="submit" onClick={() => setaddingLink(true)}>
                New Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a new Link</DialogTitle>
                <DialogDescription>
                  Select which Space to add this link to
                </DialogDescription>
              </DialogHeader>
              <div className="justify-items-center">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find(
                            (framework) => framework.value === value
                          )?.label
                        : 'Select space...'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search spaces..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No space found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? '' : currentValue
                                )
                                setOpen(false)
                              }}
                            >
                              {framework.label}
                              <Check
                                className={
                                  value === framework.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <Button type="submit">New Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <h1>Invalid URL</h1>
        )}

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
