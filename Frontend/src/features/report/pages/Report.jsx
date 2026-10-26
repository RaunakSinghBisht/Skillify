import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import useReport from "../hooks/useReport.js";
import ReportNavbar from "../components/ReportNavbar";
import "../styles/report.scss";

const Report = () => {
  const { id } = useParams();
  const {
    currentReport,
    isFetchingReport,
    fetchError,
    fetchReportById,
    clearCurrentReport,
  } = useReport();

  // ── All hooks MUST be declared before any early returns ────────────────────
  const [activeTab, setActiveTab] = useState("technical");
  const [bookmarkedIds, setBookmarkedIds] = useState({});
  const [checkedActions, setCheckedActions] = useState({});

  // Fetch the report by ID on mount (no-ops if already in state from generate flow)
  useEffect(() => {
    if (id) {
      fetchReportById(id).catch(() => {});
    }
    return () => clearCurrentReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleBookmark = (idx) => {
    setBookmarkedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleAction = (actionId) => {
    setCheckedActions((prev) => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  // ── Early returns (all hooks are already declared above) ───────────────────
  // Also show the loader on first render of a direct visit, before the fetch effect has started
  if (isFetchingReport || (id && !currentReport && !fetchError)) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#0a0c12",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
        color: "#cbd5e1", fontFamily: "Inter, sans-serif",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          border: "3px solid rgba(255,46,99,0.3)", borderTopColor: "#ff2e63",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ fontSize: "0.95rem", color: "#8b92a4" }}>Loading your report...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#0a0c12",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
        color: "#cbd5e1", fontFamily: "Inter, sans-serif",
        textAlign: "center", padding: "2rem",
      }}>
        <span style={{ fontSize: "2rem" }}>⚠️</span>
        <h2 style={{ color: "#ff4d6d", margin: 0 }}>Could not load report</h2>
        <p style={{ color: "#8b92a4", maxWidth: "400px" }}>{fetchError}</p>
        <Link to="/" style={{
          background: "linear-gradient(135deg, #ff2e63, #ff0844)",
          color: "#fff", padding: "0.6rem 1.5rem",
          borderRadius: "0.5rem", textDecoration: "none",
          fontWeight: "600", fontSize: "0.9rem",
        }}>← Back to Home</Link>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#0a0c12",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
        color: "#8b92a4", fontFamily: "Inter, sans-serif",
      }}>
        <p>No report data found.</p>
        <Link to="/" style={{ color: "#ff4d6d" }}>← Generate one</Link>
      </div>
    );
  }

  // ── Derived values (report is guaranteed non-null below this line) ─────────
  const report = currentReport;
  const matchScore = report.matchScore || 0;
  const getCandidateStatus = (score) => {
    if (score >= 80) return "Strong Candidate";
    if (score >= 65) return "Good Fit";
    return "Needs Preparation";
  };
  // Colour tier for the match score: high = green, mid = yellow, low = red
  const scoreTier = matchScore >= 80 ? "high" : matchScore >= 65 ? "mid" : "low";
  const jobTitle = report.jobTitle || report.roleTitle || "Interview Plan";
  const technicalQuestions = report.technicalQuestions || [];
  const behavioralQuestions = report.behavioralQuestions || [];
  const prepPlan = report.prepPlan || [];
  const skillGaps = report.skillGaps || [];

  return (
    <div className="report-page">
      <ReportNavbar />

      {/* ── Main Container ── */}
      <main className="report-main-container">
        {/* ── Top Hero Analysis Complete Card ── */}
        <section className="report-hero-card">
          <div className="report-hero-card__left">
            <div className="report-hero-card__status">
              <span className="report-hero-card__status-dot" />
              <span>ANALYSIS COMPLETE</span>
            </div>
            <h1 className="report-hero-card__title">
              {jobTitle}
            </h1>
            <p className="report-hero-card__subtitle">
              Role Fit &amp; Interview Prep Plan
            </p>
          </div>

          <div className="report-hero-card__score-pill">
            <div className={`report-hero-card__score-circle report-hero-card__score-circle--${scoreTier}`}>
              <span className="report-hero-card__score-circle-val">
                {matchScore}%
              </span>
            </div>
            <div className="report-hero-card__score-meta">
              <span className="report-hero-card__score-label">Match Score</span>
              <span className={`report-hero-card__score-tag report-hero-card__score-tag--${scoreTier}`}>
                {getCandidateStatus(matchScore)}
              </span>
            </div>
          </div>
        </section>

        {/* ── 3-Column Workspace Grid ── */}
        <div className="report-grid">
          {/* ── Left Sidebar Navigation Tabs ── */}
          <aside className="report-sidebar">
            <button
              type="button"
              className={`report-sidebar__tab ${
                activeTab === "technical" ? "report-sidebar__tab--active" : ""
              }`}
              onClick={() => setActiveTab("technical")}
            >
              <span className="tab-icon">
                {/* Terminal / Code Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m7 8 4 4-4 4" />
                  <path d="M13 16h4" />
                </svg>
              </span>
              <span>Technical Qs</span>
            </button>

            <button
              type="button"
              className={`report-sidebar__tab ${
                activeTab === "behavioral" ? "report-sidebar__tab--active" : ""
              }`}
              onClick={() => setActiveTab("behavioral")}
            >
              <span className="tab-icon">
                {/* Lightbulb / Brain Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </span>
              <span>Behavioral Qs</span>
            </button>

            <button
              type="button"
              className={`report-sidebar__tab ${
                activeTab === "roadmap" ? "report-sidebar__tab--active" : ""
              }`}
              onClick={() => setActiveTab("roadmap")}
            >
              <span className="tab-icon">
                {/* Route / Milestone Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="6" cy="19" r="3" />
                  <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4.5 4.5 0 0 1 0-9H18" />
                  <circle cx="18" cy="5" r="3" />
                </svg>
              </span>
              <span>Road Map</span>
            </button>
          </aside>

          {/* ── Center Column Content ── */}
          <section className="report-center-col">
            {activeTab === "technical" && (
              <>
                <div className="report-center-col__header">
                  <div className="report-center-col__title-group">
                    <span className="report-center-col__icon">
                      {/* Code Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m7 8 4 4-4 4" />
                        <path d="M13 16h4" />
                      </svg>
                    </span>
                    <h2 className="report-center-col__title">
                      Technical Questions
                    </h2>
                  </div>
                  <span className="report-center-col__count-badge">
                    {technicalQuestions.length} Key Areas identified
                  </span>
                </div>

                <div className="report-scroll-list">
                {technicalQuestions.map((q, idx) => (
                  <article key={idx} className="report-question-card">
                    <div className="report-question-card__header">
                      <h3 className="report-question-card__question">
                        {q.question}
                      </h3>
                      <button
                        type="button"
                        className={`report-question-card__bookmark-btn ${
                          bookmarkedIds[`tech_${idx}`]
                            ? "report-question-card__bookmark-btn--active"
                            : ""
                        }`}
                        onClick={() => toggleBookmark(`tech_${idx}`)}
                        title="Bookmark question"
                      >
                        {/* Bookmark Icon */}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={
                            bookmarkedIds[`tech_${idx}`] ? "currentColor" : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                      </button>
                    </div>

                    <div className="report-question-card__details-grid">
                      <div className="report-question-card__detail-box">
                        <span className="report-question-card__label">
                          INTENTION
                        </span>
                        <p className="report-question-card__text">
                          {q.intension || q.intention}
                        </p>
                      </div>

                      <div className="report-question-card__detail-box">
                        <span className="report-question-card__label">
                          SUGGESTED FOCUS
                        </span>
                        <p className="report-question-card__text">{q.answer}</p>
                      </div>
                    </div>
                  </article>
                ))}
                </div>
              </>
            )}

            {activeTab === "behavioral" && (
              <>
                <div className="report-center-col__header">
                  <div className="report-center-col__title-group">
                    <span className="report-center-col__icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                      </svg>
                    </span>
                    <h2 className="report-center-col__title">
                      Behavioral Questions
                    </h2>
                  </div>
                  <span className="report-center-col__count-badge">
                    {behavioralQuestions.length} Questions
                  </span>
                </div>

                {behavioralQuestions.length === 0 ? (
                  <div className="report-empty-state">
                    <span className="report-empty-state__icon">💬</span>
                    <h4 className="report-empty-state__title">
                      No Behavioral Questions
                    </h4>
                    <p className="report-empty-state__desc">
                      This analysis focused primarily on core technical
                      competencies and system architecture for this role.
                    </p>
                  </div>
                ) : (
                  <div className="report-scroll-list">
                  {behavioralQuestions.map((q, idx) => (
                    <article key={idx} className="report-question-card">
                      <div className="report-question-card__header">
                        <h3 className="report-question-card__question">
                          {q.question}
                        </h3>
                        <button
                          type="button"
                          className="report-question-card__bookmark-btn"
                          onClick={() => toggleBookmark(`beh_${idx}`)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={
                              bookmarkedIds[`beh_${idx}`]
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </button>
                      </div>

                      <div className="report-question-card__details-grid">
                        <div className="report-question-card__detail-box">
                          <span className="report-question-card__label">
                            INTENTION
                          </span>
                          <p className="report-question-card__text">
                            {q.intension || q.intention}
                          </p>
                        </div>
                        <div className="report-question-card__detail-box">
                          <span className="report-question-card__label">
                            SUGGESTED FOCUS
                          </span>
                          <p className="report-question-card__text">
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "roadmap" && (
              <>
                <div className="report-center-col__header">
                  <div className="report-center-col__title-group">
                    <span className="report-center-col__icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="6" cy="19" r="3" />
                        <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4.5 4.5 0 0 1 0-9H18" />
                        <circle cx="18" cy="5" r="3" />
                      </svg>
                    </span>
                    <h2 className="report-center-col__title">
                      Interview Prep Road Map
                    </h2>
                  </div>
                  <span className="report-center-col__count-badge">
                    {prepPlan.length} Days Strategy
                  </span>
                </div>

                <div className="prep-plan-list report-scroll-list">
                  {prepPlan.map((plan, idx) => (
                    <div key={idx} className="prep-plan-day-card">
                      <div className="prep-plan-day-card__header">
                        <span className="prep-plan-day-card__badge">
                          DAY {plan.dayNo}
                        </span>
                        <h4 className="prep-plan-day-card__topic">
                          {plan.topic}
                        </h4>
                      </div>
                      <ul className="prep-plan-day-card__tasks">
                        {plan.tasks &&
                          plan.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="prep-plan-day-card__task-item">
                              <span className="task-bullet">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* ── Right Column: Skill Gaps & Action Items ── */}
          <aside className="report-right-col">
            {/* Skill Gaps Section */}
            <div className="report-right-col__skill-section">
              <div className="report-right-col__skill-header">
                <span className="report-right-col__skill-icon">
                  {/* Crosshair / Skill Icon */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="22" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="12" x2="2" y2="12" />
                    <line x1="12" y1="6" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="18" />
                  </svg>
                </span>
                <h3 className="report-right-col__skill-title">Skill Gaps</h3>
              </div>
              <p className="report-right-col__skill-desc">
                Areas requiring immediate focus before the interview.
              </p>

              <div className="report-right-col__skill-pills">
                {skillGaps.map((item, idx) => (
                  <div
                    key={idx}
                    className={`report-right-col__skill-pill report-right-col__skill-pill--${item.severity}`}
                    title={`Severity: ${item.severity}`}
                  >
                    <span>{item.skill}</span>
                    <span className="skill-dot" />
                  </div>
                ))}
              </div>
            </div>

            <div className="report-right-col__divider" />

            {/* Action Items Section */}
            <div className="report-right-col__actions-section">
              <h3 className="report-right-col__action-title">Action Items</h3>
              <div className="report-right-col__action-list">
                {prepPlan.map((plan, idx) => {
                  const actionId = `action_${idx}`;
                  const isChecked = !!checkedActions[actionId];
                  return (
                    <label key={actionId} className="report-right-col__action-item">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAction(actionId)}
                      />
                      <span
                        className={`report-right-col__action-item-checkbox ${
                          isChecked
                            ? "report-right-col__action-item-checkbox--checked"
                            : ""
                        }`}
                      >
                        {isChecked && "✓"}
                      </span>
                      <span
                        className={`report-right-col__action-item-text ${
                          isChecked
                            ? "report-right-col__action-item-text--completed"
                            : ""
                        }`}
                      >
                        {plan.topic}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Page Footer ── */}
      <footer className="report-page-footer">
        <div className="report-page-footer__inner">
          <div className="report-page-footer__left">
            <Link to="/" className="report-page-footer__brand">
              Skillify
            </Link>
            <span className="report-page-footer__copyright">
              © 2026 Skillify AI. Precision Engineered for Career Growth.
            </span>
          </div>

          <div className="report-page-footer__links">
            <a href="#privacy" className="report-page-footer__link">
              Privacy Policy
            </a>
            <a href="#terms" className="report-page-footer__link">
              Terms of Service
            </a>
            <a href="#api" className="report-page-footer__link">
              API Docs
            </a>
            <a href="#contact" className="report-page-footer__link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Report;
