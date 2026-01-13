(async () => {
    const api = window.DariConnecter;
    const data = await api.fetchJSON("data/problem-solution.json");

    api.whenSectionReady("problem-solution", () => {
        const section = api.selectSection("problem-solution");
        if (!section) return;

        api.setText(section, '[data-bind="eyebrow"]', data.eyebrow);
        api.setText(section, '[data-bind="title"]', data.title);
        api.setText(section, '[data-bind="subtitle"]', data.subtitle);
        api.setText(section, '[data-bind="problemTitle"]', data.problemTitle);
        api.setText(section, '[data-bind="solutionTitle"]', data.solutionTitle);
        api.setText(section, '[data-bind="cta"]', data.cta);

        const problemsRoot = section.querySelector('[data-list="problems"]');
        api.hydrateList(problemsRoot, data.problems, (text) => {
            const li = document.createElement("li");
            li.textContent = text;
            return li;
        });

        const solutionRoot = section.querySelector('[data-list="solutions"]');
        api.hydrateList(solutionRoot, data.solutions, (text) => {
            const li = document.createElement("li");
            li.textContent = text;
            return li;
        });
    });
})();
