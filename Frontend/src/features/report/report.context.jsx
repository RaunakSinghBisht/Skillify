import { createContext, useState, useCallback } from "react";
import { reportApi } from "./services/report.api.js";
import { useAuth } from "../auth/hooks/useAuth.js";

export const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {
  const { accessToken, refreshAccessToken } = useAuth();

  // ── State ─────────────────────────────────────────────────────────────────
  // The full report currently being viewed
  const [currentReport, setCurrentReport] = useState(null);

  // Lightweight list of all user reports (for a history/dashboard view)
  const [reportList, setReportList] = useState([]);

  // Async operation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(false);

  // Error per operation, so UI can be specific about what failed
  const [generateError, setGenerateError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [listError, setListError] = useState(null);

  // ── Helper: always-fresh access token ────────────────────────────────────
  // Tries to use the in-memory token first; if missing it silently refreshes.
  const getToken = useCallback(async () => {
    if (accessToken) return accessToken;
    return await refreshAccessToken();
  }, [accessToken, refreshAccessToken]);

  // ── Action: generateReport ────────────────────────────────────────────────
  /**
   * Builds a FormData payload, calls the API, stores the returned report in
   * state, then navigates to /report/:id.
   *
   * @param {{ jobDescription: string, selfDescription?: string, resumeFile?: File }} params
   */
  const generateReport = useCallback(
    async ({ jobDescription, selfDescription = "", resumeFile }) => {
      setIsGenerating(true);
      setGenerateError(null);

      try {
        const token = await getToken();

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        if (selfDescription) formData.append("selfDescription", selfDescription);
        if (resumeFile) formData.append("resume", resumeFile);

        const data = await reportApi.generateReport(formData, token);

        setCurrentReport(data.report);

        // Return the full report so the calling page can navigate to /report/:id
        return data.report;
      } catch (err) {
        setGenerateError(err.message || "Failed to generate report.");
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [getToken]
  );

  // ── Action: fetchReportById ───────────────────────────────────────────────
  /**
   * Fetches a single full report by its MongoDB _id and stores it as
   * `currentReport`.  Called when the /report/:id page mounts.
   *
   * @param {string} id  MongoDB ObjectId string
   */
  const fetchReportById = useCallback(
    async (id) => {
      // If the report is already in state (e.g. navigated from generate), skip
      if (currentReport && currentReport._id === id) return;

      setIsFetchingReport(true);
      setFetchError(null);

      try {
        const token = await getToken();
        const data = await reportApi.getReportById(id, token);
        setCurrentReport(data.report);
        return data.report;
      } catch (err) {
        setFetchError(err.message || "Failed to fetch report.");
        throw err;
      } finally {
        setIsFetchingReport(false);
      }
    },
    [currentReport, getToken]
  );

  // ── Action: fetchAllReports ───────────────────────────────────────────────
  /**
   * Fetches the lightweight list of all reports for the current user.
   * Intended for a history/dashboard page.
   */
  const fetchAllReports = useCallback(async () => {
    setIsFetchingList(true);
    setListError(null);

    try {
      const token = await getToken();
      const data = await reportApi.getAllReports(token);
      setReportList(data.reports);
      return data.reports;
    } catch (err) {
      setListError(err.message || "Failed to fetch reports.");
      throw err;
    } finally {
      setIsFetchingList(false);
    }
  }, [getToken]);

  // ── Action: clearCurrentReport ────────────────────────────────────────────
  /** Clears the current report from state (e.g. on unmount or back navigation). */
  const clearCurrentReport = useCallback(() => {
    setCurrentReport(null);
    setFetchError(null);
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    // State
    currentReport,
    reportList,

    // Loading flags
    isGenerating,
    isFetchingReport,
    isFetchingList,

    // Error messages (per-operation)
    generateError,
    fetchError,
    listError,

    // Actions
    generateReport,
    fetchReportById,
    fetchAllReports,
    clearCurrentReport,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
