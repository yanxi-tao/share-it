import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { Link, Plus, Search, Space, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Session } from 'inspector/promises'

const apiUrl = import.meta.env.VITE_API_URL

interface Person {
  email: string
  id: string
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
  const [listPeople, setListPeople] = useState<Person[]>([]) // Change to store Person objects

  const removePerson = (personToRemove: Person) => {
    setListPeople((prevList) =>
      prevList.filter((person) => person.email !== personToRemove.email)
    )
  }

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setSearchTriggered(false)
      setListPeople([])
    }
  }, [isOpen])

  const searchUserMutation = useMutation({
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
        throw new Error('User search failed')
      }

      return response.json()
    },
  })

  const inviteAllUsers = async () => {
    try {
      // Process all invites in parallel
      const results = await Promise.all(
        listPeople.map((person) =>
          searchUserMutation.mutateAsync(person.id).catch((error) => ({
            error,
            email: person.email,
          }))
        )
      )

      // Check for any errors
      const errors = results.filter((result) => 'error' in result)

      if (errors.length === 0) {
        onOpenChange(false) // Use the prop function to close dialog
      } else {
        // Handle errors - show toast or error message
        console.error('Failed to invite:', errors)
      }
    } catch (error) {
      console.error('Invitation process failed:', error)
    }
  }

  const { isSuccess, error, isLoading, data } = useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${email}/search`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    enabled: searchTriggered, // Only run the query when search is triggered
  })

  const handleSearch = () => {
    console.log('Searching for user')
    setSearchTriggered(true)
  }

  useEffect(() => {
    if (isSuccess && data !== null) {
      console.log(data[0].id)
      if (!listPeople.some((person) => person.email === email)) {
        setListPeople((prevList) => [...prevList, { email, id: data[0].id }])
      }
      setSearchTriggered(false)
      setEmail('')
    }
  }, [isSuccess, data])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <h2>Add People to Space</h2>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !email.trim()}
            >
              <Search />
            </Button>
          </div>
          {listPeople.length > 0 && (
            <ul className="space-y-2">
              {listPeople.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between p-2 rounded"
                >
                  <span>{person.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson(person)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {error && <div className="text-red-500">Error: User not found</div>}
          {isLoading && <div className="text-blue-500">Searching...</div>}
        </div>
        {listPeople.length > 0 && (
          <Button type="submit" onClick={inviteAllUsers}>
            Add People
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
