import { z } from 'zod'

import { CreateSpaceSchema, CreateFeedSchema } from '@/lib/schema'

export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>

export type CreateFeedSchemaType = z.infer<typeof CreateFeedSchema>
