import { Hono } from 'hono'
import { db } from '~/db/client'
import { feeds } from '~/db/schema/feeds'
import { eq } from 'drizzle-orm'
import { spaces } from '~/db/schema/spaces'
import { users } from '~/db/schema/users'

export const usersRoute = new Hono()

usersRoute.get('/', async (c) => {
  return c.text('Hello from users')
})

usersRoute.get('/:userEmail/search', async (c) => {
  const userEmail = c.req.param('userEmail')
  const user = await db.select().from(users).where(eq(users.email, userEmail))
  return c.json(user)
})

usersRoute.get('/:userId', async (c) => {
  const userId = c.req.param('userId')
  const userFeeds = await db
    .select()
    .from(feeds)
    .where(eq(feeds.authorId, userId))

  return c.json(userFeeds)
})

usersRoute.get('/:userId/spaces', async (c) => {
  const userId = c.req.param('userId')
  const userSpaces = await db
    .select()
    .from(spaces)
    .where(eq(spaces.ownerId, userId))

  return c.json(userSpaces)
})
