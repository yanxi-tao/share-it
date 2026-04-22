import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "~/lib/auth";
import { feedsRoute } from "~/endpoints/feeds";
import { spacesRoute } from "~/endpoints/spaces";
import { usersRoute } from "~/endpoints/users";
import { invitesRoute } from "~/endpoints/invites";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL!,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "DELETE", "PATCH", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use(logger());

// Auth routes — public
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// Session middleware — protects all routes below
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

app.route("/feeds", feedsRoute);
app.route("/spaces", spacesRoute);
app.route("/users", usersRoute);
app.route("/invites", invitesRoute);

export default app;
