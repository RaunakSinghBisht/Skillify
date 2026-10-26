import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import useReport from "../hooks/useReport.js";
import ReportNavbar from "../components/ReportNavbar";
import "../styles/history.scss";

const getScoreTier = (score) => {
  if (score >= 80) return "high";
  if (score >= 65) return "mid";
  return "low";
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const MAX_VISIBLE_GAPS = 4;

const History = () => {
  const navigate = useNavigate();
  const { reportList, isFetchingList, listError, fetchAllReports } = useReport();

  useEffect(() => {
    fetchAllReports().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="history-page">
      <ReportNavbar />

      <main className="history-content">
        <section className="history-hero">
          <h1 className="history-hero__title">
            Your <span className="highlight-pink">Previous Reports</span>
          </h1>
          <p className="history-hero__subtitle">
            Revisit any analysis you generated earlier.
          </p>
        </section>

        {isFetchingList && (
          <div className="history-state">
            <div className="history-spinner" />
            <p>Loading your reports...</p>
          </div>
        )}

        {!isFetchingList && listError && (
          <div className="history-state history-state--error">
            <h3>Could not load reports</h3>
            <p>{listError}</p>
            <button
              type="button"
              className="history-btn"
              onClick={() => fetchAllReports().catch(() => {})}
            >
              Try again
            </button>
          </div>
        )}

        {!isFetchingList && !listError && reportList.length === 0 && (
          <div className="history-state">
            <h3>No reports yet</h3>
            <p>Generate your first interview strategy to see it here.</p>
            <Link to="/" className="history-btn">
              Generate a report
            </Link>
          </div>
        )}

        {!isFetchingList && !listError && reportList.length > 0 && (
          <>
            <p className="history-count">
              {reportList.length} {reportList.length === 1 ? "report" : "reports"}
            </p>
            <div className="history-grid">
              {reportList.map((report) => {
                const gaps = report.skillGaps || [];
                return (
                  <article
                    key={report._id}
                    className="history-card"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/report/${report._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/report/${report._id}`);
                    }}
                  >
                    <div className="history-card__top">
                      <div className="history-card__heading">
                        <h3 className="history-card__title">{report.jobTitle}</h3>
                        <span className="history-card__date">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`history-card__score history-card__score--${getScoreTier(
                          report.matchScore
                        )}`}
                      >
                        {report.matchScore}%
                      </div>
                    </div>

                    <div className="history-card__gaps">
                      {gaps.length === 0 ? (
                        <span className="history-card__no-gaps">No skill gaps found</span>
                      ) : (
                        <>
                          {gaps.slice(0, MAX_VISIBLE_GAPS).map((gap, idx) => (
                            <span
                              key={idx}
                              className={`history-card__gap history-card__gap--${gap.severity}`}
                            >
                              {gap.skill}
                            </span>
                          ))}
                          {gaps.length > MAX_VISIBLE_GAPS && (
                            <span className="history-card__gap history-card__gap--more">
                              +{gaps.length - MAX_VISIBLE_GAPS}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <span className="history-card__cta">View report →</span>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default History;
