const sections = [
    { id: "hero", path: "sections/hero.html" },
    { id: "problem-solution", path: "sections/problem-solution.html" },
    { id: "about", path: "sections/about.html" },
    { id: "how-it-works", path: "sections/how-it-works.html" },
    { id: "features", path: "sections/features.html" },
    { id: "services", path: "sections/services.html" },
    { id: "gallery", path: "sections/gallery.html" },
    { id: "trust", path: "sections/trust.html" },
    { id: "contact", path: "sections/contact.html" },
    { id: "footer", path: "sections/footer.html" }
];

const readySections = new Set();
const sectionListeners = {};

const DariConnecter = window.DariConnecter || {};

DariConnecter.fetchJSON = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return response.json();
};

DariConnecter.hydrateList = (root, items, renderer) => {
    if (!root || !Array.isArray(items)) return;
    root.innerHTML = "";
    items.forEach((item) => {
        const fragment = renderer(item);
        if (fragment) root.appendChild(fragment);
    });
};

DariConnecter.whenSectionReady = (id, callback) => {
    if (readySections.has(id)) {
        callback();
        return;
    }
    if (!sectionListeners[id]) {
        sectionListeners[id] = [];
    }
    sectionListeners[id].push(callback);
};

DariConnecter.markSectionReady = (id) => {
    readySections.add(id);
    (sectionListeners[id] || []).forEach((callback) => callback());
    sectionListeners[id] = [];
};

DariConnecter.selectSection = (id) =>
    document.querySelector(`[data-section="${id}"]`);

DariConnecter.setText = (root, selector, text) => {
    if (!root) return;
    const node = root.querySelector(selector);
    if (node && typeof text !== "undefined") {
        node.textContent = text;
    }
};

DariConnecter.createBadge = (label) => {
    const span = document.createElement("span");
    span.className = "hero-badge";
    span.textContent = label;
    return span;
};

window.DariConnecter = DariConnecter;

const loadSection = async ({ id, path }) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Unable to load section ${id}`);
    }
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const section = template.content.firstElementChild;
    document.getElementById("app").appendChild(section);
    DariConnecter.markSectionReady(id);
};

const initPage = async () => {
    for (const section of sections) {
        await loadSection(section);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initPage();

    const nav = document.querySelector(".top-bar__nav");
    const burger = document.querySelector(".top-bar__burger");
    if (nav && burger) {
        const toggleMenu = () => {
            const isOpen = burger.getAttribute("aria-expanded") === "true";
            burger.setAttribute("aria-expanded", (!isOpen).toString());
            burger.classList.toggle("is-open", !isOpen);
            nav.classList.toggle("is-open", !isOpen);
        };

        burger.addEventListener("click", toggleMenu);
        nav.querySelectorAll("a").forEach((link) =>
            link.addEventListener("click", () => {
                burger.setAttribute("aria-expanded", "false");
                burger.classList.remove("is-open");
                nav.classList.remove("is-open");
            })
        );
    }
});
