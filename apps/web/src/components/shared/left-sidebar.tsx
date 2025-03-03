import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SpaceForm } from "@/components/form/space-form";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CircleUser, Home, UserPlus } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

interface LeftSidebarProps {
  setShowAddPeopleForm: (spaceId: string, userId: string) => void;
}

export function LeftSidebar({ setShowAddPeopleForm }: LeftSidebarProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  console.log("User ID:", session?.user?.id);

  const { data, error, isLoading } = useQuery({
    queryKey: ["spaces"], //, session?.data?.id
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/users/${session?.user?.id}/spaces`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!session?.user?.id,
  });

  function spaces() {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading spaces</div>;
    if (!data) return null;

    return (
      <ul>
        {data.map((ele: any) => (
          <li key={ele.id}>
            <div className="flex">
              <div className="items-center w-full">
                <Button
                  variant="ghost"
                  className="w-full "
                  onClick={() =>
                    navigate({
                      to: `/space/${ele.id}`,
                    })
                  }
                >
                  {ele.name}
                </Button>
              </div>
              <Button
                className="rounded-4xl"
                variant="ghost"
                onClick={() => setShowAddPeopleForm(ele.id, session.user.id)}
              >
                <UserPlus />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader />

      <div className="flex justify-between mr-2 ml-2">
        <Button
          onClick={() =>
            navigate({
              to: `/home`,
            })
          }
          variant="ghost"
          className="-mt-1"
        >
          <Home className="w-10 h-10" />
        </Button>
        <span>Your Spaces</span>
        <SpaceForm ownerId={session?.user?.id ?? ""} />
      </div>
      <SidebarContent>
        <SidebarGroup />
        {spaces()}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex">
          <ModeToggle />
          <Button
            onClick={() =>
              navigate({
                to: `/account`,
              })
            }
            variant="ghost"
          >
            <CircleUser />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
