// ===================================================================
// Detecta a lingua selecionada e exibe o texto de página adequado
// ===================================================================

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

// ===================================================================
// Detecta a versão do currículo e idioma pela URL
// ===================================================================

const params = new URLSearchParams(window.location.search);
const cv = params.get("cv") || "industrial";
const lang = params.get("lang") || "en";

function getProfileFile() {
  return `${cv}.${lang}.json`;
}

const PROFILE_FILE = getProfileFile();

// ===================================================================
// Helpers
// ===================================================================

function safeText(v) {
  return typeof v === "string" ? v : "";
}

function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function clearById(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = "";
}

function hideSection(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// ===================================================================
// Carrega JSON
// ===================================================================

function loadCV(file) {
  const bust = Date.now();
  const url = `${file}?v=${bust}`;

  fetch(url, { cache: "no-store" })
    .then((res) => res.json())
    .then((data) => {
      renderCV(data);
      applyI18n(lang);
    })
    .catch((err) => console.error("Erro ao carregar JSON:", err));
}

loadCV(PROFILE_FILE);

// ===================================================================
// Switch idioma
// ===================================================================

function switchLang(newLang) {
  window.location.search = `?cv=${cv}&lang=${newLang}`;
}

// ===================================================================
// Render CV
// ===================================================================

function renderCV(data) {

  document.title = `${safeText(data.name)} - Resume`;

  setTextById("name", data.name);
  setTextById("title", data.title);
  setTextById("subsummary", data.subsummary);

  setTextById(
    "contact",
    `${safeText(data.location)} | ✉️ ${safeText(data.email)} | 📱 ${safeText(data.phone)}`
  );

  const linksEl = document.getElementById("links");
  if (linksEl) {
    linksEl.innerHTML = `
      🌐 <a href="${safeText(data.linkedin)}" target="_blank">LinkedIn</a> |
      <a href="${safeText(data.github)}" target="_blank">GitHub</a>
    `;
  }

  setTextById("summary", data.summary);

  [
    "experience",
    "core-competencies",
    "education",
    "publications",
    "projects",
    "certifications",
    "skills",
    "languages",
    "volunteering",
  ].forEach(clearById);

  // ---------------------------------------------------------------
  // Experience
  // ---------------------------------------------------------------

  if (Array.isArray(data.experience) && data.experience.length) {

    const div = document.getElementById("experience");

    data.experience.forEach((job) => {

      const item = document.createElement("div");

      const tasks = Array.isArray(job.tasks) && job.tasks.length
        ? `<ul>${job.tasks.map((t) => `<li>${t}</li>`).join("")}</ul>`
        : "";

      item.innerHTML = `
        <h3>${safeText(job.title)} – ${safeText(job.company)}</h3>
        <p class="date">${safeText(job.date)}</p>
        ${tasks}
      `;

      div.appendChild(item);
    });

  } else {
    hideSection("experience-section");
  }

  // ---------------------------------------------------------------
  // Core competencies
  // ---------------------------------------------------------------

  if (Array.isArray(data.core_competencies) && data.core_competencies.length) {

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

  } else {
    hideSection("core-section");
  }

  // ---------------------------------------------------------------
  // Education
  // ---------------------------------------------------------------

  if (Array.isArray(data.education) && data.education.length) {

    const div = document.getElementById("education");

    data.education.forEach((edu) => {

      const item = document.createElement("div");

      const comments = Array.isArray(edu.comments) && edu.comments.length
        ? `<ul>${edu.comments.map((c) => `<li>${c}</li>`).join("")}</ul>`
        : "";

      item.innerHTML = `
        <strong>${safeText(edu.degree)}</strong>
        <p><em>${safeText(edu.institution)}</em></p>
        <p class="date">${safeText(edu.date)}</p>
        ${comments}
      `;

      div.appendChild(item);
    });

  } else {
    hideSection("education-section");
  }

  // ---------------------------------------------------------------
  // Publications
  // ---------------------------------------------------------------

  if (Array.isArray(data.publications) && data.publications.length) {

    const div = document.getElementById("publications");

    data.publications.forEach((pub) => {

      const item = document.createElement("div");

      item.innerHTML = `
        <h3>${safeText(pub.title)}</h3>
        <p><em>${safeText(pub.journal)}</em></p>
        <p class="date">${safeText(pub.year)}</p>
        ${
          pub.link
            ? `<p><a href="${pub.link}" target="_blank">Publication link</a></p>`
            : ""
        }
      `;

      div.appendChild(item);
    });

  } else {
    hideSection("publications-section");
  }

  // ---------------------------------------------------------------
  // Certifications
  // ---------------------------------------------------------------

  if (Array.isArray(data.certifications) && data.certifications.length) {

    const ul = document.getElementById("certifications");

    data.certifications.forEach((cert) => {

      const li = document.createElement("li");

      if (typeof cert === "string") {
        li.textContent = cert;
      }

      else {
        li.textContent =
          `${safeText(cert.name)} - ${safeText(cert.institution)} (${safeText(cert.date)})`;
      }

      ul.appendChild(li);
    });

  } else {
    hideSection("certifications-section");
  }

  // ---------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------

  if (Array.isArray(data.skills) && data.skills.length) {

    const ul = document.getElementById("skills");

    data.skills.forEach((skill) => {

      const li = document.createElement("li");
      li.textContent = skill;
      ul.appendChild(li);

    });

  } else {
    hideSection("skills-section");
  }

  // ---------------------------------------------------------------
  // Languages
  // ---------------------------------------------------------------

  if (Array.isArray(data.languages) && data.languages.length) {

    setTextById("languages", data.languages.join(" | "));

  } else {
    hideSection("languages-section");
  }

  // ---------------------------------------------------------------
  // Volunteering
  // ---------------------------------------------------------------

  if (Array.isArray(data.volunteering) && data.volunteering.length) {

    const div = document.getElementById("volunteering");

    data.volunteering.forEach((v) => {

      const item = document.createElement("div");

      item.innerHTML = `
        <h3>${safeText(v.role)} – ${safeText(v.organization)}</h3>
        <p class="date">${safeText(v.date)}</p>
        <p>${safeText(v.description)}</p>
      `;

      div.appendChild(item);
    });

  } else {
    hideSection("volunteering-section");
  }

  setTextById("footer", `© ${new Date().getFullYear()} - ${safeText(data.name)}`);

}

// ===================================================================
// Aplica tradução
// ===================================================================

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
