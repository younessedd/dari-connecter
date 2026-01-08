// Load projects dynamically and hook modal
(async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  try {
    const res = await fetch("data/projects.json");
    const projects = await res.json();
    grid.innerHTML = projects
      .map(
        (p, idx) => `
        <article class="project-card" data-index="${idx}">
          <img src="images/${p.image}" alt="${p.title}" />
          <div class="project-card__overlay">
            <h3 class="project-card__title">${p.title}</h3>
          </div>
        </article>
      `
      )
      .join("");

    grid.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.index || 0);
        window.ProjectModal?.open(projects, index);
      });
    });
  } catch (err) {
    grid.innerHTML = `<p style="color: var(--accent); text-align:center;">Unable to load projects data.</p>`;
    console.error("Projects load error:", err);
  }
})();
