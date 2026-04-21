import { getRequestListener } from "@hono/node-server";
import app from "../apps/api/dist/server.js";

export default getRequestListener(app.fetch);
