import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

console.log('Env: ', process.env.FRONTEND_URL)

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

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
