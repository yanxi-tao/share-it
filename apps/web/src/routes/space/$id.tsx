import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/space/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/space/[id]"!</div>
}
