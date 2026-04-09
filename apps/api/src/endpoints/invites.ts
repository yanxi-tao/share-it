import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "~/db/client";
import { eq } from "drizzle-orm";
import { Invite, invites } from "~/db/schema/invites";
import { membersToSpaces } from "~/db/schema/relationships";

export const invitesRoute = new Hono();

export const CreateIniviteSchema = z.object({
  inviterId: z.string(),
  guestId: z.string(),
  spaceId: z.string(),
});

export const ResponseInviteSchema = z.object({
  inviteId: z.string(),
  spaceId: z.string(),
  response: z.boolean(),
});

invitesRoute.get("/", async (c) => {
  return c.text("Hello from invites");
});

invitesRoute.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const { spaces } = await import("~/db/schema/spaces");
  const { users } = await import("~/db/schema/users");
  
  const userInvites = await db
    .select({
      id: invites.id,
      spaceId: invites.spaceId,
      inviterId: invites.inviterId,
      spaceName: spaces.name,
      inviterName: users.name,
    })
    .from(invites)
    .leftJoin(spaces, eq(invites.spaceId, spaces.id))
    .leftJoin(users, eq(invites.inviterId, users.id))
    .where(eq(invites.guestId, userId));

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

invitesRoute.post(
  "/response",
  zValidator("json", ResponseInviteSchema),
  async (c) => {
    const { inviteId, spaceId, response } = c.req.valid("json");

    const [invite] = await db
      .select()
      .from(invites)
      .where(eq(invites.id, inviteId));

    await db.delete(invites).where(eq(invites.id, inviteId));

    if (response && invite) {
      await db.insert(membersToSpaces).values({
        memberId: invite.guestId,
        spaceId,
      });
    }

    return c.json({ success: true });
  },
);
