import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { Check, X, Bell } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const apiUrl = import.meta.env.VITE_API_URL

interface Invite {
  id: string
  spaceId: string
  inviterId: string
  spaceName: string | null
  inviterName: string | null
}

export const AcceptInvite = ({
  userId,
  isOpen,
  onOpenChange,
}: {
  userId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()

  const { isLoading, data, error } = useQuery<Invite[]>({
    queryKey: ['invites', userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/invites/${userId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    enabled: !!userId && isOpen,
  })

  const respondMutation = useMutation({
    mutationFn: async ({
      inviteId,
      spaceId,
      accepted,
    }: {
      inviteId: string
      spaceId: string
      accepted: boolean
    }) => {
      const response = await fetch(`${apiUrl}/invites/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId,
          spaceId,
          response: accepted,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to respond to invite')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', userId] })
      queryClient.invalidateQueries({ queryKey: ['spaces', userId] })
    },
  })

  const handleResponse = (inviteId: string, spaceId: string, accepted: boolean) => {
    respondMutation.mutate({ inviteId, spaceId, accepted })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Invitations
          </DialogTitle>
          <DialogDescription>
            Accept or decline invitations to join spaces
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Failed to load invitations
            </p>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No pending invitations
              </p>
            </div>
          )}

          {data && data.length > 0 && (
            <ul className="space-y-3">
              {data.map((invite) => (
                <li
                  key={invite.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground dark:border-[hsl(194,10%,25%)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{invite.spaceName || 'New Space'}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        Invited by {invite.inviterName || 'someone'}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleResponse(invite.id, invite.spaceId, false)}
                        disabled={respondMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleResponse(invite.id, invite.spaceId, true)}
                        disabled={respondMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
