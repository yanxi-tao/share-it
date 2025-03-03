// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   // DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { CreatePeopleSchema } from "@/lib/schema";
// import { CreatePeopleSchemaType } from "@/lib/types";
// import { useNavigate } from "@tanstack/react-router";
// import { Plus } from "lucide-react";

// const apiUrl = import.meta.env.VITE_API_URL;

// export const AddPeopleForm = ({ spaceId }: { spaceId: string }) => {
//   const navigate = useNavigate();
//   const form = useForm<CreatePeopleSchemaType>({
//     resolver: zodResolver(CreatePeopleSchema),
//     defaultValues: {
//       spaceId: spaceId,
//       people: [""],
//     },
//   });

//   const { data, error, isLoading } = useQuery({
//     queryKey: ["feeds"], //, session?.data?.id
//     queryFn: async () => {
//       const response = await fetch(`${apiUrl}/users/`); //${apiUrl}/users/${session?.user?.id}/feeds
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     },
//     enabled: !!session?.user?.id, // Only run the query if session.data.id is available
//   });

//   const mutation = useMutation({
//     mutationFn: (values: CreateSpaceSchemaType) => {
//       return fetch(`${apiUrl}/spaces/add/${spaceId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: values.name,
//           description: values.description,
//         }),
//       });
//     },
//     onSuccess: async (data) => {
//       const response = await data.json();
//       navigate({ to: `/space/${response.id}` });
//     },
//   });

//   function onSubmit(values: CreateSpaceSchemaType) {
//     console.log(values);
//     mutation.mutate(values);
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button type="submit" variant="ghost" size="icon" className="-m-1">
//           <Plus className="" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Wanna create some spacey</DialogTitle>
//           <DialogDescription>
//             Create a new space to share with your friends
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Space Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="some namy" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     This is your space's public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Space Description</FormLabel>
//                   <FormControl>
//                     <Input placeholder="some descriptionnnn" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     wanna explain what this space is about?
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Submit</Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };
