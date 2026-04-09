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

export const UpdateFeedSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

feedsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const feed = await db.select().from(feeds).where(eq(feeds.id, id))

  return c.json(feed[0])
})

feedsRoute.post('/create', zValidator('json', CreateFeedSchema), async (c) => {
  const { userId, spaceId, verifiedURL } = c.req.valid('json')
  
  let preview = { title: 'Untitled', description: null, open_graph: { images: [] } }
  
  try {
    preview = await unfurl(verifiedURL)
  } catch (error) {
    console.log('Failed to fetch link preview:', error)
  }

  const feed: Feed = {
    title: preview.title || 'Untitled',
    description: preview.description,
    url: verifiedURL,
    imageUrl: preview.open_graph?.images?.[0]?.url,
    spaceId,
    authorId: userId,
  }

  await db.insert(feeds).values(feed)

  return c.json({ ...feed })
})

feedsRoute.patch('/:id', zValidator('json', UpdateFeedSchema), async (c) => {
  const id = c.req.param('id')
  const updates = c.req.valid('json')

  await db.update(feeds).set(updates).where(eq(feeds.id, id))

  const updated = await db.select().from(feeds).where(eq(feeds.id, id))

  return c.json(updated[0])
})

feedsRoute.delete('/:id', async (c) => {
  const id = c.req.param('id')

  await db.delete(feeds).where(eq(feeds.id, id))

  return c.json({ success: true })
})
