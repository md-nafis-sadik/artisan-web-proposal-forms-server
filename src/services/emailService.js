import "dotenv/config";
import fetch from "node-fetch";

class EmailService {
  constructor() {
    this.token = null;
    this.tokenExpiry = 0;
    this.TENANT_ID = process.env.AZURE_TENANT_ID;
    this.CLIENT_ID = process.env.AZURE_CLIENT_ID;
    this.CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
    this.MAILBOX = process.env.MAILBOX || "noreply@artisanuw.com.au";
  }

  /**
   * Get or refresh Microsoft Graph token
   */
  async getGraphToken() {
    const now = Date.now();

    if (this.token && now < this.tokenExpiry) {
      return this.token;
    }

    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    const res = await fetch(
      `https://login.microsoftonline.com/${this.TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    const json = await res.json();
    if (!json.access_token)
      throw new Error(`Token error: ${JSON.stringify(json)}`);

    this.token = json.access_token;
    this.tokenExpiry = now + json.expires_in * 1000 - 60 * 1000; // buffer 1 min

    return this.token;
  }

  /**
   * Send an email with optional PDF attachment
   */
  async sendEmail({ to, from, subject, body, pdfBase64, filename }) {
    if (!pdfBase64 || !to || !subject || !body) {
      throw new Error("Missing required fields: to, subject, body, pdfBase64");
    }

    console.time("Prepare Mail Options");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${body}</pre>
        </div>
        <p style="margin-top: 20px; color: #666;">
          <strong>Note:</strong> Complete form details are attached as a PDF.
        </p>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px;">
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="margin: 0; line-height: 1.4;">
            <strong>DO NOT REPLY</strong> to this email address. This mailbox is not monitored.<br>
            For all queries, please contact:
            <a href="mailto:quotes@artisanuw.com.au" style="color: #0066cc;">quotes@artisanuw.com.au</a>
          </p>
        </div>
      </div>
    `;

    const payload = {
      message: {
        subject: subject || "Your Artisan proposal has been received",
        body: {
          contentType: "HTML",
          content: htmlContent,
        },
        toRecipients: [{ emailAddress: { address: to } }],
        from: { emailAddress: { address: from || this.MAILBOX } },
        replyTo: [{ emailAddress: { address: "quotes@artisanuw.com.au" } }],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: filename || "miscellaneous-pi-proposal-form.pdf",
            contentType: "application/pdf",
            contentBytes: pdfBase64,
          },
        ],
      },
      saveToSentItems: true,
    };

    const token = await this.getGraphToken();

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
        this.MAILBOX
      )}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Graph sendMail failed: ${res.status} ${errText}`);
    }

    console.timeEnd("Prepare Mail Options");
    console.log("📤 Email sent successfully via Microsoft Graph");

    return {
      success: true,
      message: "Email sent successfully via Microsoft Graph",
    };
  }

  /**
   * Simple health check (verifies token)
   */
  async healthCheck() {
    try {
      const token = await this.getGraphToken();
      return {
        status: "healthy",
        service: "Email",
        provider: "Microsoft Graph",
        configured: !!token,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        service: "Email",
        provider: "Microsoft Graph",
        error: error.message,
      };
    }
  }
}

export default EmailService;
