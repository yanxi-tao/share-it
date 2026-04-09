import { createFileRoute } from '@tanstack/react-router'
import { FeedForm } from '@/components/form/feed-form'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { FeedCard } from '@/components/card/feed-card'
import { useState } from 'react'
import Fuse from 'fuse.js'
import { Skeleton } from '@/components/ui/skeleton'
import { Bookmark, Link2 } from 'lucide-react'
import { SpaceForm } from '@/components/form/space-form'

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

function Home() {
  const { data: session } = authClient.useSession()
  const [search, setSearch] = useState('')

  const { data, error, isLoading } = useQuery({
    queryKey: ['feeds', session?.session.userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${session?.session.userId}`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
    enabled: !!session?.session.userId,
  })

  const { data: spaces } = useQuery({
    queryKey: ['spaces', session?.session.userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${session?.session.userId}/spaces`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
    enabled: !!session?.session.userId,
  })

  const fuse = new Fuse(data || [], {
    isCaseSensitive: false,
    ignoreDiacritics: true,
    threshold: 0.5,
    keys: ['title', 'url', 'description'],
  })

  const results = search ? fuse.search(search).map((r) => r.item) : data

  const isEmpty = !isLoading && !error && (!results || results.length === 0)
  const hasLinks = !isLoading && !error && results && results.length > 0

  return (
    <div className="h-full w-full bg-background flex flex-col">
      <div className="border-b bg-card/50 shrink-0 px-6 py-4 dark:border-[hsl(194,10%,25%)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Your Links</h1>
              <p className="text-sm text-muted-foreground">
                {hasLinks ? `${results.length} saved links across ${spaces?.length || 0} spaces` : 'Organize and share your links'}
              </p>
            </div>
          </div>
          <SpaceForm ownerId={session?.session.userId ?? ''} />
        </div>
        <FeedForm
          userId={session?.session.userId ?? ''}
          spaceId=""
          setSearch={setSearch}
          search={search}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {isLoading && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-44 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
              <Bookmark className="h-8 w-8" />
            </div>
            <h3 className="font-medium mb-1">Failed to load links</h3>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        )}

        {hasLinks && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((ele: any) => (
                <FeedCard
                  key={ele.id}
                  id={ele.id}
                  url={ele.url}
                  imageUrl={ele.imageUrl}
                  title={ele.title}
                  description={ele.description}
                />
              ))}
            </div>
          </div>
        )}

        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="p-5 rounded-full bg-muted mb-6">
              <Link2 className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {search ? 'No matches found' : 'No links saved yet'}
            </h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              {search
                ? 'Try a different search term'
                : 'Paste a URL above to save your first link'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
