import { createFileRoute } from '@tanstack/react-router'
import { FeedForm } from '@/components/form/feed-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { FeedCard } from '@/components/card/feed-card'
import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Link2, FolderOpen, Trash2, Pencil, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AddPeopleForm } from '@/components/form/add-people'

const apiUrl = import.meta.env.VITE_API_URL

interface SpaceData {
  id: string
  name: string
  description?: string | null
  feeds: Array<{
    id: string
    url: string
    title: string
    description?: string | null
    imageUrl?: string | null
  }>
}

export const Route = createFileRoute('/_app/space/$id')({
  component: SpacePerId,
})

function SpacePerId() {
  const [search, setSearch] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const { id: spaceId } = Route.useParams()
  const { data: session, isLoading } = authClient.useSession()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoading && !session) {
      navigate({ to: '/' })
    }
  }, [session, isLoading, navigate])

  const { data: spaceData, isLoading: spaceLoading, error } = useQuery<SpaceData>({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}`)
      if (!response.ok) throw new Error('Failed to load space')
      return response.json()
    },
    enabled: !!spaceId && !!session,
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { name?: string; description?: string }) => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space', spaceId] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      setEditOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete space')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
      navigate({ to: '/home' })
    },
  })

  const handleEditOpen = () => {
    setEditName(spaceData?.name || '')
    setEditDescription(spaceData?.description || '')
    setEditOpen(true)
  }

  const handleEditSave = () => {
    updateMutation.mutate({
      name: editName !== spaceData?.name ? editName : undefined,
      description: editDescription !== (spaceData?.description || '') ? editDescription : undefined,
    })
  }

  const feeds = spaceData?.feeds || []
  const fuse = new Fuse(feeds, {
    isCaseSensitive: false,
    ignoreDiacritics: true,
    threshold: 0.5,
    keys: ['title', 'url', 'description'],
  })

  const results = search ? fuse.search(search).map((r) => r.item) : feeds

  const isEmpty = !spaceLoading && !error && results.length === 0
  const hasLinks = !spaceLoading && !error && results.length > 0

  return (
    <div className="h-full w-full bg-background flex flex-col">
      <div className="border-b bg-card/50 shrink-0 px-6 py-4 dark:border-[hsl(194,10%,25%)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/home' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">
                    {spaceLoading ? 'Loading...' : spaceData?.name || 'Space'}
                  </h1>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEditOpen}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {spaceLoading ? '' : (spaceData?.description || 'No description')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        <FeedForm
          userId={session?.session.userId ?? ''}
          spaceId={spaceId}
          setSearch={setSearch}
          search={search}
        />
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Space</DialogTitle>
            <DialogDescription>
              Make changes to your space.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="space-name">Name</Label>
              <Input
                id="space-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Space name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-desc">Description (optional)</Label>
              <Input
                id="space-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Space</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this space? All links in this space will also be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col">
        {spaceLoading && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="font-medium mb-1">Failed to load space</h3>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        )}

        {hasLinks && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} {results.length === 1 ? 'link' : 'links'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((ele) => (
                <FeedCard
                  key={ele.id}
                  id={ele.id}
                  url={ele.url}
                  imageUrl={ele.imageUrl || undefined}
                  title={ele.title}
                  description={ele.description || undefined}
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
              {search ? 'No matches found' : 'This space is empty'}
            </h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              {search
                ? 'Try a different search term'
                : 'Add your first link to this space'}
            </p>
          </div>
        )}
      </div>

      <AddPeopleForm
        userId={session?.session.userId ?? ''}
        spaceId={spaceId}
        isOpen={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  )
}
