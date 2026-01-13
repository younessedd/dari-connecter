const scrollNodes = new Set();

const setupParallax = () => {
    document.querySelectorAll("[data-scroll-speed]").forEach((node) => {
        const speed = parseFloat(node.dataset.scrollSpeed || "0.2");
        scrollNodes.add({ node, speed });
    });
};

let ticking = false;
const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        scrollNodes.forEach(({ node, speed }) => {
            node.style.transform = `translateY(${scrollY * speed * 0.3}px)`;
        });
        ticking = false;
    });
};

document.addEventListener("DOMContentLoaded", () => {
    setupParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
});
