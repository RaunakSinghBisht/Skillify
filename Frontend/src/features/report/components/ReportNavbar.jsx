import { Link, NavLink } from "react-router";
import useAuth from "../../auth/hooks/useAuth";
import "../styles/navbar.scss";

const ReportNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="report-navbar">
      <div className="report-navbar__inner">
        <Link to="/" className="report-navbar__brand">
          <span className="report-navbar__brand-name">Skillify</span>
          <div className="report-navbar__brand-dot" />
        </Link>

        <nav className="report-navbar__nav">
          <NavLink
            to="/report/history"
            className={({ isActive }) =>
              `report-navbar__link ${isActive ? "report-navbar__link--active" : ""}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>History</span>
          </NavLink>

          <NavLink
            to="/resume/modify"
            className={({ isActive }) =>
              `report-navbar__link ${isActive ? "report-navbar__link--active" : ""}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>Modify Resume</span>
          </NavLink>
        </nav>

        <div className="report-navbar__actions">
          {user && (
            <div className="report-navbar__user-badge">
              <span className="avatar-icon">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
              <span>{user.username || user.email}</span>
            </div>
          )}

          <button
            type="button"
            className="report-navbar__logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default ReportNavbar;
