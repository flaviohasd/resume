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
// Carrega e renderiza
// ===================================================================

function loadCV(file) {
  // Cache-bust para evitar CDN/Browser cache
  const bust = Date.now();
  const url = `${file}?v=${bust}`;

  console.log("[CV] cv param:", cv);
  console.log("[CV] lang param:", lang);
  console.log("[CV] loading file:", file);
  console.log("[CV] request url:", url);

  fetch(url, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${file}`);
      return res.text();
    })
    .then((text) => {
      // Remove BOM e espaços
      const cleaned = text.replace(/^\uFEFF/, "").trim();
      let data;
      try {
        data = JSON.parse(cleaned);
      } catch (e) {
        console.error("[CV] JSON inválido. Início:", cleaned.slice(0, 300));
        throw e;
      }

      renderCV(data);
      applyI18n(lang);
    })
    .catch((err) => console.error("Erro ao carregar JSON:", err));
}

loadCV(PROFILE_FILE);

// ===================================================================
// Troca idioma via reload (bom para compartilhamento/ATS)
// ===================================================================

function switchLang(newLang) {
  window.location.search = `?cv=${cv}&lang=${newLang}`;
}

// ===================================================================
// Helpers
// ===================================================================

function safeText(v) {
  return typeof v === "string" ? v : "";
}

function joinOrEmpty(arr, sep = " · ") {
  const a = Array.isArray(arr) ? arr.filter(Boolean) : [];
  return a.length ? a.join(sep) : "";
}

function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function clearById(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = "";
}

// ===================================================================
// Renderiza o currículo
// ===================================================================

function renderCV(data) {
  document.title = `${safeText(data.name)} - Resume`;

  setTextById("name", safeText(data.name));
  setTextById("title", safeText(data.title));
  setTextById("subsummary", safeText(data.subsummary));

  setTextById(
    "contact",
    `${safeText(data.location)} | ✉️ ${safeText(data.email)} | 📱 ${safeText(data.phone)}`
  );

  const linksEl = document.getElementById("links");
  if (linksEl) {
    linksEl.innerHTML = `
      🌐 <a href="${safeText(data.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a> |
      <a href="${safeText(data.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
    `;
  }

  setTextById("summary", safeText(data.summary));

  // Limpa containers
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
  if (Array.isArray(data.experience)) {
    const div = document.getElementById("experience");
    if (div) {
      data.experience.forEach((job) => {
        const item = document.createElement("div");

        const tasks = Array.isArray(job?.tasks) && job.tasks.length
          ? `<ul>${job.tasks.map((t) => `<li>${t}</li>`).join("")}</ul>`
          : "";

        item.innerHTML = `
          <h3>${safeText(job.title)} – ${safeText(job.company)}</h3>
          <p class="date">${safeText(job.date)}</p>
          ${tasks}
        `;
        div.appendChild(item);
      });
    }
  }

  // ---------------------------------------------------------------
  // Core competencies
  // ---------------------------------------------------------------
  if (Array.isArray(data.core_competencies)) {
    const div = document.getElementById("core-competencies");
    if (div) {
      data.core_competencies.forEach((c) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${safeText(c.category)}:</strong> ${joinOrEmpty(c.items)}`;
        div.appendChild(p);
      });
    }
  }

  // ---------------------------------------------------------------
  // Education (in/em conforme idioma)
  // ---------------------------------------------------------------
  if (Array.isArray(data.education)) {
    const div = document.getElementById("education");
    if (div) {
      data.education.forEach((edu) => {
        const item = document.createElement("div");

        const comments = Array.isArray(edu?.comments) && edu.comments.length
          ? `<ul>${edu.comments.map((c) => `<li>${c}</li>`).join("")}</ul>`
          : "";

        const connector = lang === "pt" ? "em" : "in";
        const degreeLine = edu.field
          ? `<strong>${safeText(edu.degree)} ${connector} ${safeText(edu.field)}</strong>`
          : `<strong>${safeText(edu.degree)}</strong>`;

        item.innerHTML = `
          ${degreeLine}
          <p><em>${safeText(edu.institution)}</em></p>
          <p class="date">${safeText(edu.date)}</p>
          ${comments}
        `;
        div.appendChild(item);
      });
    }
  }

  // ---------------------------------------------------------------
  // Publications
  // ---------------------------------------------------------------
  if (Array.isArray(data.publications)) {
    const div = document.getElementById("publications");
    if (div) {
      data.publications.forEach((pub) => {
        const item = document.createElement("div");

        const journal = pub.journal ? `<p><em>${safeText(pub.journal)}</em></p>` : "";
        const year = pub.year ? `<p class="date">${safeText(pub.year)}</p>` : "";
        const link = pub.link
          ? `<p><a href="${pub.link}" target="_blank" rel="noopener noreferrer">Publication link</a></p>`
          : "";

        item.innerHTML = `
          <h3>${safeText(pub.title)}</h3>
          ${journal}
          ${year}
          ${link}
        `;
        div.appendChild(item);
      });
    }
  }

  // ---------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------
  if (Array.isArray(data.projects)) {
    const div = document.getElementById("projects");
    if (div) {
      data.projects.forEach((proj) => {
        const item = document.createElement("div");

        const bullets = Array.isArray(proj?.bullets) && proj.bullets.length
          ? `<ul>${proj.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
          : "";

        const repoLink = proj.repository
          ? `<p><a href="${proj.repository}" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>`
          : "";

        const link = proj.link
          ? `<p><a href="${proj.link}" target="_blank" rel="noopener noreferrer">Link</a></p>`
          : "";

        item.innerHTML = `
          <h3>${safeText(proj.title)}</h3>
          ${proj.subtitle ? `<p class="project-subtitle">${safeText(proj.subtitle)}</p>` : ""}
          ${bullets}
          ${repoLink}
          ${link}
        `;
        div.appendChild(item);
      });
    }
  }

  // ---------------------------------------------------------------
  // Certifications
  // ---------------------------------------------------------------
  if (Array.isArray(data.certifications)) {
    const ul = document.getElementById("certifications");
    if (ul) {
      data.certifications.forEach((cert) => {
        const li = document.createElement("li");
        li.textContent = `${safeText(cert.name)} - ${safeText(cert.institution)} (${safeText(cert.date)})`;
        ul.appendChild(li);
      });
    }
  }

  // ---------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------
  if (Array.isArray(data.skills)) {
    const ul = document.getElementById("skills");
    if (ul) {
      data.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        ul.appendChild(li);
      });
    }
  }

  // ---------------------------------------------------------------
  // Languages
  // ---------------------------------------------------------------
  if (Array.isArray(data.languages)) {
    setTextById("languages", data.languages.join(" | "));
  }

  // ---------------------------------------------------------------
  // Volunteering
  // ---------------------------------------------------------------
  if (Array.isArray(data.volunteering)) {
    const div = document.getElementById("volunteering");
    if (div) {
      data.volunteering.forEach((v) => {
        const item = document.createElement("div");
        item.innerHTML = `
          <h3>${safeText(v.role)} – ${safeText(v.organization)}</h3>
          <p class="date">${safeText(v.date)}</p>
          <p>${safeText(v.description)}</p>
        `;
        div.appendChild(item);
      });
    }
  }

  setTextById("footer", `© ${new Date().getFullYear()} - ${safeText(data.name)}`);
}

// ===================================================================
// Aplica tradução dos títulos
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
