import { useContext } from "react";
import { ResumeContext } from "../resume.context.jsx";

/**
 * Thin read accessor over ResumeContext.
 *
 * Exposes:
 *   pdfUrl, pdfFileName – generated PDF (object URL) and its file name
 *   isModifying         – true while POST /api/resume/modify is in-flight
 *   modifyError         – error message (null when no error)
 *   modifyResume({ jobDescription, selfDescription?, resumeFile? })
 *     → returns { url, fileName }; throws on failure
 *   clearResult()       – revokes the PDF URL and resets state
 */
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};

export default useResume;
