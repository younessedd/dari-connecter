const popupState = {
    isOpen: false,
    projects: [],
    index: 0,
};

const popupTemplate = () => {
    const wrapper = document.createElement("div");
    wrapper.className = "popup";
    wrapper.innerHTML = `
        <div class="popup__overlay"></div>
        <div class="popup__window" role="dialog" aria-modal="true">
            <button class="popup__close" aria-label="Close">×</button>
            <div class="popup__media">
                <img data-popup="image" alt="Project preview" />
            </div>
            <div class="popup__content">
                <span class="popup__tag" data-popup="category"></span>
                <h3 data-popup="title"></h3>
                <p data-popup="short"></p>
                <p class="popup__long" data-popup="long"></p>
                <div class="popup__tech" data-popup="tech"></div>
                <div class="popup__nav">
                    <button data-popup="prev">← Prev</button>
                    <button data-popup="next">Next →</button>
                </div>
            </div>
        </div>
    `;
    return wrapper;
};

const attachSwipeHandlers = (popup) => {
    const surface = popup.querySelector(".popup__window");
    if (!surface || surface.dataset.swipeReady) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    surface.addEventListener(
        "touchstart",
        (event) => {
            if (event.touches.length !== 1) return;
            tracking = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        },
        { passive: true }
    );

    surface.addEventListener(
        "touchmove",
        (event) => {
            if (!tracking) return;
            const dx = event.touches[0].clientX - startX;
            const dy = event.touches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                event.preventDefault();
            }
        },
        { passive: false }
    );

    surface.addEventListener(
        "touchend",
        (event) => {
            if (!tracking) return;
            tracking = false;
            const dx = event.changedTouches[0].clientX - startX;
            const dy = event.changedTouches[0].clientY - startY;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
                navigatePopup(dx < 0 ? 1 : -1);
            }
        },
        { passive: true }
    );

    surface.dataset.swipeReady = "true";
};

const ensurePopup = () => {
    let popup = document.querySelector(".popup");
    if (!popup) {
        popup = popupTemplate();
        document.body.appendChild(popup);
        popup.querySelector(".popup__overlay").addEventListener("click", closePopup);
        popup.querySelector(".popup__close").addEventListener("click", closePopup);
        popup.querySelector('[data-popup="prev"]').addEventListener("click", () => navigatePopup(-1));
        popup.querySelector('[data-popup="next"]').addEventListener("click", () => navigatePopup(1));
        attachSwipeHandlers(popup);
    } else {
        attachSwipeHandlers(popup);
    }
    return popup;
};

const updatePopup = () => {
    const popup = ensurePopup();
    const project = popupState.projects[popupState.index];
    if (!project) return;

    popup.querySelector('[data-popup="image"]').src = project.image;
    popup.querySelector('[data-popup="image"]').alt = project.title;
    popup.querySelector('[data-popup="category"]').textContent = project.category;
    popup.querySelector('[data-popup="title"]').textContent = project.title;
    popup.querySelector('[data-popup="short"]').textContent = project.shortDescription;
    popup.querySelector('[data-popup="long"]').textContent = project.longDescription;

    const techRoot = popup.querySelector('[data-popup="tech"]');
    techRoot.innerHTML = "";
    project.technologies.forEach((tech) => {
        const pill = document.createElement("span");
        pill.textContent = tech;
        techRoot.appendChild(pill);
    });
};

const openPopup = (project) => {
    popupState.projects = window.DariConnecter?.galleryProjects || popupState.projects;
    const index = popupState.projects.findIndex((p) => p.id === project.id);
    popupState.index = Math.max(0, index);
    popupState.isOpen = true;
    const popup = ensurePopup();
    popup.classList.add("is-open");
    document.body.style.overflow = "hidden";
    updatePopup();
};

const closePopup = () => {
    popupState.isOpen = false;
    const popup = document.querySelector(".popup");
    if (popup) popup.classList.remove("is-open");
    document.body.style.overflow = "";
};

const navigatePopup = (direction) => {
    const total = popupState.projects.length;
    popupState.index = (popupState.index + direction + total) % total;
    updatePopup();
};

window.addEventListener("gallery:open", (event) => {
    openPopup(event.detail.project);
});

window.addEventListener("keydown", (event) => {
    if (!popupState.isOpen) return;
    if (event.key === "Escape") closePopup();
    if (event.key === "ArrowRight") navigatePopup(1);
    if (event.key === "ArrowLeft") navigatePopup(-1);
});
