import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { spaces } from './spaces'
import { nanoid } from 'nanoid'
import { users } from './users'

export const feeds = sqliteTable('feeds', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  spaceId: text('space_id')
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export type Feed = typeof feeds.$inferInsert
