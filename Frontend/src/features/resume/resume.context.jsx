import { createContext, useState, useCallback, useEffect, useRef } from "react";
import { resumeApi } from "./services/resume.api.js";
import { useAuth } from "../auth/hooks/useAuth.js";

export const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const { accessToken, refreshAccessToken } = useAuth();

  // ── State ─────────────────────────────────────────────────────────────────
  // Object URL of the generated PDF (used for preview + download) and its file name
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [modifyError, setModifyError] = useState(null);

  // Tracks the live object URL so it can be revoked without a stale closure
  const pdfUrlRef = useRef(null);

  const revokeCurrentUrl = useCallback(() => {
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }
  }, []);

  // Revoke on provider unmount
  useEffect(() => revokeCurrentUrl, [revokeCurrentUrl]);

  const getToken = useCallback(async () => {
    if (accessToken) return accessToken;
    return await refreshAccessToken();
  }, [accessToken, refreshAccessToken]);

  // ── Action: modifyResume ──────────────────────────────────────────────────
  /**
   * Builds a FormData payload, calls the API and stores the generated PDF
   * as an object URL. Returns { url, fileName } so the page can auto-download.
   *
   * @param {{ jobDescription: string, selfDescription?: string, resumeFile?: File }} params
   */
  const modifyResume = useCallback(
    async ({ jobDescription, selfDescription = "", resumeFile }) => {
      setIsModifying(true);
      setModifyError(null);

      try {
        const token = await getToken();

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        if (selfDescription) formData.append("selfDescription", selfDescription);
        if (resumeFile) formData.append("resume", resumeFile);

        const { blob, fileName } = await resumeApi.modifyResume(formData, token);

        revokeCurrentUrl();
        const url = URL.createObjectURL(blob);
        pdfUrlRef.current = url;
        setPdfUrl(url);
        setPdfFileName(fileName);

        return { url, fileName };
      } catch (err) {
        setModifyError(err.message || "Failed to modify resume.");
        throw err;
      } finally {
        setIsModifying(false);
      }
    },
    [getToken, revokeCurrentUrl]
  );

  // ── Action: clearResult ───────────────────────────────────────────────────
  const clearResult = useCallback(() => {
    revokeCurrentUrl();
    setPdfUrl(null);
    setPdfFileName("");
    setModifyError(null);
  }, [revokeCurrentUrl]);

  const value = {
    pdfUrl,
    pdfFileName,
    isModifying,
    modifyError,
    modifyResume,
    clearResult,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};
