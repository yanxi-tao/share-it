import { createFileRoute } from "@tanstack/react-router";
import { SpaceForm } from "@/components/form/space-form";
import { FeedForm } from "@/components/form/feed-form";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { FeedCard } from "@/components/card/feed-card";

const apiUrl = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/space/$id")({
  component: SpacePerId,
});

function SpacePerId() {
  const { id: spaceId } = Route.useParams();
  const { data: session } = authClient.useSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["feeds"], //, session?.user?.id
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}/`); //${apiUrl}/users/id/space/id/
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!session?.user?.id, // Only run the query if session.user.id is available
  });

  function enumerateFeeds() {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error loading feeds</p>;
    }

    if (Array.isArray(data)) {
      return data.map((ele: any) => (
        <FeedCard
          Key={ele.id}
          id={ele.id}
          url={ele.url}
          imageUrl={ele.imageUrl}
          title={ele.title}
          description={ele.description}
        />
      ));
    }

    return <p>No feeds available</p>;
  }
  return (
    <div>
      <div className="flex w-full flex-col space-y-4 p-4">
        <SpaceForm ownerId={session?.user?.id} />
        <hr />
        <FeedForm userId={session?.user?.id} spaceId={spaceId} />
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {enumerateFeeds()}
      </div>
    </div>
  );
}
