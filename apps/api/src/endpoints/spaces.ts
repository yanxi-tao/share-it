import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/db/client";
import { eq } from "drizzle-orm";
import { spaces } from "~/db/schema/spaces";
import { type Space } from "~/db/schema/spaces";
import { feeds } from "~/db/schema/feeds";

export const spacesRoute = new Hono();

export const CreateSpaceSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  ownerId: z.string(),
});

spacesRoute.get("/", async (c) => {
  return c.text("Hello from spaces");
});

spacesRoute.get("/:spaceId", async (c) => {
  const spaceId = c.req.param("spaceId");
  const spaceFeeds = await db
    .select()
    .from(feeds)
    .where(eq(feeds.spaceId, spaceId));

  return c.json(spaceFeeds);
});

spacesRoute.post(
  "/create",
  zValidator("json", CreateSpaceSchema),
  async (c) => {
    const { name, description, ownerId } = c.req.valid("json");

    const space: Space = {
      name,
      description,
      ownerId,
    };

    console.log(space);

    const [returnId] = await db
      .insert(spaces)
      .values(space)
      .returning({ id: spaces.id });

    return c.json(returnId);
  },
);
