import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { generateModifiedResume } from "../services/resume.ai.service.js";
import { renderResumeHtml } from "../services/resumeTemplate.service.js";
import { htmlToPdf } from "../services/pdf.service.js";

export const modifyResume = async (req, res) => {
  try {
    const { jobDescription, selfDescription = "" } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required." });
    }

    // Resume PDF is optional, but at least a resume or a self description is needed
    if (!req.file && !selfDescription.trim()) {
      return res.status(400).json({ message: "Provide a resume PDF or a self description." });
    }

    // 1. Extract text from the uploaded PDF buffer (if any)
    let resumeText = "";
    if (req.file) {
      const pdfData = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
      resumeText = pdfData.text?.trim() || "";

      if (!resumeText && !selfDescription.trim()) {
        return res.status(422).json({ message: "Could not extract text from the uploaded PDF." });
      }
    }

    // 2. Ask the AI for the tailored resume as structured data
    const resume = await generateModifiedResume(resumeText, jobDescription, selfDescription);

    // 3. Structured data -> HTML -> PDF
    const html = renderResumeHtml(resume);
    const pdfBuffer = await htmlToPdf(html);

    const safeName = resume.fullName.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "Resume";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_Resume.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error in modifyResume controller:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
