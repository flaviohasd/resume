fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    // ===== HEADER =====
    document.title = `${data.name} - Resume`;

    const nameEl = document.getElementById("name");
    const titleEl = document.getElementById("title");
    const subsummaryEl = document.getElementById("subsummary");
    const contactEl = document.getElementById("contact");
    const linksEl = document.getElementById("links");
    const summaryEl = document.getElementById("summary");

    if (nameEl) nameEl.textContent = data.name || "";
    if (titleEl) titleEl.textContent = data.title || "";
    if (subsummaryEl) subsummaryEl.textContent = data.subsummary || "";

    if (contactEl) {
      contactEl.textContent = `${data.location || ""} | ✉️ ${data.email || ""}`;
    }

    if (linksEl) {
      linksEl.innerHTML = `
        🌐 <a href="${data.linkedin || "#"}" target="_blank">LinkedIn</a> |
        <a href="${data.github || "#"}" target="_blank">GitHub</a>
      `;
    }

    if (summaryEl) {
      summaryEl.textContent = data.summary || "";
    }

    // ===== SELECTED PROJECTS & RESEARCH =====
    const projectsContainer = document.getElementById("projects");
    if (projectsContainer && Array.isArray(data.projects)) {
      data.projects.forEach((proj) => {
        const div = document.createElement("div");

        let bulletsHtml = "";
        if (Array.isArray(proj.bullets) && proj.bullets.length > 0) {
          bulletsHtml = `
            <ul>
              ${proj.bullets.map((b) => `<li>${b}</li>`).join("")}
            </ul>
          `;
        }

        div.innerHTML = `
          <h3 class="project-title">${proj.title || ""}</h3>
          <p class="project-subtitle">${proj.subtitle || ""}</p>
          ${bulletsHtml}
          ${
            proj.repository
              ? `<p class="project-link"><a href="${proj.repository}" target="_blank">GitHub Repository</a></p>`
              : ""
          }
        `;
        projectsContainer.appendChild(div);
      });
    }

    // ===== EXPERIENCE =====
    const experienceContainer = document.getElementById("experience");
    if (experienceContainer && Array.isArray(data.experience)) {
      data.experience.forEach((job) => {
        const jobDiv = document.createElement("div");

        const tasksHtml =
          Array.isArray(job.tasks) && job.tasks.length > 0
            ? `<ul>${job.tasks.map((t) => `<li>${t}</li>`).join("")}</ul>`
            : "";

        jobDiv.innerHTML = `
          <h3>${job.title || ""} – ${job.company || ""}</h3>
          <p class="date">${job.date || ""}</p>
          ${tasksHtml}
        `;

        experienceContainer.appendChild(jobDiv);
      });
    }

    // ===== EDUCATION =====
    const educationContainer = document.getElementById("education");
    if (educationContainer && Array.isArray(data.education)) {
      data.education.forEach((edu) => {
        const eduDiv = document.createElement("div");

        let commentsHtml = "";
        if (Array.isArray(edu.comments) && edu.comments.length > 0) {
          commentsHtml = `
            <ul>
              ${edu.comments.map((c) => `<li>${c}</li>`).join("")}
            </ul>
          `;
        }

        eduDiv.innerHTML = `
          <strong>${edu.degree || ""} in ${edu.field || ""}</strong>
          <p><em>${edu.institution || ""}</em></p>
          <p class="date">${edu.date || ""}</p>
          ${commentsHtml}
        `;

        educationContainer.appendChild(eduDiv);
      });
    }

    // ===== CORE COMPETENCIES =====
    const coreContainer = document.getElementById("core-competencies");
    if (coreContainer && Array.isArray(data.core_competencies)) {
      data.core_competencies.forEach((comp) => {
        const p = document.createElement("p");
        const itemsText = Array.isArray(comp.items)
          ? comp.items.join(" · ")
          : "";
        p.innerHTML = `<strong>${comp.category}:</strong> ${itemsText}`;
        coreContainer.appendChild(p);
      });
    }

    // ===== CERTIFICATIONS =====
    const certificationsContainer = document.getElementById("certifications");
    if (certificationsContainer && Array.isArray(data.certifications)) {
      data.certifications.forEach((cert) => {
        const li = document.createElement("li");
        li.textContent = `${cert.name} - ${cert.institution} (${cert.date})`;
        certificationsContainer.appendChild(li);
      });
    }

    // ===== LANGUAGES =====
    const languagesEl = document.getElementById("languages");
    if (languagesEl) {
      if (Array.isArray(data.languages)) {
        languagesEl.textContent = data.languages.join(" | ");
      } else {
        languagesEl.textContent = data.languages || "";
      }
    }

    // ===== VOLUNTEERING (opcional) =====
    const volunteeringContainer = document.getElementById("volunteering");
    if (
      volunteeringContainer &&
      Array.isArray(data.volunteering) &&
      data.volunteering.length > 0
    ) {
      data.volunteering.forEach((volunteer) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${volunteer.role || ""} – ${volunteer.organization || ""}</h3>
          <p class="date">${volunteer.date || ""}</p>
          <p>${volunteer.description || ""}</p>
        `;
        volunteeringContainer.appendChild(div);
      });
    }

    // ===== FOOTER =====
    const footerEl = document.getElementById("footer");
    if (footerEl) {
      footerEl.textContent = `© ${new Date().getFullYear()} - ${data.name || ""}`;
    }
  })
  .catch((error) => console.error("Error loading the data:", error));
