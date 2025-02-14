import { createFileRoute } from '@tanstack/react-router'
import { SpaceForm } from '@/components/form/space-form'
import { FeedForm } from '@/components/form/feed-form'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { FeedCard } from '@/components/app-card'
import { title } from 'process'
import { Description } from '@radix-ui/react-dialog'

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/space/$id')({
  component: RouteComponent,
})

function SpacePerId() {
  const { id: spaceId } = Route.useParams()
  const { data: session } = authClient.useSession()

  const { data, error, isLoading } = useQuery({
    queryKey: ['feeds'], //, session?.data?.id
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/users/wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA`
      ) //${apiUrl}/users/${session?.data?.id}/feeds
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    // enabled: !!session?.data?.id, // Only run the query if session.data.id is available
  })

  function enumerateFeeds() {
    if (isLoading) {
      return <p>Loading...</p>
    }

    if (error) {
      return <p>Error loading feeds</p>
    }

    if (Array.isArray(data)) {
      return data.map((ele: any) => (
        <FeedCard
          Key={ele.id}
          id={ele.id}
          url={ele.url}
          imageUrl={ele.imageUrl}
          title={ele.title}
          description={ele.description}
        />
      ))
    }

    return <p>No feeds available</p>
  }
  return (
    <div>
      <div className="flex w-full flex-col space-y-4 p-4">
        <SpaceForm ownerId="wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA" />
        <hr />
        <FeedForm userId="wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA" spaceId={spaceId} />
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {enumerateFeeds()}
      </div>
    </div>
  )
}
