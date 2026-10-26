import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { handleUpload } from "../middlewares/file.middleware.js";
import { modifyResume } from "../controllers/resume.controller.js";

const resumeRoutes = Router();

/**
 * @route  POST /api/resume/modify
 * @desc   Upload a resume PDF (optional) + job description + self description, tailor the resume with AI and return it as a PDF
 * @access Protected
 */
resumeRoutes.post("/modify", authMiddleware, handleUpload, modifyResume);

export default resumeRoutes;
