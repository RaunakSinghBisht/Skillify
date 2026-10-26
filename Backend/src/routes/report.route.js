import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { handleUpload } from "../middlewares/file.middleware.js";
import { generateReport, getReportById, getAllReports } from "../controllers/report.controller.js";

const reportRoutes = Router();

/**
 * @route  POST /api/report/generate
 * @desc   Upload a resume PDF + job description, run AI analysis, save & return the report
 * @access Protected
 */
reportRoutes.post("/generate", authMiddleware, handleUpload, generateReport);

/**
 * @route  GET /api/report/
 * @desc   Fetch all analysis reports for the authenticated user (newest first, lightweight projection)
 * @access Protected
 */
reportRoutes.get("/", authMiddleware, getAllReports);

/**
 * @route  GET /api/report/:id
 * @desc   Fetch a single report by its MongoDB ObjectId (must belong to requesting user)
 * @access Protected
 */
reportRoutes.get("/:id", authMiddleware, getReportById);

export default reportRoutes;
