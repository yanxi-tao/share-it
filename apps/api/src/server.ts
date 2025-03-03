import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from '~/lib/auth'
import { feedsRoute } from '~/endpoints/feeds'
import { spacesRoute } from '~/endpoints/spaces'
import { usersRoute } from '~/endpoints/users'
import { invitesRoute } from '~/endpoints/invites'
import { authInjection } from '~/lib/middleware'

const app = new Hono()

console.log('Frontend URL: ', process.env.FRONTEND_URL)

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL!,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

app.use(logger())

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(authInjection)

app.route('/feeds', feedsRoute)
app.route('/spaces', spacesRoute)
app.route('/users', usersRoute)
app.route('/invites', invitesRoute)

export default app
