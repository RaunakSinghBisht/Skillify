import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js'
import config from './config/config.js'
import reportRoutes from './routes/report.route.js'
import resumeRoutes from './routes/resume.route.js'

const app = express();

// Render (and most hosts) sit behind a reverse proxy; needed for correct req.ip / secure handling
app.set("trust proxy", 1);

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


// Health check for the hosting platform
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/resume", resumeRoutes);


export default app;
