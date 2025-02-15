import { z } from 'zod'

import {
  CreateSpaceSchema,
  CreateFeedSchema,
  SignInSchema,
  SignUpSchema,
} from '@/lib/schema'

export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>

export type CreateFeedSchemaType = z.infer<typeof CreateFeedSchema>

export type SignInSchemaType = z.infer<typeof SignInSchema>

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
