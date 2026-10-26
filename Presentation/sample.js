// Sample inputs for demoing Skillify with different outcomes (high / mid / low match).
// Pair any self description with any job description, or use `testCases` below.

export const selfDescriptions = [
  {
    id: "sd1",
    label: "MERN student (full-stack, backend-leaning)",
    text: `
I'm a full-stack web developer currently in my 3rd year of B.Tech Computer Science.
I have hands-on experience building production-ready MERN stack applications, including
a banking ledger system with JWT auth and real deployment challenges (CORS, cookies, CI/CD).
I'm currently strengthening my DSA fundamentals in C++ and exploring agentic AI development
using the Anthropic and OpenAI SDKs. I prefer backend and system design work but I'm
comfortable across the full stack. Looking for an SDE Intern or Full Stack Developer role
where I can contribute to real production systems and keep learning.
`,
  },
  {
    id: "sd2",
    label: "Data / ML enthusiast (Python, no web experience)",
    text: `
I'm a final-year B.Sc. Statistics student with a strong interest in machine learning.
I work mainly in Python (pandas, NumPy, scikit-learn) and have built a house-price prediction
model and a customer churn classifier, both documented on Kaggle. I'm comfortable with SQL for
data cleaning and exploratory analysis, and I've made dashboards in Power BI. I have completed
Andrew Ng's ML specialization and am now learning PyTorch. I have not worked on web development
or deployed any model to production. I'm looking for a Data Science or ML intern role.
`,
  },
  {
    id: "sd3",
    label: "Career switcher (non-tech background, beginner coder)",
    text: `
I have 4 years of experience as a mechanical design engineer working with CAD tools and
manufacturing teams. Over the last six months I have been teaching myself programming in my
free time: I finished an introductory Python course and built a small to-do list app with
HTML, CSS and a little JavaScript. I don't have any professional software experience, have
not used Git beyond basic commits, and I have never worked with databases or cloud platforms.
I'm highly motivated, good at structured problem solving, and want to move into a software role.
`,
  },
];

export const jobDescriptions = [
  {
    id: "jd1",
    label: "Full Stack Developer Intern (MERN) - entry level",
    text: `
Job Title: Full Stack Developer Intern (MERN Stack)
Company: TechNova Solutions
Location: Remote / Bangalore

About the Role:
We are looking for a Full Stack Developer Intern to join our engineering team. You will work
on building and maintaining scalable web applications using the MERN stack, collaborating
closely with senior engineers on real production features.

Responsibilities:
- Develop and maintain RESTful APIs using Node.js and Express
- Build responsive UI components using React.js
- Work with MongoDB for schema design and query optimization
- Write clean, tested, and maintainable code
- Participate in code reviews and agile sprint cycles
- Debug and resolve production issues across the stack

Requirements:
- Strong understanding of JavaScript (ES6+), React, Node.js, and Express
- Experience with MongoDB and Mongoose
- Familiarity with Git and version control workflows
- Understanding of authentication mechanisms (JWT/OAuth)
- Knowledge of Docker and CI/CD pipelines is a plus
- Exposure to TypeScript is a plus
- Strong problem-solving skills and DSA fundamentals
- Currently pursuing a B.Tech/B.E. in Computer Science or related field

Nice to have:
- Experience deploying applications (Render, Vercel, AWS)
- Understanding of system design basics
- Exposure to testing frameworks (Jest, Mocha)
`,
  },
  {
    id: "jd2",
    label: "Data Scientist Intern - entry level",
    text: `
Job Title: Data Science Intern
Company: InsightLoop Analytics
Location: Hybrid / Pune

About the Role:
Join our analytics team to turn raw business data into predictive models and clear insights.
You will work with senior data scientists on real customer datasets.

Responsibilities:
- Clean, explore and visualise large datasets using Python and SQL
- Build and evaluate supervised ML models (regression, classification, tree-based methods)
- Create dashboards and reports for business stakeholders
- Communicate findings clearly to non-technical audiences
- Assist in A/B test design and analysis

Requirements:
- Proficiency in Python (pandas, NumPy, scikit-learn) and SQL
- Solid grounding in statistics and probability
- Experience with data visualisation tools (Power BI, Tableau or Matplotlib)
- Familiarity with ML concepts: overfitting, cross-validation, feature engineering
- Pursuing or completed a degree in Statistics, Maths, CS or a related field

Nice to have:
- Exposure to deep learning frameworks (PyTorch / TensorFlow)
- Experience with cloud platforms or MLOps tooling
- Kaggle or open-source contributions
`,
  },
  {
    id: "jd3",
    label: "Senior Backend / DevOps Engineer - 5+ years (stretch role)",
    text: `
Job Title: Senior Backend Engineer (Platform & Infrastructure)
Company: ScaleGrid Systems
Location: Bangalore (On-site)

About the Role:
We are hiring a Senior Backend Engineer to design, build and operate high-throughput
distributed services that handle millions of requests per day.

Responsibilities:
- Design and own microservices written in Go and Node.js
- Operate production workloads on Kubernetes (AWS EKS) and manage infrastructure with Terraform
- Design event-driven systems using Kafka and RabbitMQ
- Define SLOs, build observability (Prometheus, Grafana, OpenTelemetry) and lead incident response
- Optimise PostgreSQL and Redis for high-scale workloads
- Mentor junior engineers and lead architecture reviews

Requirements:
- 5+ years of professional backend or platform engineering experience
- Strong experience with Go or another systems language
- Hands-on production experience with Kubernetes, Docker and CI/CD pipelines
- Deep understanding of distributed systems, caching and database internals
- Proven experience leading technical design for large-scale systems

Nice to have:
- Experience with service mesh (Istio / Linkerd)
- Contributions to open-source infrastructure projects
`,
  },
];

// Ready-made pairings with the outcome you should expect from the report
export const testCases = [
  { name: "Strong match", selfDescription: "sd1", jobDescription: "jd1", expected: "High match score, few / low-severity gaps (Docker, TypeScript, testing)" },
  { name: "Strong match (different domain)", selfDescription: "sd2", jobDescription: "jd2", expected: "High match score, minor gaps (cloud / MLOps, deep learning)" },
  { name: "Partial match", selfDescription: "sd1", jobDescription: "jd2", expected: "Mid-to-low match score, gaps in Python ML, statistics and SQL" },
  { name: "Low match (wrong stack)", selfDescription: "sd2", jobDescription: "jd1", expected: "Low match score, high-severity gaps in React / Node / MongoDB" },
  { name: "Stretch role", selfDescription: "sd1", jobDescription: "jd3", expected: "Low match score, high-severity gaps in Go, Kubernetes, Kafka, experience" },
  { name: "Career switcher, very low match", selfDescription: "sd3", jobDescription: "jd3", expected: "Very low match score, almost all gaps high severity" },
  { name: "Career switcher, beginner role", selfDescription: "sd3", jobDescription: "jd1", expected: "Low-to-mid match score, mixed severities (good for roadmap demo)" },
];

// Backwards-compatible default (the strong-match pair)
const sampleInput = {
  selfDescription: selfDescriptions[0].text,
  jobDescription: jobDescriptions[0].text,
};

export default sampleInput;
