import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { Link, Plus, Search, Space, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Session } from "inspector/promises";

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
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/invites/${userId}`);
      // need aask if can return inviter name and also space name aswell as what he has right now
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
        {data && (
          <ul>
            {data.map((invite: { space: string; name: string }) => (
              <li
                key={invite.name}
                className="border-2 border-cyan-50 rounded-xl flex justify-between "
              >
                <div className="text-foreground">
                  You have been invited to {invite.space} by {invite.name}
                </div>
                <div>
                  <Button className="bg-green-600" variant="destructive">
                    Accept
                  </Button>
                  <Button variant="destructive">Decline</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
