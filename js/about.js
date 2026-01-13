(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/about.json");

    api.whenSectionReady("about", () => {
        const section = api.selectSection("about");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const grid = section.querySelector('[data-list="panels"]');
        api.hydrateList(grid, data.panels, ({ title, description, icon }) => {
            const card = document.createElement("article");
            card.className = "about-panel";

            const iconSpan = document.createElement("span");
            iconSpan.className = "about-panel__icon";
            iconSpan.textContent = icon;

            const heading = document.createElement("h3");
            heading.className = "about-panel__title";
            heading.textContent = title;

            const text = document.createElement("p");
            text.className = "about-panel__description";
            text.textContent = description;

            card.append(iconSpan, heading, text);
            return card;
        });
    });
})();
