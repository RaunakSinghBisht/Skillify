import dotenv from 'dotenv'

dotenv.config()

// All Env Var checks (at one place)
if(! process.env.MONGO_URI)
    throw new Error("MONGO_URI is missing in Environment Variables");
if(! process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is missing in Environment Variables");
if(! process.env.EMAIL_USER)
    throw new Error("EMAIL_USER (Nodemailer) is missing in Environment Variables");
if(! process.env.CLIENT_ID)
    throw new Error("Google Console CLIENT_ID is missing in Environment Variables");
if(! process.env.CLIENT_SECRET)
    throw new Error("Google Console CLIENT_SECRET is missing in Environment Variables");
if(! process.env.REFRESH_TOKEN)
    throw new Error("Google Gmail API REFRESH_TOKEN is missing in Environment Variables");
if(! process.env.GEMINI_API_KEY)
    throw new Error("Gemini API KEY is missing in Environment Variables");

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    EMAIL_USER : process.env.EMAIL_USER,
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET : process.env.CLIENT_SECRET,
    REFRESH_TOKEN : process.env.REFRESH_TOKEN,
    geminiApiKey : process.env.GEMINI_API_KEY,
    // Optional settings (safe defaults for local development)
    PORT : process.env.PORT || 3000,
    CLIENT_URL : (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, ""),
    isProduction : process.env.NODE_ENV === "production"
}


export default config;