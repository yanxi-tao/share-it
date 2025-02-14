import { z } from 'zod'

import {
  CreateSpaceSchema,
  CreateFeedSchema,
  CreateSignInSchema,
  CreateSignUpSchema,
} from '@/lib/schema'

export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>

export type CreateFeedSchemaType = z.infer<typeof CreateFeedSchema>

export type CreateSignUpSchemaType = z.infer<typeof CreateSignUpSchema>

export type CreateSignInSchemaType = z.infer<typeof CreateSignInSchema>
