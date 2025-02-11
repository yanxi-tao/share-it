import { z } from 'zod'

export const CreateSpaceSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(5).max(100),
})

export const CreateFeedSchema = z.object({
  userId: z.string(),
  spaceId: z.string(),
  verifiedURL: z.string().url(),
})
