import { z } from "zod";

export const CreateSpaceSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export const CreateFeedSchema = z.object({
  userId: z.string(),
  spaceId: z.string(),
  verifiedURL: z
    .string()
    .transform((url) => (url.includes("://") ? url : `https://${url}`))
    .pipe(z.string().url()),
});

export const SignUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }).min(5),
    password: z.string().min(5),
    repassword: z.string(),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"], // Set the path of the error to the repassword field
  });

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(5),
  password: z.string(),
});

export const CreatePeopleSchema = z.object({
  spaceId: z.string(),
  people: z.string().array().min(1),
});
