// ===================================================================
// Detecta a lingua selecionada e exibe o texto de página adequado
// ===================================================================

const i18n = {
  en: {
    summary: "Professional Summary",
    experience: "Professional Experience",
    core: "Core Competencies",
    education: "Education",
    projects: "Selected Projects & Research",
    certifications: "Certifications",
    skills: "Skills",
    languages: "Languages",
    volunteering: "Volunteering"
  },
  pt: {
    summary: "Resumo Profissional",
    experience: "Experiência Profissional",
    core: "Competências",
    education: "Formação Acadêmica",
    projects: "Projetos & Pesquisa",
    certifications: "Certificações",
    skills: "Competências Técnicas",
    languages: "Idiomas",
    volunteering: "Voluntariado"
  }
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

// Carrega JSON correto
const PROFILE_FILE = getProfileFile();

// ===================================================================
// Carrega e renderiza
// ===================================================================

function loadCV(file) {
  fetch(file)
    .then((res) => res.json())
    .then((data) => {
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
// Renderiza o currículo
// ===================================================================

function renderCV(data) {
  document.title = `${data.name} - Resume`;

  document.getElementById("name").textContent = data.name || "";
  document.getElementById("title").textContent = data.title || "";
  document.getElementById("subsummary").textContent = data.subsummary || "";
  document.getElementById("contact").textContent =
    `${data.location || ""} | ✉️ ${data.email || ""} | 📱 ${data.phone || ""}`;

  document.getElementById("links").innerHTML = `
    🌐 <a href="${data.linkedin}" target="_blank">LinkedIn</a> |
    <a href="${data.github}" target="_blank">GitHub</a>
  `;

  document.getElementById("summary").textContent = data.summary || "";

  const containers = [
    "experience",
    "core-competencies",
    "education",
    "projects",
    "certifications",
    "skills",
    "languages",
    "volunteering",
  ];

  containers.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  if (Array.isArray(data.experience)) {
    const div = document.getElementById("experience");
    data.experience.forEach((job) => {
      const item = document.createElement("div");

      const tasks =
        job.tasks?.length
          ? `<ul>${job.tasks.map((t) => `<li>${t}</li>`).join("")}</ul>`
          : "";

      item.innerHTML = `
        <h3>${job.title} – ${job.company}</h3>
        <p class="date">${job.date}</p>
        ${tasks}
      `;
      div.appendChild(item);
    });
  }

  if (Array.isArray(data.core_competencies)) {
    const div = document.getElementById("core-competencies");
    data.core_competencies.forEach((c) => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${c.category}:</strong> ${c.items.join(" · ")}`;
      div.appendChild(p);
    });
  }

  if (Array.isArray(data.education)) {
    const div = document.getElementById("education");
    data.education.forEach((edu) => {
      const item = document.createElement("div");

      const comments =
        edu.comments?.length
          ? `<ul>${edu.comments.map((c) => `<li>${c}</li>`).join("")}</ul>`
          : "";

      item.innerHTML = `
        <strong>${edu.degree} in ${edu.field}</strong>
        <p><em>${edu.institution}</em></p>
        <p class="date">${edu.date}</p>
        ${comments}
      `;
      div.appendChild(item);
    });
  }

  if (Array.isArray(data.projects)) {
    const div = document.getElementById("projects");
    data.projects.forEach((proj) => {
      const item = document.createElement("div");

      const bullets =
        proj.bullets?.length
          ? `<ul>${proj.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
          : "";

      item.innerHTML = `
        <h3>${proj.title}</h3>
        ${proj.subtitle ? `<p class="project-subtitle">${proj.subtitle}</p>` : ""}
        ${bullets}
        ${
          proj.repository
            ? `<p><a href="${proj.repository}" target="_blank">GitHub Repository</a></p>`
            : ""
        }
      `;
      div.appendChild(item);
    });
  }

  if (Array.isArray(data.certifications)) {
    const ul = document.getElementById("certifications");
    data.certifications.forEach((cert) => {
      const li = document.createElement("li");
      li.textContent = `${cert.name} - ${cert.institution} (${cert.date})`;
      ul.appendChild(li);
    });
  }

  if (Array.isArray(data.skills)) {
    const ul = document.getElementById("skills");
    data.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      ul.appendChild(li);
    });
  }

  if (Array.isArray(data.languages)) {
    document.getElementById("languages").textContent = data.languages.join(" | ");
  }

  if (Array.isArray(data.volunteering)) {
    const div = document.getElementById("volunteering");
    data.volunteering.forEach((v) => {
      const item = document.createElement("div");
      item.innerHTML = `
        <h3>${v.role} – ${v.organization}</h3>
        <p class="date">${v.date}</p>
        <p>${v.description}</p>
      `;
      div.appendChild(item);
    });
  }

  document.getElementById("footer").textContent =
    `© ${new Date().getFullYear()} - ${data.name}`;
}

// ===================================================================
// Aplica tradução dos títulos
// ===================================================================

function applyI18n(lang) {
  document.querySelector("#summary-section h2").textContent = i18n[lang].summary;
  document.querySelector("#experience-section h2").textContent = i18n[lang].experience;
  document.querySelector("#core-section h2").textContent = i18n[lang].core;
  document.querySelector("#education-section h2").textContent = i18n[lang].education;
  document.querySelector("#projects-section h2").textContent = i18n[lang].projects;
  document.querySelector("#certifications-section h2").textContent = i18n[lang].certifications;
  document.querySelector("#skills-section h2").textContent = i18n[lang].skills;
  document.querySelector("#languages-section h2").textContent = i18n[lang].languages;
  document.querySelector("#volunteering-section h2").textContent = i18n[lang].volunteering;
}
