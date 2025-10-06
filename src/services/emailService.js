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
  async sendEmail({ to, from, subject, name, body, pdfBase64, filename }) {
    if (!pdfBase64 || !to || !subject || !body) {
      throw new Error("Missing required fields: to, subject, body, pdfBase64");
    }

    console.time("Prepare Mail Options");

    const htmlContent = `
    <div>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(90deg, #ED09FE 0%, #189AFE 100%); height: 4px;"></div>
              <div style="background: white; padding: 40px 30px; display: table; width: 100%; box-sizing: border-box;">
                  <div style="display: table-cell; vertical-align: middle; width: 200px;">
                      <img src="https://artisan.quickdraw.tech/assets/pdfLogo.png" class="w-[140px] h-auto" alt="Background Logo" />
                  </div>
                  <div style="display: table-cell; vertical-align: middle; text-align: right; padding-left: 20px;">
                      <h1 style="margin: 0 0 5px 0; font-size: 24px; font-weight: bold; color: #333;">Successfully Submitted
                      </h1>
                      <p style="margin: 0; font-size: 14px; color: #666;">Your proposal form has been submitted</p>
                  </div>
              </div>
              <div style="background: white; padding: 30px; border-top: 1px solid #e0e0e0;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">Hi ${name}!</h2>
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; line-height: 1.6;">
                      Thanks for completing the proposal form!
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                      Our team has received and we will be in touch shortly!
                  </p>
              </div>
              
          </div>
          <div style="margin-top: 40px; padding: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
                  <p style="margin-top: 20px; color: #666; font-size: 14px;">
                      <strong>Note:</strong> Complete form details are attached as a PDF.
                  </p>
                  <p style="margin: 0; line-height: 1.4;">
                      <strong>DO NOT REPLY</strong> to this email address. This mailbox is not monitored.<br>
                      For all queries, please contact:
                      <a href="mailto:quotes@artisanuw.com.au"
                          style="color: #189AFE; text-decoration: none;">quotes@artisanuw.com.au</a>
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
            name: filename || "proposal-form.pdf",
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
