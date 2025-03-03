import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useState } from "react";
import { AddPeopleForm } from "@/components/form/add-people";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const { data: session } = authClient.useSession();
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPeople = (spaceId: string, userId: string) => {
    setSelectedSpaceId(spaceId);
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <LeftSidebar setShowAddPeopleForm={handleAddPeople} />
      <main>
        <SidebarTrigger />
        <Outlet />
        <AddPeopleForm
          userId={selectedUserId}
          spaceId={selectedSpaceId}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </main>
    </SidebarProvider>
  );
}
