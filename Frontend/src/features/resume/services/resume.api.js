import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${API_URL}/api/resume`,
  withCredentials: true,
});

// With responseType "blob", error bodies arrive as a Blob too, so decode the JSON message out of it
const handleError = async (error) => {
  let message = error.response?.data?.message || error.message || "Request failed";
  const body = error.response?.data;
  if (body instanceof Blob) {
    try {
      message = JSON.parse(await body.text()).message || message;
    } catch {
      // keep the fallback message
    }
  }
  throw new Error(message);
};

const authHeader = (accessToken) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

export const resumeApi = {
  /**
   * POST /api/resume/modify
   * Sends a FormData payload (resume PDF + jobDescription + selfDescription).
   * Returns { blob, fileName } for the generated PDF.
   */
  modifyResume: async (formData, accessToken) => {
    try {
      const response = await API.post("/modify", formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
          ...authHeader(accessToken),
        },
      });

      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);

      return {
        blob: response.data,
        fileName: match ? match[1] : "Tailored_Resume.pdf",
      };
    } catch (error) {
      await handleError(error);
    }
  },
};
