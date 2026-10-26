import { useContext } from "react";
import { ReportContext } from "../report.context.jsx";

/**
 * Layer 3 — useReport hook
 *
 * Thin read accessor over ReportContext. UI components and pages call only
 * this hook — they never import from report.context.jsx or services/ directly.
 *
 * Exposes:
 *   State
 *     currentReport    – full report object currently being viewed
 *     reportList       – lightweight list of all user reports
 *
 *   Loading flags
 *     isGenerating     – true while POST /generate is in-flight
 *     isFetchingReport – true while GET /:id is in-flight
 *     isFetchingList   – true while GET / is in-flight
 *
 *   Error messages (null when no error)
 *     generateError
 *     fetchError
 *     listError
 *
 *   Actions (all async, throw on failure)
 *     generateReport({ jobDescription, selfDescription?, resumeFile? })
 *       → builds FormData, calls API, stores report in state, returns the
 *         saved report object.  The calling page is responsible for
 *         navigating to /report/:id using the returned _id.
 *
 *     fetchReportById(id)
 *       → fetches a single report by _id; no-ops if it's already in state
 *
 *     fetchAllReports()
 *       → fetches lightweight list; use in a history/dashboard page
 *
 *     clearCurrentReport()
 *       → resets currentReport and fetchError (call on page unmount)
 */
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};

export default useReport;
