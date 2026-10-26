import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import "../styles/login.scss";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await login(email, password);
      // Redirect to home page on successful login
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
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
      <header className="login-header">
        <div className="login-header__inner">
          <Link to="/" className="login-header__brand">
            <span className="login-header__brand-name">Skillify</span>
            <div className="login-header__brand-dot" />
          </Link>
          <Link to="/register" className="login-header__nav-link">
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="login-main">
        {/* Background atmosphere */}
        <div className="login-bg">
          <div className="login-bg__blob login-bg__blob--red" />
          <div className="login-bg__blob login-bg__blob--pink" />
          <div className="login-bg__grid" />
        </div>

        {/* Glass Card */}
        <div className="login-card">
          {/* Brand */}
          <div className="login-card__brand">
            <div>
              <img
                src="/skillify_logo.png"
                className="login-card__brand-logo"
                alt="Skillify Logo"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <h1 className="login-card__brand-title">Welcome Back</h1>
            <p className="login-card__brand-subtitle">
              Access your career intelligence dashboard
            </p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
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
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-field__label">
                Email Address
              </label>
              <div className="login-field__input-wrap">
                <span className="login-field__icon material-symbols-outlined">
                  mail
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  className="login-field__input"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field__header">
                <label htmlFor="password" className="login-field__label">
                  Password
                </label>
                <a href="#" className="login-field__forgot">
                  Forgot?
                </a>
              </div>
              <div className="login-field__input-wrap">
                <span className="login-field__icon material-symbols-outlined">
                  lock
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="login-field__input"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              {!isSubmitting && (
                <span className="login-btn__arrow material-symbols-outlined">
                  arrow_forward
                </span>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="login-card__footer">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </main>

      {/* ── Page Footer ── */}
      <footer className="login-footer">
        <div className="login-footer__inner">
          <span className="login-footer__brand">Skillify</span>
          <p className="login-footer__copy">
            © 2026 Skillify AI. Precision Engineered for Career Growth.
          </p>
          <div className="login-footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;