// ===================================================================
// Detecta a versão do currículo pela URL
// Ex: resume?cae  -> carrega "cae.json"
// ===================================================================

function getProfileFile() {
  const params = new URLSearchParams(window.location.search);
  const profile = params.get("cv") || "industrial"; // default
  const lang = params.get("lang") || "en"; // default EN
  return `${profile}.${lang}.json`;
}

// Carrega o JSON correto
const PROFILE_FILE = getProfileFile();

// ===================================================================
// Renderiza o currículo
// ===================================================================

function loadCV(file) {
  fetch(file)
    .then((res) => res.json())
    .then((data) => renderCV(data))
    .catch((err) => console.error("Erro ao carregar JSON:", err));
}

loadCV(PROFILE_FILE);

// ===================================================================
// Função que preenche o currículo com os dados carregados
// ===================================================================

function renderCV(data) {
  // HEADER
  document.title = `${data.name} - Resume`;

  document.getElementById("name").textContent = data.name || "";
  document.getElementById("title").textContent = data.title || "";
  document.getElementById("subsummary").textContent = data.subsummary || "";
  document.getElementById(
    "contact"
  ).textContent = `${data.location || ""} | ✉️ ${data.email || ""} | 📱 ${data.phone || ""}`;

  document.getElementById("links").innerHTML = `
    🌐 <a href="${data.linkedin}" target="_blank">LinkedIn</a> |
    <a href="${data.github}" target="_blank">GitHub</a>
  `;

  document.getElementById("summary").textContent = data.summary || "";

  // LIMPA CONTAINERS
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

  // EXPERIENCE
  if (Array.isArray(data.experience)) {
    const div = document.getElementById("experience");
    data.experience.forEach((job) => {
      const item = document.createElement("div");

      const tasks =
        job.tasks && job.tasks.length
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

  // CORE COMPETENCIES
  if (Array.isArray(data.core_competencies)) {
    const div = document.getElementById("core-competencies");
    data.core_competencies.forEach((c) => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${c.category}:</strong> ${c.items.join(" · ")}`;
      div.appendChild(p);
    });
  }

  // EDUCATION
  if (Array.isArray(data.education)) {
    const div = document.getElementById("education");
    data.education.forEach((edu) => {
      const item = document.createElement("div");

      const comments =
        edu.comments && edu.comments.length
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

  // PROJECTS
  if (Array.isArray(data.projects)) {
    const div = document.getElementById("projects");
    data.projects.forEach((proj) => {
      const item = document.createElement("div");

      const bullets =
        proj.bullets && proj.bullets.length
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

  // CERTIFICATIONS
  if (Array.isArray(data.certifications)) {
    const ul = document.getElementById("certifications");
    data.certifications.forEach((cert) => {
      const li = document.createElement("li");
      li.textContent = `${cert.name} - ${cert.institution} (${cert.date})`;
      ul.appendChild(li);
    });
  }

  // SKILLS
  if (Array.isArray(data.skills)) {
    const ul = document.getElementById("skills");
    data.skills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      ul.appendChild(li);
    });
  }

  // LANGUAGES
  if (Array.isArray(data.languages)) {
    document.getElementById("languages").textContent =
      data.languages.join(" | ");
  }

  // VOLUNTEERING
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

  // FOOTER
  document.getElementById("footer").textContent = `© ${new Date().getFullYear()} - ${data.name}`;
}
