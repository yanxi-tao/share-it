import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "~/lib/auth";
import { db } from "~/db/client";
import { sql } from "drizzle-orm";
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

console.log("Frontend URL: ", process.env.FRONTEND_URL);

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

// Diagnostic routes
app.get("/api/test", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/test-db", async (c) => {
  const url = process.env.TURSO_DATABASE_URL ?? "(not set)";
  const token = process.env.TURSO_AUTH_TOKEN ?? "(not set)";
  const tokenLen = token.length;
  const hasTrailingSpace = token !== token.trimEnd();
  const tokenPreview = token === "(not set)" ? token : token.slice(0, 8) + "..." + token.slice(-4);
  try {
    console.log("[test-db] url:", url, "tokenLen:", tokenLen, "hasTrailingSpace:", hasTrailingSpace);
    await db.run(sql`SELECT 1`);
    console.log("[test-db] DB query succeeded");
    return c.json({ ok: true, url, tokenPreview, tokenLen, hasTrailingSpace });
  } catch (e) {
    console.error("[test-db] DB query failed:", e);
    return c.json({ error: String(e), url, tokenPreview, tokenLen, hasTrailingSpace }, 500);
  }
});

app.get("/api/test-db-lazy", async (c) => {
  const { createClient: createClientHttp } = await import("@libsql/client/http");
  const { drizzle: drizzleFresh } = await import("drizzle-orm/libsql");
  const { sql: sqlFresh } = await import("drizzle-orm");
  const url = (process.env.TURSO_DATABASE_URL ?? "").replace(/^libsql:\/\//, "https://");
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const freshClient = createClientHttp({ url, authToken });
  const freshDb = drizzleFresh(freshClient);
  try {
    await freshDb.run(sqlFresh`SELECT 1`);
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

app.get("/api/test-fetch", async (c) => {
  const rawUrl = process.env.TURSO_DATABASE_URL ?? "";
  const token = (process.env.TURSO_AUTH_TOKEN ?? "").trimEnd();
  const url = rawUrl.replace(/^libsql:\/\//, "https://");
  try {
    const res = await fetch(`${url}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        requests: [{ type: "execute", stmt: { sql: "SELECT 1" } }, { type: "close" }],
      }),
    });
    const text = await res.text();
    return c.json({ status: res.status, body: text.slice(0, 300) });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.post("/api/test-body", async (c) => {
  try {
    const body = await c.req.json();
    return c.json({ ok: true, body });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  console.log("[auth] handler start, method:", c.req.method, "url:", c.req.url);
  const res = await auth.handler(c.req.raw);
  console.log("[auth] handler done, status:", res.status);
  return res;
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/feeds", feedsRoute);
app.route("/spaces", spacesRoute);
app.route("/users", usersRoute);
app.route("/invites", invitesRoute);

export default app;
