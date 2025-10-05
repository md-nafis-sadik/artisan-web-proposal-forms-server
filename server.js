import "./src/config/env.js";

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import config from "./src/config/index.js";

import pdfRoutes from "./src/routes/pdfRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";
import healthRoutes from "./src/routes/healthRoutes.js";

const app = express();
const port = config.server.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: config.server.corsOrigin,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/src", express.static(path.join(__dirname, "src")));

app.use("/api", pdfRoutes);
app.use("/api", emailRoutes);
app.use("/api", healthRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Artisan Proposal Forms Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      status: "/api/status",
      config: "/api/config",
      generatePdf: "POST /api/generate-pdf",
      testPdf: "/api/test-pdf",
      sendEmail: "POST /api/send-email",
    },
  });
});

app.use((error, req, res, next) => {
  console.error("❌ Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details:
      config.server.environment === "development" ? error.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${config.server.environment}`);
  console.log(
    `📧 Email service: ${config.email.user ? "configured" : "not configured"}`
  );
  console.log(`📄 PDF service: available`);
  console.log(`🔗 Test PDF: http://localhost:${port}/api/test-pdf`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
});