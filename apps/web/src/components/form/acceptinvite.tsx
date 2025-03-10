import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

export const AcceptInvite = ({
  userId,
  isOpen,
  onOpenChange,
}: {
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const searchUserMutation = useMutation({
    mutationFn: async ({
      inviteId,
      spaceId,
      accepted,
    }: {
      inviteId: string;
      spaceId: string;
      accepted: boolean;
    }) => {
      const response = await fetch(`${apiUrl}/invites/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteId: inviteId,
          spaceId: spaceId,
          response: accepted,
        }),
      });
      if (!response.ok) {
        throw new Error("failed to save changes");
      }
      return response.json();
    },
    onSuccess() {
      queryClient.refetchQueries();
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/invites/${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  console.log(data);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <div>Loading</div>}
        {!isLoading && (!data || data.length === 0) ? (
          <div className="text-foreground">No pending invites</div>
        ) : (
          <ul>
            {data?.map(
              (invite: {
                id: string;
                space: string;
                name: string;
                spaceId: string;
              }) => (
                <li
                  key={invite.id}
                  className="border-2 border-cyan-50 rounded-xl flex justify-between "
                >
                  {/* ... rest of your invite item code ... */}
                </li>
              ),
            )}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
