import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

const apiUrl = import.meta.env.VITE_API_URL;

export function LeftSidebar() {
  const { data: session } = authClient.useSession();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["spaces"], //, session?.data?.id
  //   queryFn: async () => {
  //     const response = await fetch(
  //       `${apiUrl}/users/${session?.user?.id}/spaces`,
  //     ); //${apiUrl}/users/${session?.user?.id}/spaces
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   },
  //   enabled: !!session?.user?.id, // Only run the query if session.data.id is available
  // });

  function spaces() {
    return (
      <ul>
        {/* {data.map((ele: any) => (
          <li key={ele.id}>
            <a href={`/spaces/${ele.id}`}>
              <div>{ele.name}</div>
            </a>
          </li>
        ))} */}
      </ul>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        {spaces()}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
