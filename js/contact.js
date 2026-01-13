(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/contact.json");

    api.whenSectionReady("contact", () => {
        const section = api.selectSection("contact");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const infoRoot = section.querySelector('[data-list="channels"]');
        api.hydrateList(infoRoot, data.channels, ({ label, value, href }) => {
            const card = document.createElement("article");
            card.className = "contact-card";
            const strong = document.createElement("strong");
            strong.textContent = label;
            const link = document.createElement("a");
            link.href = href;
            link.textContent = value;
            link.target = "_blank";
            link.rel = "noopener";
            card.append(strong, link);
            return card;
        });

    });
})();
