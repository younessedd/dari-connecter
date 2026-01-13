(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/trust.json");

    api.whenSectionReady("trust", () => {
        const section = api.selectSection("trust");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const grid = section.querySelector('[data-list="reasons"]');
        api.hydrateList(grid, data.reasons, ({ title, description, icon }) => {
            const card = document.createElement("article");
            card.className = "trust-card";

            const iconWrap = document.createElement("span");
            iconWrap.className = "trust-card__icon";
            iconWrap.textContent = icon;

            const body = document.createElement("div");
            body.className = "trust-card__body";
            const heading = document.createElement("h3");
            heading.textContent = title;
            const text = document.createElement("p");
            text.textContent = description;

            body.append(heading, text);
            card.append(iconWrap, body);
            return card;
        });
    });
})();
