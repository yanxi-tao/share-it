import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/space/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id: spaceId } = Route.useParams()
  return <div>Hello {`/space/${spaceId}`}!</div>
}
