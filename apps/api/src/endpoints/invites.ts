import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/db/client";
import { eq } from "drizzle-orm";
import { Invite, invites } from "~/db/schema/invites";

export const invitesRoute = new Hono();

export const CreateIniviteSchema = z.object({
  inviterId: z.string(),
  guestId: z.string(),
  spaceId: z.string(),
});

invitesRoute.get("/", async (c) => {
  return c.text("Hello from invites");
});

invitesRoute.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const userInvites = await db
    .select()
    .from(invites)
    .where(eq(invites.guestId, userId));

  // console.log(userInvites);

  return c.json(userInvites);
});

invitesRoute.post(
  "/create",
  zValidator("json", CreateIniviteSchema),
  async (c) => {
    const { inviterId, guestId, spaceId } = c.req.valid("json");

    const invite: Invite = {
      inviterId,
      guestId,
      spaceId,
    };

    console.log(invite);

    const [returnId] = await db
      .insert(invites)
      .values(invite)
      .returning({ id: invites.id });

    return c.json(returnId);
  },
);
