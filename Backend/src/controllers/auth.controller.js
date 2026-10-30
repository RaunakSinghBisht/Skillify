import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import sendEmail from "../services/email.service.js";
import { generateOTP, generateOTPHTML } from "../utils/otp.js";
import BlacklistToken from "../models/blacklistToken.model.js";

// In production the frontend and API live on different origins, so the refresh cookie must be
// "none" (cross-site) + secure. Locally both are on localhost (same site), so "strict" works.
const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: config.isProduction ? "none" : "strict",
};
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const otp = generateOTP();
    const otpHTML = generateOTPHTML(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await otpModel.create({
      user: user._id,
      email,
      otp: otpHash,
    });

    try {
      await sendEmail(
        email,
        "Email Verification OTP",
        `Your OTP is: ${otp}`,
        otpHTML,
      );
    } catch (emailError) {
      // Roll back so the user can retry registration with the same email
      await otpModel.deleteMany({ user: user._id });
      await userModel.deleteOne({ _id: user._id });
      return res.status(502).json({ message: "Could not send the verification email. Please try again." });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.verified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email",
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      message: "Email not verified",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    ...refreshCookieOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
};

const refreshTokens = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });
    if (!session) {
      // Logged Out with the Session
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      ...refreshCookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        sessionId: decoded.sessionId,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res
        .status(400)
        .json({ message: "Session not found or already revoked" });
    }

    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken", refreshCookieOptions);

    // Add access token to blacklist if provided
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];
      try {
        await BlacklistToken.create({ token: accessToken });
      } catch (err) {
        // Ignore duplicate errors if token already blacklisted
      }
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in Logging Out : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logoutAll = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany(
      {
        user: decoded.id,
        revoked: false,
      },
      { $set: { revoked: true } },
    );

    res.clearCookie("refreshToken", refreshCookieOptions);

    // Add access token to blacklist if provided
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];
      try {
        await BlacklistToken.create({ token: accessToken });
      } catch (err) {
        // Ignore duplicate errors if token already blacklisted
      }
    }

    return res
      .status(200)
      .json({ message: "Logged out from all sessions successfully" });
  } catch (error) {
    console.error("Error in Logging Out All Sessions : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({ email, otp: otpHash });

  if (!otpDoc) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await userModel.findByIdAndUpdate(
    otpDoc.user,
    {
      verified: true,
    },
    { returnDocument: "after" },
  ); // Mark user as verified

  await otpModel.deleteMany({ user: otpDoc.user });

  res.status(200).json({
    message: "Email verified successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.verified,
    },
  });
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export default {
  registerUser,
  verifyEmail,
  loginUser,
  refreshTokens,
  logout,
  logoutAll,
  getMe,
};
