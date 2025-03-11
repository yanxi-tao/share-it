import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useState } from "react";
import { AddPeopleForm } from "@/components/form/add-people";
import { authClient } from "@/lib/auth";
import { AcceptInvite } from "@/components/form/acceptinvite";

const apiUrl = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { data: session } = authClient.useSession();
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isDialogOpenPeople, setIsDialogOpenPeople] = useState(false);
  const [isDialogOpenInvites, setIsDialogOpenInvites] = useState(false);

  const handleAddPeople = (spaceId: string, userId: string) => {
    setSelectedSpaceId(spaceId);
    setSelectedUserId(userId);
    setIsDialogOpenPeople(true);
  };

  const handleInvites = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpenInvites(true);
  };

  return (
    <SidebarProvider>
      <LeftSidebar
        setShowAddPeopleForm={handleAddPeople}
        setShowInvites={handleInvites}
      />
      <main>
        <h1>{apiUrl}</h1>
        <SidebarTrigger />
        <Outlet />
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
      </main>
    </SidebarProvider>
  );
}
