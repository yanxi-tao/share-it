import { handle } from "@vercel/hono";
import app from "../apps/api/dist/server.js";

export default handle(app);
