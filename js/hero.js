(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/hero.json");

    api.whenSectionReady("hero", () => {
        const section = api.selectSection("hero");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);

        const primaryBtn = section.querySelector('[data-bind="primaryCta"]');
        if (primaryBtn) {
            primaryBtn.textContent = data.primaryCta.label;
            primaryBtn.href = data.primaryCta.href;
        }

        const secondaryRoot = section.querySelector('[data-list="secondaryCtas"]');
        api.hydrateList(secondaryRoot, data.secondaryCtas, ({ label, href }) => {
            const link = document.createElement("a");
            link.textContent = label;
            link.href = href;
            return link;
        });

        const metricsRoot = section.querySelector('[data-list="metrics"]');
        api.hydrateList(metricsRoot, data.metrics, ({ label, value }) => {
            const li = document.createElement("li");
            const strong = document.createElement("strong");
            strong.textContent = value;
            const span = document.createElement("span");
            span.textContent = label;
            li.append(strong, span);
            return li;
        });

        const deviceRoot = section.querySelector('[data-list="deviceStatus"]');
        api.hydrateList(deviceRoot, data.deviceStatus, ({ name, status, value }) => {
            const card = document.createElement("div");
            card.className = "device-card";
            card.dataset.state = status;

            const meta = document.createElement("div");
            meta.innerHTML = `<strong>${name}</strong><p class="device-card__status">${value}</p>`;
            const toggle = document.createElement("div");
            toggle.className = "device-card__toggle";

            card.append(meta, toggle);
            return card;
        });

        const badgeRoot = section.querySelector('[data-list="badges"]');
        api.hydrateList(badgeRoot, data.badges, api.createBadge);
    });
})();
