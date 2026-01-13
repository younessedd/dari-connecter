const galleryState = {
    filters: [],
    projects: [],
    visible: 0,
    batch: 4,
    currentFilter: "all",
    observer: null,
};

const buildGalleryCard = (project) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.dataset.projectId = project.id;
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="gallery-card__body">
            <span class="gallery-card__tag">${project.category}</span>
            <h3 class="gallery-card__title">${project.title}</h3>
            <p>${project.shortDescription}</p>
        </div>
    `;
    return card;
};

const filterProjects = () => {
    if (galleryState.currentFilter === "all") return galleryState.projects;
    return galleryState.projects.filter(
        (project) => project.category === galleryState.currentFilter
    );
};

const renderProjects = (root) => {
    const filtered = filterProjects();
    const slice = filtered.slice(0, galleryState.visible);

    root.innerHTML = "";
    slice.forEach((project) => root.appendChild(buildGalleryCard(project)));

    const sentinel = document.createElement("div");
    sentinel.id = "gallery-sentinel";
    root.appendChild(sentinel);

    if (galleryState.observer) {
        galleryState.observer.disconnect();
        galleryState.observer.observe(sentinel);
    }
};

const setupInfiniteScroll = (root) => {
    galleryState.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        const filtered = filterProjects();
        if (galleryState.visible >= filtered.length) return;
        galleryState.visible += galleryState.batch;
        renderProjects(root);
    });
    const sentinel = document.getElementById("gallery-sentinel");
    if (sentinel) {
        galleryState.observer.observe(sentinel);
    }
};

const setupFilters = (root) => {
    const buttons = Array.from(root.querySelectorAll(".gallery-filter"));
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.dataset.filter === galleryState.currentFilter) return;
            buttons.forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            galleryState.currentFilter = btn.dataset.filter;
            galleryState.visible = galleryState.batch;
            const grid = document.querySelector(".gallery__grid");
            renderProjects(grid);
        });
    });
};

const bindCardClicks = (root) => {
    root.addEventListener("click", (event) => {
        const card = event.target.closest(".gallery-card");
        if (!card) return;
        const project = galleryState.projects.find((p) => p.id === card.dataset.projectId);
        if (!project) return;
        window.dispatchEvent(
            new CustomEvent("gallery:open", {
                detail: { project },
            })
        );
    });
};

(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/projects.json");
    galleryState.projects = data.projects;
    galleryState.filters = data.filters;
    galleryState.visible = galleryState.batch;
    window.DariConnecter.galleryProjects = data.projects;

    api.whenSectionReady("gallery", () => {
        const section = api.selectSection("gallery");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const filterRoot = section.querySelector('[data-list="filters"]');
        api.hydrateList(filterRoot, data.filters, ({ label, value }, index) => {
            const btn = document.createElement("button");
            btn.className = "gallery-filter";
            btn.dataset.filter = value;
            btn.textContent = label;
            if (index === 0) btn.classList.add("is-active");
            return btn;
        });

        const grid = section.querySelector('[data-list="projects"]');
        renderProjects(grid);
        setupFilters(filterRoot);
        setupInfiniteScroll(grid);
        bindCardClicks(grid);
    });
})();
