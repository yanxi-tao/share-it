import { createFileRoute } from '@tanstack/react-router'

import { FeedForm } from '@/components/form/feed-form'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { FeedCard } from '@/components/card/feed-card'
import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

function Home() {
  const { data: session } = authClient.useSession()
  const [search, setSearch] = useState('')

  const { data, error, isLoading } = useQuery({
    queryKey: ['feeds'], //, session?.data?.id
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${session?.user?.id}`) //${apiUrl}/users/${session?.user?.id}/feeds
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    enabled: !!session?.user?.id, // Only run the query if session.data.id is available
  })

  const options = {
    isCaseSensitive: false,
    ignoreDiacritics: false,
    includeMatches: false,
    threshold: '0.5',
    // Search in `author` and in `tags` array
    keys: ['title', 'url', 'description'],
  }

  function enumerateFeeds() {
    if (isLoading) {
      return <p>Loading...</p>
    }

    if (error) {
      return <p>Error loading feeds</p>
    }

    if (Array.isArray(data)) {
      if (search == '') {
        return data.map((ele: any) => (
          <FeedCard
            key={ele.id}
            id={ele.id}
            url={ele.url}
            imageUrl={ele.imageUrl}
            title={ele.title}
            //description={ele.description}
          />
        ))
      } else {
        const fuse = new Fuse(data, options)
        const result = fuse.search(search)
        console.log(result)
        return result.map(({ item }: any) => (
          <FeedCard
            key={item.id}
            id={item.id}
            url={item.url}
            imageUrl={item.imageUrl}
            title={item.title}
            // description={item.description}
          />
        ))
      }
    }

    return <p>No feeds available</p>
  }

  return (
    <div className="min-h-screen w-full p-4">
      <div className="mb-4">
        <FeedForm
          userId={session?.user?.id ?? ''}
          spaceId=""
          setSearch={setSearch}
          search={search}
        />
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 grid-flow-row-dense gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
          {enumerateFeeds()}
        </div>
      </div>
    </div>
  )
}
