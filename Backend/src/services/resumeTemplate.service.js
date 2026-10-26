const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const has = (value) => typeof value === "string" && value.trim().length > 0;

const dateRange = (start, end) => [start, end].filter(has).join(" – ");

const bulletList = (bullets = []) => {
    const items = bullets.filter(has);
    if (!items.length) return "";
    return `<ul>${items.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;
};

// Only http(s) links become anchors, so a model-produced "javascript:" URL can never be rendered as a link
const link = (url, label) => {
    if (!has(url)) return "";
    const text = escapeHtml(label || url.replace(/^https?:\/\//, ""));
    if (!/^https?:\/\//i.test(url)) return text;
    return `<a href="${escapeHtml(url)}">${text}</a>`;
};

const section = (title, body) =>
    body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : "";

const renderContact = (contact = {}) => {
    const parts = [
        has(contact.email) ? escapeHtml(contact.email) : "",
        has(contact.phone) ? escapeHtml(contact.phone) : "",
        has(contact.location) ? escapeHtml(contact.location) : "",
        link(contact.linkedin),
        link(contact.github),
        link(contact.portfolio),
    ].filter(Boolean);
    return parts.join(" &nbsp;|&nbsp; ");
};

const renderSkills = (skills = []) =>
    skills
        .filter((s) => (s.items || []).some(has))
        .map(
            (s) =>
                `<p class="skill-row"><strong>${escapeHtml(s.category)}:</strong> ${escapeHtml(
                    s.items.filter(has).join(", ")
                )}</p>`
        )
        .join("");

const renderExperience = (experience = []) =>
    experience
        .map(
            (e) => `
        <div class="entry">
          <div class="entry-head">
            <span><strong>${escapeHtml(e.role)}</strong>${has(e.company) ? `, ${escapeHtml(e.company)}` : ""}${
                has(e.location) ? ` · ${escapeHtml(e.location)}` : ""
            }</span>
            <span class="date">${escapeHtml(dateRange(e.startDate, e.endDate))}</span>
          </div>
          ${bulletList(e.bullets)}
        </div>`
        )
        .join("");

const renderProjects = (projects = []) =>
    projects
        .map(
            (p) => `
        <div class="entry">
          <div class="entry-head">
            <span><strong>${escapeHtml(p.name)}</strong>${
                (p.techStack || []).some(has) ? ` | <em>${escapeHtml(p.techStack.filter(has).join(", "))}</em>` : ""
            }</span>
            <span class="date">${link(p.link, "Link")}</span>
          </div>
          ${bulletList(p.bullets)}
        </div>`
        )
        .join("");

const renderEducation = (education = []) =>
    education
        .map((e) => {
            const degree = [e.degree, e.field].filter(has).join(", ");
            return `
        <div class="entry">
          <div class="entry-head">
            <span><strong>${escapeHtml(e.institution)}</strong>${degree ? `, ${escapeHtml(degree)}` : ""}${
                has(e.grade) ? ` · ${escapeHtml(e.grade)}` : ""
            }</span>
            <span class="date">${escapeHtml(dateRange(e.startDate, e.endDate))}</span>
          </div>
        </div>`;
        })
        .join("");

export function renderResumeHtml(resume) {
    const contact = renderContact(resume.contact);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(resume.fullName)} - Resume</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.4; color: #1a1a1a; }
  header { text-align: center; margin-bottom: 10px; }
  h1 { font-size: 22pt; letter-spacing: 0.5px; }
  .contact { font-size: 9.5pt; color: #444; margin-top: 4px; }
  a { color: #1a1a1a; text-decoration: none; }
  section { margin-top: 12px; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #1a1a1a; padding-bottom: 2px; margin-bottom: 6px; }
  .entry { margin-bottom: 8px; page-break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; gap: 12px; }
  .date { white-space: nowrap; color: #444; font-size: 9.5pt; }
  ul { margin: 3px 0 0 18px; }
  li { margin-bottom: 2px; }
  .skill-row { margin-bottom: 2px; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(resume.fullName)}</h1>
    ${contact ? `<div class="contact">${contact}</div>` : ""}
  </header>
  ${section("Summary", has(resume.summary) ? `<p>${escapeHtml(resume.summary)}</p>` : "")}
  ${section("Skills", renderSkills(resume.skills))}
  ${section("Experience", renderExperience(resume.experience))}
  ${section("Projects", renderProjects(resume.projects))}
  ${section("Education", renderEducation(resume.education))}
  ${section("Certifications", bulletList(resume.certifications))}
  ${section("Achievements", bulletList(resume.achievements))}
</body>
</html>`;
}
