import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { unfurl } from 'unfurl.js'
import { db } from '~/db/client'
import { feeds } from '~/db/schema/feeds'
import { type Feed } from '~/db/schema/feeds'
import { eq } from 'drizzle-orm'

export const feedsRoute = new Hono()

export const CreateFeedSchema = z.object({
  userId: z.string(),
  spaceId: z.string(),
  verifiedURL: z.string(),
})

feedsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const feed = await db.select().from(feeds).where(eq(feeds.id, id))

  return c.json(feed[0])
})

feedsRoute.post('/create', zValidator('json', CreateFeedSchema), async (c) => {
  const { userId, spaceId, verifiedURL } = c.req.valid('json')
  const preview = await unfurl(verifiedURL)

  const feed: Feed = {
    title: preview.title || 'test',
    description: preview.description,
    url: verifiedURL,
    imageUrl: preview.open_graph?.images?.[0]?.url,
    spaceId,
    authorId: userId,
  }

  console.log(feed)

  await db.insert(feeds).values(feed)

  return c.json({ ...feed })
})
