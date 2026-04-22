import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../apps/api/dist/server.js";

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? "localhost";
  const url = `https://${host}${req.url ?? "/"}`;

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (val === undefined) continue;
    if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
    else headers.set(key, val);
  }

  const method = req.method ?? "GET";
  let body: Buffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await readBody(req);
  }

  const request = new Request(url, {
    method,
    headers,
    body: body && body.length > 0 ? body : undefined,
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((val, key) => res.setHeader(key, val));

  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}
