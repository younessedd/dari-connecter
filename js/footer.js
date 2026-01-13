(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/footer.json");

    api.whenSectionReady("footer", () => {
        const section = api.selectSection("footer");
        if (!section) return;

        const linksRoot = section.querySelector('[data-list="links"]');
        api.hydrateList(linksRoot, data.links, ({ label, href }) => {
            const anchor = document.createElement("a");
            anchor.href = href;
            anchor.textContent = label;
            return anchor;
        });

        const socialRoot = section.querySelector('[data-list="social"]');
        api.hydrateList(socialRoot, data.social, ({ label, href }) => {
            const anchor = document.createElement("a");
            anchor.href = href;
            anchor.textContent = label;
            anchor.target = "_blank";
            anchor.rel = "noopener";
            return anchor;
        });

        api.setText(section, '[data-bind="year"]', data.year);
    });
})();
