fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    // ===== HEADER =====
    document.title = `${data.name} - Resume`; // título da aba

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

    // ===== SKILLS =====
    const skillsContainer = document.getElementById("skills");
    if (skillsContainer && Array.isArray(data.skills)) {
      data.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        skillsContainer.appendChild(li);
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

    // ===== OPEN SOURCE (opcional e só se existir container no HTML) =====
    const opensourceContainer = document.getElementById("opensource");
    if (
      opensourceContainer &&
      Array.isArray(data.opensource) &&
      data.opensource.length > 0
    ) {
      data.opensource.forEach((contribution) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${contribution.project || ""}</h3>
          <p>${contribution.description || ""}</p>
          <p><a href="${contribution.link || "#"}" target="_blank">View Contribution</a></p>
        `;
        opensourceContainer.appendChild(div);
      });
    }

    // ===== FOOTER =====
    const footerEl = document.getElementById("footer");
    if (footerEl) {
      footerEl.textContent = `© ${new Date().getFullYear()} - ${data.name || ""}`;
    }
  })
  .catch((error) => console.error("Error loading the data:", error));
