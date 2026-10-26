import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${API_URL}/api/report`,
  withCredentials: true,
});

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || "Request failed";
  throw new Error(message);
};

const authHeader = (accessToken) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

export const reportApi = {
  /**
   * POST /api/report/generate
   * Sends a FormData payload (resume PDF + jobDescription + selfDescription).
   */
  generateReport: async (formData, accessToken) => {
    try {
      const { data } = await API.post("/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...authHeader(accessToken),
        },
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * GET /api/report/:id
   * Fetches a single full report by its MongoDB ObjectId.
   */
  getReportById: async (id, accessToken) => {
    try {
      const { data } = await API.get(`/${id}`, {
        headers: authHeader(accessToken),
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * GET /api/report/
   * Fetches all reports for the authenticated user (lightweight list).
   * Returns: { count, reports: [{ _id, jobTitle, matchScore, skillGaps, createdAt }] }
   */
  getAllReports: async (accessToken) => {
    try {
      const { data } = await API.get("/", {
        headers: authHeader(accessToken),
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  },
};

