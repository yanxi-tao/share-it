import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

function urlAddShow({}) {
  if (ValidURL()) {
    return (
      <Button type="submit" onClick={}>
        New Link
      </Button>
    )
  }
}

function Home() {
  const [index, setIndex] = useState(0)
  return (
    <div>
      Hello "/(app)/home"!
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="New Link or Search" />

        <Button type="submit">New Space</Button>
      </div>
    </div>
  )
}
