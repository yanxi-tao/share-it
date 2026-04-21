import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/http'

function createDb() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!.replace(/^libsql:\/\//, 'https://'),
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return drizzle(client)
}

let _db: ReturnType<typeof createDb> | undefined

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    if (!_db) _db = createDb()
    return (_db as any)[prop]
  },
})
