import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { generateAnalysisReport } from "../services/ai.service.js";
import AnalysisReport from "../models/analysisReport.model.js";

export const generateReport = async (req, res) => {
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

    // 2. Invoke the AI service to generate the analysis report
    const aiReport = await generateAnalysisReport(resumeText, jobDescription, selfDescription);

    // 3. Persist the report to the database
    const savedReport = await AnalysisReport.create({
      user:                req.user.id,
      resumeText,
      selfDescription,
      jobDescription,
      ...aiReport
    });

    return res.status(201).json({
      message: "Analysis report generated successfully.",
      report: savedReport,
    });
  } catch (error) {
    console.error("Error in generateReport controller:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @route  GET /api/report/:id
 * @desc   Fetch a single analysis report by its ID (must belong to the requesting user)
 * @access Protected
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await AnalysisReport.findById(id).lean();

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    // Ensure the report belongs to the authenticated user
    if (report.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. This report belongs to another user." });
    }

    return res.status(200).json({
      message: "Report fetched successfully.",
      report,
    });
  } catch (error) {
    console.error("Error in getReportById controller:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @route  GET /api/report/
 * @desc   Fetch all analysis reports belonging to the authenticated user (newest first)
 * @access Protected
 */
export const getAllReports = async (req, res) => {
  try {
    const reports = await AnalysisReport
      .find({ user: req.user.id })
      .select("_id jobTitle matchScore skillGaps createdAt")  // lightweight list projection
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Reports fetched successfully.",
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error in getAllReports controller:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

