import express from "express";
import pdfService from "../services/pdfService.js";
import EmailService from "../services/emailService.js";
import config from "../config/index.js";

const router = express.Router();
const emailService = new EmailService();


router.get("/health", async (req, res) => {
  try {
    const timestamp = new Date().toISOString();

    const healthStatus = {
      status: "healthy",
      timestamp,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        environment: config.server.environment,
      },
      services: {
        pdf: { status: "checking" },
        email: { status: "checking" },
      },
    };

    try {
      const pdfHealth = await pdfService.healthCheck();
      healthStatus.services.pdf = pdfHealth;
    } catch (error) {
      healthStatus.services.pdf = {
        status: "unhealthy",
        error: error.message,
      };
    }

    try {
      const emailHealth = await emailService.healthCheck();
      healthStatus.services.email = emailHealth;
    } catch (error) {
      healthStatus.services.email = {
        status: "unhealthy",
        error: error.message,
      };
    }

    const allServicesHealthy = Object.values(healthStatus.services).every(
      (service) => service.status === "healthy"
    );

    if (!allServicesHealthy) {
      healthStatus.status = "degraded";
    }

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});


router.get("/status", (req, res) => {
  try {
    const status = {
      server: {
        name: "Artisan Proposal Forms Server",
        version: "1.0.0",
        environment: config.server.environment,
        port: config.server.port,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node: process.version,
      },
      configuration: {
        pdf: {
          headless: config.pdf.headless,
          timeout: config.pdf.timeout,
          format: config.pdf.format,
        },
        email: {
          configured: !!config.email.user,
          service: config.email.service,
        },
      },
      endpoints: [
        {
          method: "POST",
          path: "/api/generate-pdf",
          description: "Generate PDF from form data",
        },
        {
          method: "GET",
          path: "/api/test-pdf",
          description: "Generate test PDF",
        },
        { method: "POST", path: "/api/send-email", description: "Send email" },
        { method: "GET", path: "/api/health", description: "Health check" },
        { method: "GET", path: "/api/status", description: "System status" },
      ],
    };

    res.json(status);
  } catch (error) {
    console.error("Status endpoint error:", error);
    res.status(500).json({
      error: "Failed to get system status",
      details: error.message,
    });
  }
});


router.get("/config", (req, res) => {
  try {
    const safeConfig = {
      server: {
        port: config.server.port,
        environment: config.server.environment,
        corsOrigin: config.server.corsOrigin,
        frontendUrl: config.server.frontendUrl,
      },
      pdf: {
        headless: config.pdf.headless,
        timeout: config.pdf.timeout,
        format: config.pdf.format,
      },
      email: {
        service: config.email.service,
        configured: !!config.email.user,
      },
    };

    res.json(safeConfig);
  } catch (error) {
    console.error("Config endpoint error:", error);
    res.status(500).json({
      error: "Failed to get configuration",
      details: error.message,
    });
  }
});

export default router;
