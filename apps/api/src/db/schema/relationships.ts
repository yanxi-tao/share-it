import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { spaces } from "./spaces";
import { feeds } from "./feeds";
import { invites } from "./invites";

export const usersRelations = relations(users, ({ many }) => ({
  feeds: many(feeds),
  invitesIssued: many(invites),
  invitesReceived: many(invites),
  membersToSpaces: many(membersToSpaces),
}));

export const spacesRelations = relations(spaces, ({ many }) => ({
  invites: many(invites),
  membersToSpaces: many(membersToSpaces),
}));

export const feedsRelations = relations(feeds, ({ one }) => ({
  space: one(spaces, {
    fields: [feeds.spaceId],
    references: [spaces.id],
  }),
  author: one(users, {
    fields: [feeds.authorId],
    references: [users.id],
  }),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  inviter: one(users, {
    fields: [invites.inviterId],
    references: [users.id],
  }),
  guest: one(users, {
    fields: [invites.guestId],
    references: [users.id],
  }),
  space: one(spaces, {
    fields: [invites.spaceId],
    references: [spaces.id],
  }),
}));

export const membersToSpaces = sqliteTable(
  "members_to_spaces",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => users.id),
    spaceId: text("space_id")
      .notNull()
      .references(() => spaces.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.spaceId] }),
  }),
);

export const usersToSpacesRelations = relations(membersToSpaces, ({ one }) => ({
  member: one(users, {
    fields: [membersToSpaces.memberId],
    references: [users.id],
  }),
  space: one(spaces, {
    fields: [membersToSpaces.spaceId],
    references: [spaces.id],
  }),
}));
