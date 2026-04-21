import app from "../apps/api/dist/server.js";

export default (req: Request) => app.fetch(req);
