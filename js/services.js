// Load services dynamically from JSON
(async function loadServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;

  try {
    const res = await fetch("data/services.json");
    const services = await res.json();
    grid.innerHTML = services
      .map(
        (svc, idx) => `
        <article class="service-card" data-id="${svc.id}" data-index="${idx}">
          <div class="service-card__icon">
            <img src="images/${svc.icon}" alt="${svc.title} icon" />
          </div>
          <h3>${svc.title}</h3>
          <p>${svc.description}</p>
          <button class="service-card__cta" data-index="${idx}">Read more</button>
        </article>
      `
      )
      .join("");

    const serviceModal = window.ServiceModal;
    if (serviceModal) {
      grid.querySelectorAll(".service-card").forEach((card) => {
        card.addEventListener("click", () => {
          const index = Number(card.dataset.index || 0);
          serviceModal.open(services, index);
        });
      });

      grid.querySelectorAll(".service-card__cta").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const index = Number(btn.dataset.index || 0);
          serviceModal.open(services, index);
        });
      });
    }
  } catch (err) {
    grid.innerHTML = `<p style="color: var(--accent); text-align:center;">Unable to load services data.</p>`;
    console.error("Services load error:", err);
  }
})();
