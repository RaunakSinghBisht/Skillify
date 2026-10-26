import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import "../styles/register.scss";

const Register = () => {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState("");

  // Flow & Loading states
  const [step, setStep] = useState("register"); // "register" | "verify"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      setSuccessMessage("OTP sent to your email. Please verify.");
      setStep("verify");
    } catch (err) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail(email, otp);
      setSuccessMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* ── Google Fonts ── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
      />

      {/* ── Header ── */}
      <header className="reg-header">
        <div className="reg-header__inner">
          <Link to="/" className="reg-header__brand">
            <span className="reg-header__brand-name">Skillify</span>
            <div className="reg-header__brand-dot" />
          </Link>

          <div className="reg-header__actions">
            <Link to="/login" className="reg-header__link">
              Sign In
            </Link>
            <button className="reg-header__cta" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="register-main">
        {/* Background atmosphere */}
        <div className="reg-bg">
          <div className="reg-bg__blob reg-bg__blob--red" />
          <div className="reg-bg__blob reg-bg__blob--pink" />
        </div>

        <div className="register-container">
          {/* Hero text */}
          <div className="register-hero">
            <h1 className="register-hero__title">
              {step === "register" ? "Optimize Your Future" : "Verify Your Account"}
            </h1>
            <p className="register-hero__sub">
              {step === "register"
                ? "Join the next generation of AI-augmented professionals."
                : "Please enter the 6-digit verification code sent to your email."}
            </p>
          </div>

          {/* Glass Card */}
          <div className="register-card">
            {/* Status indicator */}
            <div className="register-card__status">
              <span className="register-card__status-dot" />
              <span className="register-card__status-text">
                {step === "register" ? "System Ready" : "Verifying"}
              </span>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div
                style={{
                  color: "#ffb4ab",
                  backgroundColor: "rgba(147, 0, 10, 0.2)",
                  border: "1px solid #ffb4ab",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontSize: "0.8125rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div
                style={{
                  color: "#c6c6c7",
                  backgroundColor: "rgba(32, 32, 31, 0.6)",
                  border: "1px solid #ffb4aa",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontSize: "0.8125rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {successMessage}
              </div>
            )}

            {step === "register" ? (
              /* Registration Form */
              <form className="register-form" onSubmit={handleRegisterSubmit}>
                {/* Full Name */}
                <div className="reg-field">
                  <label className="reg-field__label">Full Name</label>
                  <div className="reg-field__input-wrap">
                    <span className="reg-field__icon material-symbols-outlined">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="reg-field__input"
                      autoComplete="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="reg-field">
                  <label className="reg-field__label">Email Address</label>
                  <div className="reg-field__input-wrap">
                    <span className="reg-field__icon material-symbols-outlined">
                      mail
                    </span>
                    <input
                      type="email"
                      placeholder="john@skillify.ai"
                      className="reg-field__input"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Password row */}
                <div className="reg-password-row">
                  <div className="reg-field">
                    <label className="reg-field__label">Password</label>
                    <div className="reg-field__input-wrap">
                      <span className="reg-field__icon material-symbols-outlined">
                        lock
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="reg-field__input"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-field__label">Confirm</label>
                    <div className="reg-field__input-wrap">
                      <span className="reg-field__icon material-symbols-outlined">
                        verified_user
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="reg-field__input"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="reg-terms">
                  <input
                    type="checkbox"
                    id="terms"
                    className="reg-terms__checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="terms" className="reg-terms__label">
                    I agree to the <a href="#">Terms</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="reg-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            ) : (
              /* OTP Verification Form */
              <form className="register-form" onSubmit={handleVerifySubmit}>
                {/* OTP Code */}
                <div className="reg-field">
                  <label className="reg-field__label">Verification Code</label>
                  <div className="reg-field__input-wrap">
                    <span className="reg-field__icon material-symbols-outlined">
                      pin
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="reg-field__input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="reg-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* Footer link */}
            <div className="register-card__footer">
              <p>
                {step === "register" ? (
                  <>
                    Already have an account?{" "}
                    <Link to="/login">Sign In</Link>
                  </>
                ) : (
                  <span
                    style={{ cursor: "pointer", color: "#ffb4aa" }}
                    onClick={() => setStep("register")}
                  >
                    ← Back to Registration
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Page Footer ── */}
      <footer className="reg-footer">
        <div className="reg-footer__inner">
          <div className="reg-footer__brand">
            <span className="reg-footer__brand-name">Skillify</span>
            <span className="reg-footer__brand-tag">Precision AI</span>
          </div>

          <div className="reg-footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">API Docs</a>
            <a href="#">Contact</a>
          </div>

          <p className="reg-footer__copy">
            © 2026 Skillify AI. Precision Engineered for Career Growth.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Register;