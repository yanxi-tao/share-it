import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const FeedCard = ({
  id,
  title,
  description,
  url,
  imageUrl,
}: {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
}) => {
  return (
    <Card className="w-[350px]" id={id}>
      <CardHeader>
        <img src={imageUrl} alt="Dinosaur" />
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <span className="bold text-lg">{title}</span>
          <span>{description}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <a href={url}>
          <Button>Open</Button>
        </a>
      </CardFooter>
    </Card>
  )
}
