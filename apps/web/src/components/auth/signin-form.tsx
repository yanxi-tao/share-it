import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInSchema } from "@/lib/schema";
import { SignInSchemaType } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const SignInForm = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchemaType) => {
    console.log(values);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: () => {
          navigate({ to: "/home" });
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <AuthCardWrapper
      headerLabel="Welcome back"
      redirectLabel="Dont have an account? Register here"
      redirectPath="/auth/signup"
      showProvider={!isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="abc@example.com"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending ? (
            <Button className="w-full" disabled={true}>
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : (
            <Button type="submit" className="w-full" disabled={isPending}>
              Login
            </Button>
          )}
        </form>
      </Form>
    </AuthCardWrapper>
  );
};
