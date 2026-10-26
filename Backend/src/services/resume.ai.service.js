import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import config from "../config/config.js";

const client = new GoogleGenAI({
    apiKey: config.geminiApiKey
});

const str = (description) => ({ type: "string", description });
const strArray = (description) => ({ type: "array", description, items: { type: "string" } });

const resumeJsonSchema = {
    type: "object",
    properties: {
        fullName: str("Candidate's full name"),
        contact: {
            type: "object",
            description: "Contact details. Use an empty string for anything not present in the source",
            properties: {
                email: str("Email address"),
                phone: str("Phone number"),
                location: str("City / Country"),
                linkedin: str("LinkedIn URL"),
                github: str("GitHub URL"),
                portfolio: str("Portfolio / personal website URL")
            },
            required: ["email"]
        },
        summary: str("2-3 line professional summary tailored to the job description"),
        skills: {
            type: "array",
            description: "Skills grouped by category, most relevant to the job first",
            items: {
                type: "object",
                properties: {
                    category: str("Category name, e.g. Languages, Frameworks, Tools"),
                    items: strArray("Skills in this category")
                },
                required: ["category", "items"]
            }
        },
        experience: {
            type: "array",
            description: "Work experience, most relevant / recent first",
            items: {
                type: "object",
                properties: {
                    company: str("Company name"),
                    role: str("Job title"),
                    location: str("Job location"),
                    startDate: str("Start date as written in the source, e.g. Jan 2022"),
                    endDate: str("End date, or 'Present'"),
                    bullets: strArray("Impact-oriented achievement bullets")
                },
                required: ["company", "role", "bullets"]
            }
        },
        projects: {
            type: "array",
            description: "Projects, most relevant to the job first",
            items: {
                type: "object",
                properties: {
                    name: str("Project name"),
                    techStack: strArray("Technologies used"),
                    link: str("Project / repo URL"),
                    bullets: strArray("What was built and the impact")
                },
                required: ["name", "bullets"]
            }
        },
        education: {
            type: "array",
            description: "Education entries",
            items: {
                type: "object",
                properties: {
                    institution: str("School / university"),
                    degree: str("Degree, e.g. B.Tech"),
                    field: str("Field of study"),
                    startDate: str("Start date or year"),
                    endDate: str("End date or year"),
                    grade: str("CGPA / percentage, if present in the source")
                },
                required: ["institution", "degree"]
            }
        },
        certifications: strArray("Certifications, if any"),
        achievements: strArray("Awards and notable achievements, if any")
    },
    required: ["fullName", "contact", "summary", "skills", "experience", "education"]
};

const resumeSchema = z.fromJSONSchema(resumeJsonSchema);

export async function generateModifiedResume(resume, jobDescription, selfDescription) {
    const prompt = `You are an expert resume writer and ATS optimisation specialist.
Rewrite and tailor the candidate's resume for the job description below.

Rules:
- The resume is the source of truth. Use the self description only as extra context about the candidate.
- If no resume is provided, build the resume from the self description alone.
- Naturally work in relevant keywords from the job description, and reorder or emphasise the most relevant experience, projects and skills.
- Rewrite bullets to be concise and impact-oriented (action verb + what + result), quantified only where the source supports it.
- NEVER fabricate employers, job titles, degrees, dates, metrics, certifications or skills the candidate does not have. Leave a field as an empty string / omit it when the source has no data for it.
- Keep it ATS-friendly and concise, ideally fitting a single page: at most 4 bullets per role or project.
- Output plain text only. No markdown, no HTML.

Resume:
${resume || "Not provided (build from the self description)"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}`;

    const interaction = await client.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: resumeJsonSchema
        },
    });

    return resumeSchema.parse(JSON.parse(interaction.output_text));
}
