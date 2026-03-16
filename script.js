// ============================================================
// i18n
// ============================================================

const i18n = {
  en: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    core: "Core Competencies",
    education: "Education",
    publications: "Publications",
    projects: "Selected Projects & Research",
    certifications: "Certifications",
    skills: "Skills",
    languages: "Languages",
    volunteering: "Volunteering",
  },
  pt: {
    summary: "Resumo Profissional",
    experience: "Experiência Profissional",
    core: "Competências",
    education: "Formação Acadêmica",
    publications: "Publicações",
    projects: "Projetos & Pesquisa",
    certifications: "Certificações",
    skills: "Competências Técnicas",
    languages: "Idiomas",
    volunteering: "Voluntariado",
  },
};

// ============================================================
// URL params
// ============================================================

const params = new URLSearchParams(window.location.search);
const cv = params.get("cv") || "industrial";
const lang = params.get("lang") || "pt";

const PROFILE_FILE = `${cv}.${lang}.json?v=${Date.now()}`;

// ============================================================
// Helpers
// ============================================================

function safe(v) {
  return typeof v === "string" ? v : "";
}

function hideSection(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ============================================================
// Load JSON
// ============================================================

fetch(PROFILE_FILE)
  .then((r) => r.json())
  .then((data) => {
    renderCV(data);
    applyI18n(lang);
  })
  .catch((e) => console.error("Erro carregando JSON:", e));

// ============================================================
// Language switch
// ============================================================

function switchLang(newLang) {
  window.location.search = `?cv=${cv}&lang=${newLang}`;
}

// ============================================================
// Render
// ============================================================

function renderCV(data) {

  document.title = `${safe(data.name)} - Resume`;

  setText("name", data.name);
  setText("title", data.title);
  setText("subsummary", data.subsummary);

  setText(
    "contact",
    `${safe(data.location)} | ✉ ${safe(data.email)} | 📱 ${safe(data.phone)}`
  );

  const links = document.getElementById("links");
  if (links) {
    links.innerHTML = `
      <a href="${safe(data.linkedin)}" target="_blank">LinkedIn</a> |
      <a href="${safe(data.github)}" target="_blank">GitHub</a>
    `;
  }

  setText("summary", data.summary);

  renderExperience(data);
  renderCore(data);
  renderEducation(data);
  renderPublications(data);
  renderCertifications(data);
  renderSkills(data);
  renderLanguages(data);
  renderVolunteering(data);

  setText("footer", `© ${new Date().getFullYear()} - ${safe(data.name)}`);
}

// ============================================================
// Experience
// ============================================================

function renderExperience(data) {

  if (!Array.isArray(data.experience) || !data.experience.length) {
    hideSection("experience-section");
    return;
  }

  const div = document.getElementById("experience");

  data.experience.forEach((job) => {

    const el = document.createElement("div");

    const tasks = Array.isArray(job.tasks)
      ? `<ul>${job.tasks.map(t => `<li>${t}</li>`).join("")}</ul>`
      : "";

    el.innerHTML = `
      <h3>${safe(job.title)} – ${safe(job.company)}</h3>
      <p class="date">${safe(job.date)}</p>
      ${tasks}
    `;

    div.appendChild(el);

  });
}

// ============================================================
// Core competencies
// ============================================================

function renderCore(data) {

  if (!Array.isArray(data.core_competencies) || !data.core_competencies.length) {
    hideSection("core-section");
    return;
  }

  const div = document.getElementById("core-competencies");

  data.core_competencies.forEach((c) => {

    const p = document.createElement("p");

    if (typeof c === "string") {
      p.textContent = c;
    }
    else if (c.category && Array.isArray(c.items)) {
      p.innerHTML = `<strong>${c.category}:</strong> ${c.items.join(" · ")}`;
    }

    div.appendChild(p);

  });
}

// ============================================================
// Education
// ============================================================

function renderEducation(data) {

  if (!Array.isArray(data.education) || !data.education.length) {
    hideSection("education-section");
    return;
  }

  const div = document.getElementById("education");

  data.education.forEach((edu) => {

    const el = document.createElement("div");

    const comments = Array.isArray(edu.comments)
      ? `<ul>${edu.comments.map(c => `<li>${c}</li>`).join("")}</ul>`
      : "";

    el.innerHTML = `
      <strong>${safe(edu.degree)}</strong>
      <p><em>${safe(edu.institution)}</em></p>
      <p class="date">${safe(edu.date)}</p>
      ${comments}
    `;

    div.appendChild(el);

  });
}

// ============================================================
// Publications
// ============================================================

function renderPublications(data) {

  if (!Array.isArray(data.publications) || !data.publications.length) {
    hideSection("publications-section");
    return;
  }

  const div = document.getElementById("publications");

  data.publications.forEach((pub) => {

    const el = document.createElement("div");

    el.innerHTML = `
      <h3>${safe(pub.title)}</h3>
      <p><em>${safe(pub.journal)}</em></p>
      <p class="date">${safe(pub.year)}</p>
      ${pub.link ? `<a href="${pub.link}" target="_blank">Publication link</a>` : ""}
    `;

    div.appendChild(el);

  });
}

// ============================================================
// Certifications
// ============================================================

function renderCertifications(data) {

  if (!Array.isArray(data.certifications) || !data.certifications.length) {
    hideSection("certifications-section");
    return;
  }

  const ul = document.getElementById("certifications");

  data.certifications.forEach((cert) => {

    const li = document.createElement("li");

    if (typeof cert === "string") {
      li.textContent = cert;
    }
    else {
      const inst = cert.institution ? ` - ${cert.institution}` : "";
      const date = cert.date ? ` (${cert.date})` : "";
      li.textContent = `${cert.name}${inst}${date}`;
    }

    ul.appendChild(li);

  });
}

// ============================================================
// Skills
// ============================================================

function renderSkills(data) {

  if (!Array.isArray(data.skills) || !data.skills.length) {
    hideSection("skills-section");
    return;
  }

  const ul = document.getElementById("skills");

  data.skills.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });

}

// ============================================================
// Languages
// ============================================================

function renderLanguages(data) {

  if (!Array.isArray(data.languages) || !data.languages.length) {
    hideSection("languages-section");
    return;
  }

  setText("languages", data.languages.join(" | "));

}

// ============================================================
// Volunteering
// ============================================================

function renderVolunteering(data) {

  if (!Array.isArray(data.volunteering) || !data.volunteering.length) {
    hideSection("volunteering-section");
    return;
  }

  const div = document.getElementById("volunteering");

  data.volunteering.forEach((v) => {

    const el = document.createElement("div");

    el.innerHTML = `
      <h3>${safe(v.role)} – ${safe(v.organization)}</h3>
      <p class="date">${safe(v.date)}</p>
      <p>${safe(v.description)}</p>
    `;

    div.appendChild(el);

  });
}

// ============================================================
// Apply i18n
// ============================================================

function applyI18n(lang) {

  const set = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  set("#summary-section h2", i18n[lang].summary);
  set("#experience-section h2", i18n[lang].experience);
  set("#core-section h2", i18n[lang].core);
  set("#education-section h2", i18n[lang].education);
  set("#publications-section h2", i18n[lang].publications);
  set("#projects-section h2", i18n[lang].projects);
  set("#certifications-section h2", i18n[lang].certifications);
  set("#skills-section h2", i18n[lang].skills);
  set("#languages-section h2", i18n[lang].languages);
  set("#volunteering-section h2", i18n[lang].volunteering);

}
