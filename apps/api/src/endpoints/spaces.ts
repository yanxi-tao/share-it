import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/db/client";
import { eq } from "drizzle-orm";
import { spaces } from "~/db/schema/spaces";
import { feeds } from "~/db/schema/feeds";
import { users } from "~/db/schema/users";
import { membersToSpaces } from "~/db/schema/relationships";
import { type Space } from "~/db/schema/spaces";

export const spacesRoute = new Hono();

export const CreateSpaceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
});

export const UpdateSpaceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

spacesRoute.get("/", async (c) => {
  return c.text("Hello from spaces");
});

spacesRoute.get("/:spaceId", async (c) => {
  const spaceId = c.req.param("spaceId");
  const spaceData = await db
    .select()
    .from(spaces)
    .where(eq(spaces.id, spaceId));

  if (spaceData.length === 0) {
    return c.json({ error: "Space not found" }, 404);
  }

  const spaceFeeds = await db
    .select()
    .from(feeds)
    .where(eq(feeds.spaceId, spaceId));

  return c.json({
    ...spaceData[0],
    feeds: spaceFeeds,
  });
});

spacesRoute.post(
  "/create",
  zValidator("json", CreateSpaceSchema),
  async (c) => {
    const { name, description, ownerId } = c.req.valid("json");

    const space: Space = {
      name,
      description: description || null,
      ownerId,
    };

    const [returnId] = await db
      .insert(spaces)
      .values(space)
      .returning({ id: spaces.id });

    return c.json(returnId);
  },
);

spacesRoute.patch(
  "/:spaceId",
  zValidator("json", UpdateSpaceSchema),
  async (c) => {
    const spaceId = c.req.param("spaceId");
    const updates = c.req.valid("json");

    await db.update(spaces).set(updates).where(eq(spaces.id, spaceId));

    const updated = await db.select().from(spaces).where(eq(spaces.id, spaceId));

    return c.json(updated[0]);
  },
);

spacesRoute.delete("/:spaceId", async (c) => {
  const spaceId = c.req.param("spaceId");

  await db.delete(feeds).where(eq(feeds.spaceId, spaceId));
  await db.delete(spaces).where(eq(spaces.id, spaceId));

  return c.json({ success: true });
});

spacesRoute.get("/:spaceId/members", async (c) => {
  const spaceId = c.req.param("spaceId");

  const [space] = await db
    .select()
    .from(spaces)
    .where(eq(spaces.id, spaceId));

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(membersToSpaces)
    .innerJoin(users, eq(membersToSpaces.memberId, users.id))
    .where(eq(membersToSpaces.spaceId, spaceId));

  const owner = space?.ownerId ? await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, space.ownerId)) : [];

  const membersWithOwner = [
    ...owner.map(m => ({ ...m, isOwner: true })),
    ...members.filter(m => m.id !== space?.ownerId).map(m => ({ ...m, isOwner: false })),
  ];

  return c.json(membersWithOwner);
});

spacesRoute.delete("/:spaceId/members/:memberId", async (c) => {
  const { spaceId, memberId } = c.req.param();

  await db
    .delete(membersToSpaces)
    .where(eq(membersToSpaces.memberId, memberId));

  return c.json({ success: true });
});
