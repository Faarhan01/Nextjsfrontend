import dotenv from "dotenv";
dotenv.config();

// Ensure PORT is always 3000 for the platform reverse proxy
process.env.PORT = "3000";
const PORT = 3000;

import express from "express";
import next from "next";
import backendApp from "./backend/src/app.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "./frontend", hostname: "0.0.0.0", port: PORT });
const handle = nextApp.getRequestHandler();

const app = express();

app.use(express.json({ limit: "15mb" }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Connect backend routes under /api
app.use("/api", backendApp);

function createNotFoundInterceptor(res: any, onNotFound: () => void) {
  const chunks: Buffer[] = [];
  let headersSent = false;
  let statusCode = 200;
  const notFoundMarker = 'data-nextjs-not-found';

  const originalWriteHead = res.writeHead.bind(res);
  const originalEnd = res.end.bind(res);
  const originalWrite = res.write.bind(res);
  const originalFlushHeaders = res.flushHeaders ? res.flushHeaders.bind(res) : null;

  function flushToResponse() {
    const body = Buffer.concat(chunks).toString('utf8');
    if (statusCode === 200 && body.includes(notFoundMarker)) {
      statusCode = 404;
      onNotFound();
    }
    originalWriteHead(statusCode);
    for (const chunk of chunks) {
      originalWrite(chunk);
    }
    headersSent = true;
  }

  res.writeHead = function(status: number, ...args: any[]) {
    statusCode = status;
    return res;
  };

  if (originalFlushHeaders) {
    res.flushHeaders = function(...args: any[]) {
      if (!headersSent) {
        return;
      }
      return originalFlushHeaders(...args);
    };
  }

  res.write = function(chunk: any, ...args: any[]): boolean {
    if (!headersSent) {
      if (chunk) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        chunks.push(buf);
      }
      if (chunks.length > 2000000) {
        originalWriteHead(statusCode);
        for (const chunk of chunks) {
          originalWrite(chunk);
        }
        headersSent = true;
      }
      return true;
    }
    return originalWrite(chunk, ...args);
  };

  res.end = function(chunk?: any, ...args: any[]) {
    if (!headersSent) {
      if (chunk) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        chunks.push(buf);
      }
      flushToResponse();
    }
    return originalEnd();
  };
}

async function startServer() {
  await nextApp.prepare();

  app.all(/.*/, async (req, res) => {
    const onNotFound = () => {
      // Next.js 16 App Router doesn't set HTTP 404 status for notFound()
      // This callback allows us to log or handle the override
    };
    createNotFoundInterceptor(res, onNotFound);
    await handle(req, res);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
