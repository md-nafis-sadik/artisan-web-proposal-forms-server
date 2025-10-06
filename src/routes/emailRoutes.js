import express from "express";
import EmailService from "../services/emailService.js";

const router = express.Router();
const emailService = new EmailService();


router.post("/send-email", async (req, res) => {
  try {
    const { to, from, subject, name, body, pdfBase64, filename } = req.body;

    if (!pdfBase64 || !to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["to", "subject", "body", "pdfBase64"],
      });
    }

    res.status(200).json({
      success: true,
      message: "Email request received. Sending in background...",
    });

    await emailService.sendEmail({
      to,
      from,
      subject,
      body,
      name,
      pdfBase64,
      filename,
    });

  } catch (error) {
    console.error("❌ Error in email endpoint:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Email sending failed",
        details: error.message,
      });
    }
  }
});

export default router;