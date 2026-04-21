import { handle } from "@vercel/hono";
import app from "../apps/api/src/server";

export default handle(app);