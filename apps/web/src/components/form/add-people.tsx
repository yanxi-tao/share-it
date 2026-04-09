import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { Search, X, UserPlus, Loader2, Check, User } from 'lucide-react'
import { useState, useEffect } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

interface Person {
  email: string
  id: string
  name?: string | null
}

interface Member {
  id: string
  name: string | null
  email: string | null
  isOwner: boolean
}

export const AddPeopleForm = ({
  userId,
  spaceId,
  isOpen,
  onOpenChange,
}: {
  userId: string
  spaceId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [email, setEmail] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(false)
  const [listPeople, setListPeople] = useState<Person[]>([])
  const [searchError, setSearchError] = useState(false)
  const queryClient = useQueryClient()

  const removePerson = (personToRemove: Person) => {
    setListPeople((prev) => prev.filter((p) => p.email !== personToRemove.email))
  }

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setSearchTriggered(false)
      setListPeople([])
      setSearchError(false)
    }
  }, [isOpen])

  const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ['space-members', spaceId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}/members`)
      if (!response.ok) throw new Error('Failed to load members')
      return response.json()
    },
    enabled: !!spaceId && isOpen,
  })

  const { data: spaceData } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}`)
      if (!response.ok) throw new Error('Failed to load space')
      return response.json()
    },
    enabled: !!spaceId && isOpen,
  })

  const isOwner = spaceData?.ownerId === userId

  const inviteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiUrl}/invites/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviterId: userId,
          guestId: id,
          spaceId: spaceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invite')
      }

      return response.json()
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}/members/${memberId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove member')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space-members', spaceId] })
    },
  })

  const inviteAllUsers = async () => {
    try {
      await Promise.all(listPeople.map((person) => inviteMutation.mutateAsync(person.id)))
      onOpenChange(false)
    } catch (error) {
      console.error('Invitation process failed:', error)
    }
  }

  const { isLoading: searchLoading, data: searchResult } = useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${email}/search`)
      if (!response.ok) throw new Error('User not found')
      return response.json()
    },
    enabled: searchTriggered,
    retry: false,
  })

  const handleSearch = () => {
    if (!email.trim()) return
    setSearchError(false)
    setSearchTriggered(true)
  }

  useEffect(() => {
    if (searchTriggered && searchResult && !searchLoading) {
      if (searchResult && !listPeople.some((p) => p.email === email)) {
        setListPeople((prev) => [...prev, { email, id: searchResult[0].id, name: searchResult[0].name }])
      }
      setEmail('')
      setSearchTriggered(false)
    } else if (searchTriggered && !searchLoading && !searchResult) {
      setSearchError(true)
      setSearchTriggered(false)
    }
  }, [searchTriggered, searchResult, searchLoading, email])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const isAlreadyMember = (memberEmail: string) => {
    return members?.some((m) => m.email === memberEmail)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Manage Space Members
          </DialogTitle>
          <DialogDescription>
            View members and invite new people to this space
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-base font-semibold mb-2 text-foreground">Current Members ({members?.length || 0})</h4>
            {membersLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {members?.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-md border bg-muted/30 dark:border-[hsl(194,10%,25%)]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm truncate text-foreground">
                        {member.name || member.email || 'Unknown'}
                        {member.email && member.name && (
                          <span className="text-muted-foreground"> ({member.email})</span>
                        )}
                        {member.isOwner && (
                          <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Owner
                          </span>
                        )}
                      </span>
                    </div>
                    {isOwner && member.id !== userId && !member.isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMemberMutation.mutate(member.id)}
                        disabled={removeMemberMutation.isPending}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t pt-4 dark:border-[hsl(194,10%,25%)]">
            <h4 className="text-base font-semibold mb-2 text-foreground">Invite New Members</h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setSearchError(false)
                  }}
                  onKeyUp={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searchLoading || !email.trim() || isAlreadyMember(email)}
              >
                {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>

            {searchError && (
              <p className="text-sm text-destructive mt-2">User not found. Check the email and try again.</p>
            )}

            {isAlreadyMember(email) && email && (
              <p className="text-sm text-muted-foreground mt-2">This user is already a member.</p>
            )}
          </div>

          {listPeople.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                People to invite ({listPeople.length})
              </p>
              <ul className="space-y-2 max-h-32 overflow-y-auto">
                {listPeople.map((person) => (
                  <li
                    key={person.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 dark:border-[hsl(194,10%,25%)]"
                  >
                    <span className="text-sm truncate">
                      {person.name || person.email}
                      {person.name && <span className="text-muted-foreground"> ({person.email})</span>}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePerson(person)}
                      className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {listPeople.length > 0 && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={inviteAllUsers} disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Send Invites
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
