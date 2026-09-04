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

async function startServer() {
  await nextApp.prepare();

  app.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
