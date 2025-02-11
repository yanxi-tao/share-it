import { createFileRoute } from '@tanstack/react-router'
import { SpaceForm } from '@/components/form/space-form'
import { FeedForm } from '@/components/form/feed-form'

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

function Home() {
  return (
    <div>
      <div className="flex w-full flex-col space-y-4 p-4">
        <SpaceForm ownerId="wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA" />
        <hr />
        <FeedForm
          userId="wJ8bm6qXxAQoZxQVxNuSZ5eaPWTrGnZA"
          spaceId="KQmY6_Bqri"
        />
      </div>
    </div>
  )
}
