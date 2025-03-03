import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { users } from "./users";
import { spaces } from "./spaces";

export const invites = sqliteTable("invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  guestId: text("guest_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  spaceId: text("space_id")
    .notNull()
    .references(() => spaces.id, { onDelete: "cascade" }),
});

export type Invite = typeof invites.$inferInsert;
