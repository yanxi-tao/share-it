import { createMiddleware } from "hono/factory";
import { auth } from "./auth";

// export const authInjection = createMiddleware(async (c, next) => {
//   const session = await auth.api.getSession({
//     headers: c.req.raw.headers,
//   });

//   console.log("api session", JSON.stringify(c.req.raw.headers));

//   // if (!session) {
//   //   c.set("user", null);
//   //   c.set("session", null);
//   //   return c.json({ error: "Unauthorized" }, { status: 401 });
//   // }

//   // c.set("user", session.user);
//   // c.set("session", session.session);
//   await next();
// });
