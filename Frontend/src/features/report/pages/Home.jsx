import { useState } from "react";
import { useNavigate } from "react-router";
import useReport from "../hooks/useReport.js";
import ReportNavbar from "../components/ReportNavbar";
import JobDescriptionSection from "../components/JobDescriptionSection";
import ProfileSection from "../components/ProfileSection";
import AnalysisCardFooter from "../components/AnalysisCardFooter";
import FooterLinks from "../components/FooterLinks";
import "../styles/home.scss";

const ReportHome = () => {
  const navigate = useNavigate();
  const { generateReport, isGenerating, generateError } = useReport();

  // Local UI states (form fields live here — not in context)
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");

  // Validation:
  // 1. Job Description is REQUIRED
  // 2. Either a Resume OR a Self Description is REQUIRED
  const isSubmitDisabled =
    isGenerating ||
    !jobDescription.trim() ||
    (!resumeFile && !selfDescription.trim());

  const handleGenerateStrategy = async () => {
    if (isSubmitDisabled) return;
    try {
      const report = await generateReport({ jobDescription, selfDescription, resumeFile });
      navigate(`/report/${report._id}`, { state: { report } });
    } catch {
      // generateError in context already holds the message — AnalysisCardFooter will show it
    }
  };

  return (
    <div className="report-home-page">
      {/* ── Google Fonts & Icons ── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
      />

      {/* ── Top Navbar ── */}
      <ReportNavbar />

      {/* ── Main Container ── */}
      <main className="report-home-content">
        {/* ── Hero Title & Subtitle ── */}
        <section className="report-hero">
          <h1 className="report-hero__title">
            Create Your Custom{" "}
            <span className="highlight-pink">Interview Plan</span>
          </h1>
          <p className="report-hero__subtitle">
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </section>

        {/* ── Main Strategy Generator Card ── */}
        <div className="report-main-card">
          <div className="report-card-grid">
            {/* Left Column: Target Job Description */}
            <JobDescriptionSection
              value={jobDescription}
              onChange={setJobDescription}
            />

            {/* Right Column: Your Profile (Resume & Self Description) */}
            <ProfileSection
              file={resumeFile}
              onFileChange={setResumeFile}
              selfDescription={selfDescription}
              onSelfDescriptionChange={setSelfDescription}
            />
          </div>

          {/* Card Footer: Metadata Note & Action Button */}
          <AnalysisCardFooter
            onSubmit={handleGenerateStrategy}
            isLoading={isGenerating}
            disabled={isSubmitDisabled}
          />
        </div>

        {/* Inline error message under card */}
        {generateError && (
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(255, 46, 99, 0.1)",
            border: "1px solid rgba(255, 46, 99, 0.3)",
            borderRadius: "0.65rem",
            color: "#ff4d6d",
            fontSize: "0.875rem",
            textAlign: "center",
            width: "100%",
          }}>
            ⚠ {generateError}
          </div>
        )}

        {/* ── Bottom Footer Links ── */}
        <FooterLinks />
      </main>
    </div>
  );
};

export default ReportHome;