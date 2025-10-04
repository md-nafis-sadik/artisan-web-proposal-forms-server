
import fs from "fs";
import EmailService from "../src/services/emailService.js";

async function testEmail() {
  try {
    const emailService = new EmailService();

    // Load or create a small PDF for testing
    const pdfPath = "./demo/test.pdf";

    // If you don't have one, create a simple placeholder file
    if (!fs.existsSync(pdfPath)) {
      fs.writeFileSync(
        pdfPath,
        "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 50 100 Td (Hello, Microsoft Graph!) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000061 00000 n \n0000000112 00000 n \n0000000212 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n300\n%%EOF"
      );
      console.log("✅ Created a sample test.pdf");
    }

    const pdfBase64 = fs.readFileSync(pdfPath).toString("base64");

    const response = await emailService.sendEmail({
      to: "abdudevs@gmail.com", // 👈 Replace this with your test address
      subject: "✅ Test Email via Microsoft Graph API",
      body: "This is a test email sent from Node.js using Microsoft Graph API integration.",
      pdfBase64,
      filename: "test.pdf",
    });

    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

testEmail();
