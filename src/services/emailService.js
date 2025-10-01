import nodemailer from "nodemailer";
import config from "../config/index.js";

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    this.transporter
      .verify()
      .then(() => {
        console.log("✅ Transporter verification successful");
      })
      .catch((err) => {
        console.error("❌ Transporter verification failed:", err);
      });
  }

  async sendEmail({ to, from, subject, body, pdfBase64, filename }) {
    try {
      if (!pdfBase64 || !to || !subject || !body) {
        throw new Error("Missing required fields: to, subject, body, pdfBase64");
      }

      console.time("Prepare Mail Options");

      // Create HTML content with footer
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">New Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${body}</pre>
          </div>
          <p style="margin-top: 20px; color: #666;">
            <strong>Note:</strong> Complete form details are attached as a PDF.
          </p>

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px;">
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="margin: 0; line-height: 1.4;">
              <strong>DO NOT REPLY</strong> to this email address. This mailbox is not monitored.<br>
              For all queries, please contact: <a href="mailto:quotes@artisanuw.com.au" style="color: #0066cc;">quotes@artisanuw.com.au</a>
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: from || "Artisan Proposals (No‑Reply) <noreply@artisanuw.com.au>",
        replyTo: "quotes@artisanuw.com.au",
        to,
        subject: subject || "Your Artisan proposal has been received",
        text: `${body}\\n\\n---\\nDO NOT REPLY to this email address. This mailbox is not monitored.\\nFor all queries, please contact: quotes@artisanuw.com.au`,
        html: htmlContent,
        attachments: [
          {
            filename: filename || "miscellaneous-pi-proposal-form.pdf",
            content: pdfBase64,
            encoding: "base64",
            contentType: "application/pdf",
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("📤 Email sent successfully:", info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.transporter.verify();
      
      return {
        status: "healthy",
        service: "Email",
        configured: !!process.env.EMAIL_USER,
        provider: "gmail",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        service: "Email",
        configured: !!process.env.EMAIL_USER,
        error: error.message,
      };
    }
  }
}

export default EmailService;
