import { useState, useRef } from "react";

const ProfileSection = ({
  file,
  onFileChange,
  selfDescription,
  onSelfDescriptionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSelfDescFocused, setIsSelfDescFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (candidateFile) => {
    // Only PDF is supported
    if (!candidateFile.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a PDF file.");
      return;
    }

    // 2MB limit (matches backend)
    if (candidateFile.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    if (onFileChange) {
      onFileChange(candidateFile);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (onFileChange) onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="profile-section">
      {/* ── Section Header ── */}
      <div className="profile-section__header">
        <span className="profile-section__icon">
          {/* User Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <h2 className="profile-section__title">Your Profile</h2>
      </div>

      {/* ── Upload Resume Sub-header ── */}
      <div className="profile-section__sub-header">
        <span className="profile-section__sub-title">Upload Resume</span>
        <span className="profile-section__best-badge">BEST RESULTS</span>
      </div>

      {/* ── Dropzone ── */}
      <div
        className={`profile-section__dropzone ${
          isDragging ? "profile-section__dropzone--dragging" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        {file ? (
          <div className="profile-section__dropzone-selected">
            <div className="profile-section__dropzone-file-info">
              <span className="profile-section__dropzone-file-icon">
                {/* File Document Icon */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
              <div className="profile-section__dropzone-file-details">
                <span className="profile-section__dropzone-file-name" title={file.name}>
                  {file.name}
                </span>
                <span className="profile-section__dropzone-file-size">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="profile-section__dropzone-remove-btn"
              onClick={handleRemoveFile}
              title="Remove file"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <span className="profile-section__dropzone-cloud-icon">
              {/* Cloud Upload Icon */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </span>
            <span className="profile-section__dropzone-text">
              Click to upload or drag & drop
            </span>
            <span className="profile-section__dropzone-hint">
              PDF only (Max 2MB)
            </span>
          </>
        )}
      </div>

      {/* ── OR Divider ── */}
      <div className="profile-section__divider">
        <div className="profile-section__divider-line" />
        <span className="profile-section__divider-text">OR</span>
        <div className="profile-section__divider-line" />
      </div>

      {/* ── Quick Self-Description ── */}
      <div className="profile-section__self-desc-group">
        <span className="profile-section__sub-title">Quick Self-Description</span>
        <div
          className={`profile-section__self-desc-container ${
            isSelfDescFocused
              ? "profile-section__self-desc-container--focused"
              : ""
          }`}
        >
          <textarea
            className="profile-section__self-desc-textarea"
            value={selfDescription}
            onChange={(e) =>
              onSelfDescriptionChange && onSelfDescriptionChange(e.target.value)
            }
            onFocus={() => setIsSelfDescFocused(true)}
            onBlur={() => setIsSelfDescFocused(false)}
            placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
            spellCheck="false"
          />
        </div>
      </div>

      {/* ── Blue Info Banner ── */}
      <div className="profile-section__info-banner">
        <span className="profile-section__info-banner-icon">
          {/* Info Circle Icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <p className="profile-section__info-banner-text">
          Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
          required to generate a personalized plan.
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
