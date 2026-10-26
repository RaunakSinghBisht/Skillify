import mongoose from "mongoose";

// Sub-schema for tech/behavioral questions
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    intension: { type: String, required: true, trim: true },
    answer:    { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// Sub-schema for skill gaps
const skillGapSchema = new mongoose.Schema(
  {
    skill:    { type: String, required: true, trim: true },
    severity: { type: String, enum: ["low", "med", "high"], required: true },
  },
  { _id: false }
);

// Sub-schema for prep plan
const prepPlanSchema = new mongoose.Schema(
  {
    dayNo:  { type: Number, required: true, min: 1 },
    topic:  { type: String, required: true, trim: true },
    tasks:  { type: [String], default: [] },
  },
  { _id: false }
);

// Main Analysis Report schema
const analysisReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText:      { type: String, default: "" },
    selfDescription: { type: String, trim: true, default: "" },
    jobDescription:  { type: String, required: true },
    matchScore:      { type: Number, required: true, min: 0, max: 100 },
    jobTitle: { type: String, required: true },
    technicalQuestions: { type: [questionSchema], default: [] },
    behavioralQuestions: { type: [questionSchema], default: [] },
    skillGaps:  { type: [skillGapSchema], default: [] },
    prepPlan:   { type: [prepPlanSchema], default: [] },
  },
  { timestamps: true }
);

const AnalysisReport = mongoose.model("AnalysisReport", analysisReportSchema);

export default AnalysisReport;