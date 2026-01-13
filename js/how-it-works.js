(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/how-it-works.json");

    api.whenSectionReady("how-it-works", () => {
        const section = api.selectSection("how-it-works");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);
        api.setText(section, '[data-bind="cta"]', data.cta);

        const timeline = section.querySelector('[data-list="steps"]');
        api.hydrateList(timeline, data.steps, ({ label, description }) => {
            const card = document.createElement("article");
            card.className = "hiw-step";

            const title = document.createElement("h3");
            title.textContent = label;
            const text = document.createElement("p");
            text.textContent = description;

            card.append(title, text);
            return card;
        });
    });
})();
