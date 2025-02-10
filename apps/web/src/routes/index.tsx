import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

const apiUrl = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/`)
      return response.text()
    },
  })
  return (
    <div className=" flex justify-center items-center flex-col space-y-2 p-2">
      <h3>Welcome Home!</h3>
      <Button>Working Shadcn + Tailwind v4</Button>
      <h3>Server Data</h3>
      <span>{data}</span>
    </div>
  )
}
