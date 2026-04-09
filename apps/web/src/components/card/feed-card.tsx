import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { ExternalLink, Trash2, Pencil, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditFeedDialog } from '@/components/form/edit-feed-dialog'
import { cn } from '@/lib/utils'

const apiUrl = import.meta.env.VITE_API_URL

interface FeedCardProps {
  id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
}

export const FeedCard = ({
  id,
  title,
  description,
  url,
  imageUrl,
}: FeedCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const displayImage = imageUrl && !imageError ? imageUrl : null

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${apiUrl}/feeds/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
      queryClient.invalidateQueries({ queryKey: ['space-feeds'] })
      queryClient.invalidateQueries({ queryKey: ['space'] })
    },
  })

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteMutation.mutate()
    }
  }

  const hostname = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  })()

  return (
    <>
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-200 border dark:border-[hsl(194,10%,25%)]',
          'hover:shadow-lg hover:border-primary/30',
          deleteMutation.isPending && 'opacity-50 pointer-events-none'
        )}
      >
        <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-xl">
          {displayImage ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={displayImage}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            </a>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 hover:from-primary/5 hover:to-primary/5 transition-colors"
            >
              <ExternalLink className="h-12 w-12 text-muted-foreground/30" />
            </a>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0"
            >
              <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                {title || 'Untitled'}
              </h3>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)} className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {description && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground truncate">
          <span className="truncate">{hostname}</span>
        </CardFooter>
      </Card>

      <EditFeedDialog
        feedId={id}
        currentTitle={title}
        currentDescription={description}
        currentUrl={url}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
