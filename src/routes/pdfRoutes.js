import express from "express";
import pdfService from "../services/pdfService.js";
import { generateTailwindHTML } from "../templates/templateManager.js";
import { piProposalFormTemplate } from "../templates/piTemplate.js";
import { accountantFormTemplate } from "../templates/accountantTemplate.js";
import { techConsultFormTemplate } from "../templates/technConsultTemplate.js";
import { recruitLabourFormTemplate } from "../templates/recruitLabourTemplate.js";
import { realEstateAgentsFormTemplate } from "../templates/realEstateAgentsTemplate.js";

const router = express.Router();

router.post("/generate-pdf", async (req, res) => {
  try {
    console.log("PDF generation request received");

    const { formData, type } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: "Missing formData in request body",
      });
    }

    let htmlContent = "";

    if (type === "pi") {
      htmlContent = piProposalFormTemplate(formData);
    } else if (type === "accountant") {
      htmlContent = accountantFormTemplate(formData);
    } else if (type === "techConsult") {
      htmlContent = techConsultFormTemplate(formData);
    } else if (type === "recruitLabour") {
      htmlContent = recruitLabourFormTemplate(formData);
    } else if (type === "realEstateAgents") {
      htmlContent = realEstateAgentsFormTemplate(formData);
    }

    if (!htmlContent || htmlContent.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Failed to generate HTML content",
      });
    }

    const pdfBuffer = await pdfService.generatePDF(htmlContent);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate PDF",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="proposal-form.pdf"'
    );

    res.send(pdfBuffer);

    console.log("PDF generated and sent successfully");
  } catch (error) {
    console.error("Error in PDF generation:", error);
    res.status(500).json({
      success: false,
      error: "PDF generation failed",
      details: error.message,
    });
  }
});

router.get("/test-pdf", async (req, res) => {
  try {
    console.log("Test PDF generation request received");

    const testData = {
      step1: {
        brokerName: "Test Broker",
        brokerCompany: "Test Company",
        brokerPhone: "1234567890",
        clientName: "Test Client",
        clientEmail: "test@example.com",
        clientPhone: "0987654321",
        dutyOfDisclosure: true,
        claimsMadePolicy: true,
        retroactiveDate: true,
        subrogation: true,
        privacyNotice: true,
      },
      step2: {},
    };

    const htmlContent = generateTailwindHTML(testData);
    const pdfBuffer = await pdfService.generatePDF(htmlContent);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="test-proposal.pdf"'
    );

    res.send(pdfBuffer);

    console.log("Test PDF generated successfully");
  } catch (error) {
    console.error("Error in test PDF generation:", error);
    res.status(500).json({
      success: false,
      error: "Test PDF generation failed",
      details: error.message,
    });
  }
});

export default router;
