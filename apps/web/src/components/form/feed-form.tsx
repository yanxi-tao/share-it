import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeedSchemaType } from '@/lib/types'
import { CreateFeedSchema } from '@/lib/schema'
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Link2, Loader2, Search } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
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
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

const apiUrl = import.meta.env.VITE_API_URL

export const FeedForm = ({
  userId,
  spaceId,
  search,
  setSearch,
}: {
  userId: string
  spaceId: string
  search: string
  setSearch: (value: string) => void
}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaceId)

  useEffect(() => {
    if (spaceId) {
      setSelectedSpaceId(spaceId)
    }
  }, [spaceId])

  const form = useForm<CreateFeedSchemaType>({
    resolver: zodResolver(CreateFeedSchema),
    defaultValues: {
      userId: userId,
      spaceId: spaceId,
      verifiedURL: search,
    },
  })

  useEffect(() => {
    form.setValue('verifiedURL', search)
  }, [search, form])

  const handleSpaceSelect = (currentValue: string) => {
    const newValue = currentValue === selectedSpaceId ? '' : currentValue
    setSelectedSpaceId(newValue)
    form.setValue('spaceId', newValue)
    setOpen(false)
  }

  const mutation = useMutation({
    mutationFn: (data: { url: string }) => {
      const targetSpaceId = spaceId || selectedSpaceId
      return fetch(`${apiUrl}/feeds/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          spaceId: targetSpaceId,
          verifiedURL: data.url,
        }),
      })
    },
    onSuccess: () => {
      form.reset({ userId, spaceId: spaceId || selectedSpaceId, verifiedURL: '' })
      setSearch('')
      setSelectedSpaceId(spaceId)
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
      queryClient.invalidateQueries({ queryKey: ['space-feeds'] })
      if (spaceId) {
        queryClient.invalidateQueries({ queryKey: ['space', spaceId] })
      }
    },
  })

  function onSubmit(values: CreateFeedSchemaType) {
    mutation.mutate({ url: values.verifiedURL })
  }

  const { data: spaces, isLoading: spacesLoading } = useQuery({
    queryKey: ['spaces', userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${userId}/spaces`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
  })

  const showSpaceSelector = spaceId === ''
  const selectedSpace = spaces?.find((s: any) => s.id === selectedSpaceId)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Paste URL or search links..."
            {...form.register('verifiedURL')}
            onChange={(e) => {
              setSearch(e.target.value)
              form.setValue('verifiedURL', e.target.value)
            }}
            className="pl-10 pr-10 h-11 bg-background border-[hsl(194,6%,20%)] dark:border-[hsl(194,6%,20%)]"
          />
          <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        </div>

        {showSpaceSelector && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full sm:w-[180px] justify-between h-11 shrink-0 border-[hsl(194,6%,20%)] dark:border-[hsl(194,6%,20%)]"
              >
                {selectedSpace ? (
                  <span className="truncate">{selectedSpace.name}</span>
                ) : (
                  <span className="text-muted-foreground truncate">Select space</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search spaces..." />
                <CommandList>
                  {spacesLoading ? (
                    <div className="p-2">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No spaces found</CommandEmpty>
                      <CommandGroup>
                        {spaces?.map((space: any) => (
                          <CommandItem
                            key={space.id}
                            value={space.id}
                            onSelect={handleSpaceSelect}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedSpaceId === space.id ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                            {space.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        <Button type="submit" disabled={mutation.isPending} className="h-11 px-6 shrink-0">
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Save Link'
          )}
        </Button>
      </form>
    </Form>
  )
}
