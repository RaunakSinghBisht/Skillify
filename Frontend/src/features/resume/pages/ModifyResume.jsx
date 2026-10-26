import { useState, useEffect } from "react";
import useResume from "../hooks/useResume.js";
import ReportNavbar from "../../report/components/ReportNavbar";
import JobDescriptionSection from "../../report/components/JobDescriptionSection";
import ProfileSection from "../../report/components/ProfileSection";
import AnalysisCardFooter from "../../report/components/AnalysisCardFooter";
import FooterLinks from "../../report/components/FooterLinks";
import "../../report/styles/home.scss";
import "../styles/modify.scss";

const triggerDownload = (url, fileName) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const ModifyResume = () => {
  const { modifyResume, clearResult, pdfUrl, pdfFileName, isModifying, modifyError } =
    useResume();

  // Local UI states (form fields live here — not in context)
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");

  // Drop the previous result when leaving the page
  useEffect(() => () => clearResult(), [clearResult]);

  const isSubmitDisabled =
    isModifying ||
    !jobDescription.trim() ||
    (!resumeFile && !selfDescription.trim());

  const handleModifyResume = async () => {
    if (isSubmitDisabled) return;
    try {
      const { url, fileName } = await modifyResume({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      triggerDownload(url, fileName);
    } catch {
      // modifyError in context already holds the message
    }
  };

  return (
    <div className="report-home-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
      />

      <ReportNavbar />

      <main className="report-home-content">
        <section className="report-hero">
          <h1 className="report-hero__title">
            Tailor Your <span className="highlight-pink">Resume</span>
          </h1>
          <p className="report-hero__subtitle">
            Let our AI rewrite your resume for the target role and download it as
            a ready-to-send PDF.
          </p>
        </section>

        <div className="report-main-card">
          <div className="report-card-grid">
            <JobDescriptionSection value={jobDescription} onChange={setJobDescription} />
            <ProfileSection
              file={resumeFile}
              onFileChange={setResumeFile}
              selfDescription={selfDescription}
              onSelfDescriptionChange={setSelfDescription}
            />
          </div>

          <AnalysisCardFooter
            onSubmit={handleModifyResume}
            isLoading={isModifying}
            disabled={isSubmitDisabled}
            label="Modify Resume"
            loadingLabel="Modifying"
            metaText="AI-Powered Resume Tailoring • Approx 30s"
          />
        </div>

        {modifyError && <div className="resume-error">⚠ {modifyError}</div>}

        {pdfUrl && (
          <section className="resume-preview">
            <div className="resume-preview__header">
              <h2 className="resume-preview__title">Your Tailored Resume</h2>
              <button
                type="button"
                className="resume-preview__download-btn"
                onClick={() => triggerDownload(pdfUrl, pdfFileName)}
              >
                Download again
              </button>
            </div>
            <iframe
              className="resume-preview__frame"
              src={pdfUrl}
              title="Tailored resume preview"
            />
          </section>
        )}

        <FooterLinks />
      </main>
    </div>
  );
};

export default ModifyResume;
