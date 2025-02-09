import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { unfurl } from 'unfurl.js'
import { db } from '~/db/client'
import { spaces } from '~/db/schema/spaces'
import { type Space } from '~/db/schema/spaces'

export const spacesRoute = new Hono()

export const createSpaceSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  ownerId: z.string(),
})

spacesRoute.get('/', async (c) => {
  return c.text('Hello from spaces')
})

spacesRoute.post(
  '/create',
  zValidator('json', createSpaceSchema),
  async (c) => {
    const { name, description, ownerId } = c.req.valid('json')

    const space: Space = {
      name,
      description,
      ownerId,
    }

    console.log(space)

    await db.insert(spaces).values(space)

    return c.json({ ...space })
  }
)
