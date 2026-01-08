// Main interactions: nav, smooth scroll, section highlights, theme toggle
(function () {
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = [...document.querySelectorAll("section[id]")];
  const burger = document.getElementById("menuToggle");
  const navList = document.querySelector(".nav__links");
  const themeToggle = document.getElementById("themeToggle");
  const yearEl = document.getElementById("year");

  function smoothScroll(target) {
    const el = document.querySelector(target);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => smoothScroll(btn.dataset.scroll));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScroll(link.getAttribute("href"));
      navList?.classList.remove("open");
    });
  });

  if (burger) {
    burger.addEventListener("click", () => navList?.classList.toggle("open"));
  }

  // Highlight current section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
          active?.classList.add("active");
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((sec) => observer.observe(sec));

  // Theme toggle (simple dark/light swap via data attribute)
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    root.dataset.theme = "light";
    themeToggle.textContent = "☀";
  }
  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next === "dark" ? "" : "light";
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "light" ? "☀" : "☾";
  });

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
