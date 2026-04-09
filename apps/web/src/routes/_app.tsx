import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LeftSidebar } from '@/components/shared/left-sidebar'
import { useState } from 'react'
import { AddPeopleForm } from '@/components/form/add-people'
import { AcceptInvite } from '@/components/form/acceptinvite'

export const Route = createFileRoute('/_app')({
  component: LayoutComponent,
})

function LayoutComponent() {
  const [selectedSpaceId, setSelectedSpaceId] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isDialogOpenPeople, setIsDialogOpenPeople] = useState(false)
  const [isDialogOpenInvites, setIsDialogOpenInvites] = useState(false)

  const handleAddPeople = (spaceId: string, userId: string) => {
    setSelectedSpaceId(spaceId)
    setSelectedUserId(userId)
    setIsDialogOpenPeople(true)
  }

  const handleInvites = (userId: string) => {
    setSelectedUserId(userId)
    setIsDialogOpenInvites(true)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <LeftSidebar
          setShowAddPeopleForm={handleAddPeople}
          setShowInvites={handleInvites}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="lg:hidden p-2">
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
        <AddPeopleForm
          userId={selectedUserId}
          spaceId={selectedSpaceId}
          isOpen={isDialogOpenPeople}
          onOpenChange={setIsDialogOpenPeople}
        />
        <AcceptInvite
          userId={selectedUserId}
          isOpen={isDialogOpenInvites}
          onOpenChange={setIsDialogOpenInvites}
        />
      </div>
    </SidebarProvider>
  )
}
