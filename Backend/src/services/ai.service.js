import { GoogleGenAI } from "@google/genai";
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import config from "../config/config.js";

const client = new GoogleGenAI({
    apiKey: config.geminiApiKey
});

const reportJsonSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "integer",
            description: "Match score percentage between resume and job description (0-100)"
        },
        jobTitle: {
            type: "string",
            description: "The title of the job for which the interview is generated"
        },
        technicalQuestions: {
            type: "array",
            description: "Technical interview questions that the interviewer could ask",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intension: { type: "string", description: "The underlying intention or what the interviewer wants to assess" },
                    answer: { type: "string", description: "Ideal answer or key points to cover" }
                },
                required: ["question", "intension", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "Behavioral interview questions that the interviewer could ask",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intension: { type: "string", description: "The underlying intention or what the interviewer wants to assess" },
                    answer: { type: "string", description: "Ideal answer or key points to cover using STAR method" }
                },
                required: ["question", "intension", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "List of missing or weak skills identified between resume and job description",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: {
                        type: "string",
                        enum: ["low", "med", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        prepPlan: {
            type: "array",
            description: "Day-by-day preparation plan to bridge skill gaps and prepare for the role",
            items: {
                type: "object",
                properties: {
                    dayNo: { type: "integer" },
                    topic: { type: "string" },
                    tasks: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["dayNo", "topic", "tasks"]
            }
        }
    },
    required: [
        "matchScore",
        "jobTitle",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "prepPlan"
    ]
};

const reportSchema = z.fromJSONSchema(reportJsonSchema);

export async function generateAnalysisReport(resume, jobDescription, selfDescription) {
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume || "Not provided (rely on the self description)"}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`;

    const interaction = await client.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: reportJsonSchema
        },
    });

    const analysisReport = reportSchema.parse(JSON.parse(interaction.output_text));
    return analysisReport;
}