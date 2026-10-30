import config from "../config/config.js";
import MailComposer from "nodemailer/lib/mail-composer/index.js";

// Gmail is called over HTTPS (port 443) instead of SMTP: hosts like Render block outbound SMTP ports,
// which made the register request hang until it timed out.
const REQUEST_TIMEOUT_MS = 15000;

let cachedAccessToken = null;
let cachedExpiresAt = 0;

const getAccessToken = async () => {
  // Reuse the token until 1 minute before it expires
  if (cachedAccessToken && Date.now() < cachedExpiresAt - 60 * 1000) {
    return cachedAccessToken;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      refresh_token: config.REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Google token refresh failed: ${data.error_description || data.error}`);
  }

  cachedAccessToken = data.access_token;
  cachedExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedAccessToken;
};

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const message = await new MailComposer({
      from: `"Authentication System" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    }).compile().build();

    const accessToken = await getAccessToken();

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: message.toString("base64url") }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Gmail API error ${response.status}: ${data.error?.message || "unknown"}`);
    }

    console.log("Message sent: %s", data.id);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
