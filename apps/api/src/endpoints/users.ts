import { Hono } from 'hono'
import { db } from '~/db/client'
import { feeds } from '~/db/schema/feeds'
import { type Feed } from '~/db/schema/feeds'
import { eq } from 'drizzle-orm'

export const usersRoute = new Hono()

usersRoute.get('/', async (c) => {
  return c.text('Hello from users')
})

usersRoute.get('/:userId', async (c) => {
  const userId = c.req.param('userId')
  const userFeeds = await db
    .select()
    .from(feeds)
    .where(eq(feeds.authorId, userId))

  return c.json(userFeeds)
})
