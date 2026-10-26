const AnalysisCardFooter = ({
  onSubmit,
  isLoading = false,
  disabled = false,
  label = "Generate My Interview Strategy",
  loadingLabel = "Generating Strategy...",
  metaText = "AI-Powered Strategy Generation • Approx 30s",
}) => {
  return (
    <div className="report-card-footer">
      <div className="report-card-footer__meta">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#94a3b8" }}
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>{metaText}</span>
      </div>

      <button
        type="button"
        className="report-card-footer__submit-btn"
        onClick={onSubmit}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <span className="btn-spinner" />
        ) : (
          <span className="btn-star">★</span>
        )}
        <span>{isLoading ? loadingLabel : label}</span>
      </button>
    </div>
  );
};

export default AnalysisCardFooter;
