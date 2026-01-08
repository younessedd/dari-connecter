// Popup modal controller for projects
(function () {
  const modal = document.getElementById("modalOverlay");
  const backdrop = modal?.querySelector("[data-close]");
  const closeBtn = modal?.querySelector(".modal__close");
  const nextBtn = document.getElementById("modalNext");
  const prevBtn = document.getElementById("modalPrev");
  const imgEl = document.getElementById("modalImage");
  const titleEl = document.getElementById("modalTitle");
  const descEl = document.getElementById("modalDescription");

  let items = [];
  let currentIndex = 0;

  function render() {
    if (!items.length || !modal) return;
    const item = items[currentIndex];
    imgEl.src = `images/${item.image}`;
    imgEl.alt = item.title;
    titleEl.textContent = item.title;
    descEl.textContent = item.longDescription || item.description;
  }

  function open(data, index = 0) {
    items = data;
    currentIndex = index;
    render();
    modal?.classList.remove("hidden");
    modal?.setAttribute("aria-hidden", "false");
  }

  function close() {
    modal?.classList.add("hidden");
    modal?.setAttribute("aria-hidden", "true");
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  window.ProjectModal = { open, close };
})();

// Popup modal controller for services
(function () {
  const modal = document.getElementById("serviceModal");
  const backdrop = modal?.querySelector("[data-service-close]");
  const closeBtn = modal?.querySelector(".modal__close");
  const nextBtn = document.getElementById("serviceModalNext");
  const prevBtn = document.getElementById("serviceModalPrev");
  const imgEl = document.getElementById("serviceModalImage");
  const titleEl = document.getElementById("serviceModalTitle");
  const descEl = document.getElementById("serviceModalDescription");

  let items = [];
  let currentIndex = 0;

  function render() {
    if (!items.length || !modal) return;
    const item = items[currentIndex];
    imgEl.src = `images/${item.image}`;
    imgEl.alt = item.title;
    titleEl.textContent = item.title;
    descEl.textContent = item.longDescription || item.description;
  }

  function open(data, index = 0) {
    items = data;
    currentIndex = index;
    render();
    modal?.classList.remove("hidden");
    modal?.setAttribute("aria-hidden", "false");
  }

  function close() {
    modal?.classList.add("hidden");
    modal?.setAttribute("aria-hidden", "true");
  }

  function next() {
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }

  function prev() {
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);
  document.addEventListener("keydown", (e) => {
    if (modal?.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  window.ServiceModal = { open, close };
})();
