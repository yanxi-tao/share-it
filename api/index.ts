import { handle } from "@vercel/hono";
import app from "../apps/api/src/server";

export default handle(app);

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

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/feeds", feedsRoute);
app.route("/spaces", spacesRoute);
app.route("/users", usersRoute);
app.route("/invites", invitesRoute);

export default handle(app);
