const getConfig = () => ({
  server: {
    port: process.env.PORT || 3001,
    environment: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    frontendUrl: process.env.FRONTEND_BASE_URL || "http://localhost:3000",
    serverUrl: process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
  },
  email: {
    service: "gmail",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pdf: {
    headless: process.env.PDF_HEADLESS !== "false",
    timeout: parseInt(process.env.PDF_TIMEOUT) || 30000,
    format: process.env.PDF_FORMAT || "A4",
  },
});

export default getConfig();