import puppeteer from "puppeteer";
import config from "../config/index.js";

class PdfService {
  constructor() {
    this.browser = null;
  }

  async generatePDF(htmlContent) {
    let browser;

    try {
      console.time("PDF Generation");
      console.log("🔄 Starting PDF generation...");

      browser = await puppeteer.launch({
        headless: config.pdf.headless ? "new" : false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-fonts-cache",
          "--font-render-hinting=none",
          "--disable-font-subpixel-positioning",
        ],
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2,
      });

      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
        timeout: config.pdf.timeout,
      });

      await page.evaluateOnNewDocument(() => {
        document.fonts.ready.then(() => {
          console.log('Fonts loaded');
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("🎨 HTML content loaded, generating PDF...");
      
      const pdf = await page.pdf({
        format: config.pdf.format,
        printBackground: true,
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        scale: 1,
      });

      console.timeEnd("PDF Generation");
      console.log(
        "✅ PDF generated successfully, size:",
        Math.round(pdf.length / 1024),
        "KB"
      );

      return pdf;
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      throw error;
    } finally {
      if (browser) {
        try {
          await browser.close();
          console.log("🔒 Browser closed successfully");
        } catch (closeError) {
          console.error("❌ Error closing browser:", closeError);
        }
      }
    }
  }

  async healthCheck() {
    try {
      const browser = await puppeteer.launch({ 
        headless: config.pdf.headless ? "new" : false,
        args: ["--no-sandbox"] 
      });
      await browser.close();
      
      return {
        status: "healthy",
        service: "PDF Generation",
        puppeteer: "available",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        service: "PDF Generation",
        error: error.message,
      };
    }
  }
}

export default new PdfService();
