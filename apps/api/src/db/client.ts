import { drizzle } from 'drizzle-orm/libsql'

const url = process.env.TURSO_DATABASE_URL!
const authToken = process.env.TURSO_AUTH_TOKEN

export const db = drizzle({
  connection: {
    url,
    ...(authToken ? { authToken } : {}),
  },
})
