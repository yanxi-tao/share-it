import { createFileRoute } from "@tanstack/react-router";
import { SpaceForm } from "@/components/form/space-form";
import { FeedForm } from "@/components/form/feed-form";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { FeedCard } from "@/components/card/feed-card";
import { useState } from "react";
import Fuse from "fuse.js";

const apiUrl = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/_app/space/$id")({
  component: SpacePerId,
});

function SpacePerId() {
  const [search, setSearch] = useState("");
  const { id: spaceId } = Route.useParams();
  const { data: session } = authClient.useSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["space feeds"], //, session?.user?.id
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/spaces/${spaceId}`); //${apiUrl}/users/id/space/id/
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!session?.user?.id, // Only run the query if session.user.id is available
  });

  const options = {
    isCaseSensitive: false,
    ignoreDiacritics: false,
    includeMatches: false,
    threshold: "0.5",
    // Search in `author` and in `tags` array
    keys: ["title", "url", "description"],
  };

  function enumerateFeeds() {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error loading feeds</p>;
    }

    if (Array.isArray(data)) {
      if (search == "") {
        return data.map((ele: any) => (
          <FeedCard
            key={ele.id}
            id={ele.id}
            url={ele.url}
            imageUrl={ele.imageUrl}
            title={ele.title}
            description={ele.description}
          />
        ));
      } else {
        const fuse = new Fuse(data, options);
        const result = fuse.search(search);
        console.log(result);
        return result.map(({ item }: any) => (
          <FeedCard
            key={item.id}
            id={item.id}
            url={item.url}
            imageUrl={item.imageUrl}
            title={item.title}
            description={item.description}
          />
        ));
      }
    }

    return <p>No feeds available</p>;
  }

  return (
    <>
      <div className="flex w-full flex-col space-y-4 p-4">
        <FeedForm
          userId={session?.user?.id ?? ""}
          spaceId={spaceId}
          setSearch={setSearch}
          search={search}
        />
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {enumerateFeeds()}
      </div>
    </>
  );
}
