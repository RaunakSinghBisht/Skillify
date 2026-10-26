import { useState } from "react";

const JobDescriptionSection = ({ value = "", onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxChars = 5000;

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      if (onChange) onChange(text);
    }
  };

  return (
    <div className="job-desc-section">
      <div className="job-desc-section__header">
        <div className="job-desc-section__title-group">
          <span className="job-desc-section__icon">
            {/* Briefcase Icon */}
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <h2 className="job-desc-section__title">Target Job Description</h2>
        </div>
        <span className="job-desc-section__badge">REQUIRED</span>
      </div>

      <div
        className={`job-desc-section__input-container ${
          isFocused ? "job-desc-section__input-container--focused" : ""
        }`}
      >
        <textarea
          className="job-desc-section__textarea"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
          maxLength={maxChars}
          spellCheck="false"
        />

        <div className="job-desc-section__footer">
          <span className="job-desc-section__char-count">
            {value.length} / {maxChars} chars
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionSection;
