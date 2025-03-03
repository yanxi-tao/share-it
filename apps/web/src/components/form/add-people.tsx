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
import { useState } from "react";
import { Session } from "inspector/promises";

const apiUrl = import.meta.env.VITE_API_URL;

interface Person {
  email: string;
  id: string;
}

export const AddPeopleForm = ({
  userId,
  spaceId,
  isOpen,
  onOpenChange,
}: {
  spaceId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [listPeople, setListPeople] = useState<Person[]>([]); // Change to store Person objects

  const removePerson = (personToRemove: Person) => {
    setListPeople((prevList) =>
      prevList.filter((person) => person.email !== personToRemove.email),
    );
  };

  const searchUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiUrl}/invites/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviterId: userId,
          guestId: id,
          spaceId: spaceId,
        }),
      });

      if (!response.ok) {
        throw new Error("User search failed");
      }

      return response.json();
    },
  });

  function inviteAllUsers() {
    listPeople.forEach((person) => {
      searchUserMutation.mutate(person.id, {
        onSuccess: (data, variables, context) => {},
      });
    });
  }

  const { isSuccess, error, isLoading, data } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${email}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: searchTriggered, // Only run the query when search is triggered
  });

  const handleSearch = () => {
    setSearchTriggered(true);
    if (isSuccess) {
      if (!listPeople.some((person) => person.email === email)) {
        setListPeople((prevList) => [...prevList, { email, id: data.id }]);
      }
      setSearchTriggered(false);
      setEmail("");
      console.log(listPeople);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <h2>Add People to Space</h2>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !email.trim()}
            >
              <Search />
            </Button>
          </div>
          {listPeople.length > 0 && (
            <ul className="space-y-2">
              {listPeople.map((person, index) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between p-2 rounded"
                >
                  <span>{person.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson(person)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {error && <div className="text-red-500">Error: User not found</div>}
          {isLoading && <div className="text-blue-500">Searching...</div>}
        </div>
        {listPeople.length > 0 && (
          <Button type="submit" onClick={inviteAllUsers}>
            Add People
          </Button>
        )}
      </DialogContent>
    </Dialog>

    //   <DialogContent>
    //     <DialogHeader>
    //       <DialogTitle>Wanna add some people to space</DialogTitle>{" "}
    //       {/* add dynamic space name */}
    //       <DialogDescription>Add people to your space</DialogDescription>
    //     </DialogHeader>
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    //         <FormField
    //           control={form.control}
    //           name="people"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Space Name</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   placeholder="email@email.com"
    //                   {...field}
    //                   className="justify-between"
    //                 >
    //                   <Search onClick={() => {}} />
    //                 </Input>
    //               </FormControl>
    //               <FormDescription>
    //                 {" "}
    //                 {/* add dynamic list of people in space */}
    //                 Space people
    //               </FormDescription>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         <Button type="submit">Submit</Button>
    //       </form>
    //     </Form>
    //   </DialogContent>
    // </Dialog>
  );
};
