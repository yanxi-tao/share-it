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

export const AcceptInvite = ({
  userId,
  isOpen,
  onOpenChange,
}: {
  userId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  //   const searchUserMutation = useMutation({
  //     mutationFn: async (id: string) => {
  //       const response = await fetch(`${apiUrl}/invites/create`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           inviterId: userId,
  //           guestId: id,
  //         }),
  //       })

  //       if (!response.ok) {
  //         throw new Error('User search failed')
  //       }

  //       return response.json()
  //     },
  //   })

  const { error, isLoading, data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/invites/${userId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  console.log(data)
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <div>Loading</div>}
        {data &&
          data.map((invite) => (
            <div className="border-2 border-gray-100 rounded-3xl flex justify-between">
              <div>
                You have been invited to {invite.space} by {invite.name}
              </div>
              <div>
                <Button className="bg-green-600">Accept</Button>
                <Button variant="destructive">Decline</Button>
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  )
}
