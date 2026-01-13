(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/features.json");

    api.whenSectionReady("features", () => {
        const section = api.selectSection("features");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const grid = section.querySelector('[data-list="items"]');
        api.hydrateList(grid, data.items, ({ label, tag, description, icon }) => {
            const card = document.createElement("article");
            card.className = "feature-card";

            const iconWrap = document.createElement("span");
            iconWrap.className = "feature-card__icon";
            iconWrap.textContent = icon;

            const heading = document.createElement("h3");
            heading.textContent = label;

            const tagEl = document.createElement("span");
            tagEl.className = "feature-card__tag";
            tagEl.textContent = tag;

            const descriptionEl = document.createElement("p");
            descriptionEl.textContent = description;

            card.append(iconWrap, heading, tagEl, descriptionEl);
            return card;
        });
    });
})();
