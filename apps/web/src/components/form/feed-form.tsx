import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFeedSchemaType } from "@/lib/types";
import { CreateFeedSchema } from "@/lib/schema";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { s } from "node_modules/better-auth/dist/index-Y--3ocl8";

const apiUrl = import.meta.env.VITE_API_URL;

export const FeedForm = ({
  userId,
  spaceId,
  search,
  setSearch,
}: {
  userId: string;
  spaceId: string;
  search: string;
  setSearch: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const form = useForm<CreateFeedSchemaType>({
    resolver: zodResolver(CreateFeedSchema),
    defaultValues: {
      userId: userId,
      spaceId: spaceId,
      verifiedURL: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateFeedSchemaType) => {
      return fetch(`${apiUrl}/feeds/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          spaceId,
          verifiedURL: values.verifiedURL,
        }),
      });
    },
    //onSuccess: () => navigate({to: '/some_url'}), // need to add a route for this
  });

  function onSubmit(values: CreateFeedSchemaType) {
    console.log(values);
    mutation.mutate(values);
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["spaces"], //, session?.data?.id
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/users/${userId}/spaces`); //${apiUrl}/users/${session?.user?.id}/spaces
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verifiedURL"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Link URL</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="New Link or Search"
                  {...field}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {spaceId == "" ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? data.find((item) => item.value === value)?.label
                  : "Select Space..."}
                {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Spaces..." />
                <CommandList>
                  <CommandEmpty>No Space found.</CommandEmpty>
                  <CommandGroup>
                    {isLoading ? (
                      <CommandItem>Loading...</CommandItem>
                    ) : error ? (
                      <CommandItem>Error loading spaces</CommandItem>
                    ) : data ? (
                      data.map((ele: any) => (
                        <CommandItem
                          key={ele.id}
                          value={ele.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          {ele.name}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem>No spaces available</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <></>
        )}
        <Button type="submit">Add Link</Button>
      </form>
    </Form>
  );
};
