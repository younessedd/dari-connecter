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
            if (data.primaryCta.target) {
                primaryBtn.target = data.primaryCta.target;
            }
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

        initHeroSlider(section);
    });

    function initHeroSlider(section) {
        const slider = section.querySelector("[data-slider]");
        if (!slider) return;

        const track = slider.querySelector("[data-slider-track]");
        const baseSlides = Array.from(slider.querySelectorAll(".hero-slide"));
        const dotsRoot = slider.querySelector("[data-slider-dots]");
        const prevBtn = slider.querySelector("[data-slider-prev]");
        const nextBtn = slider.querySelector("[data-slider-next]");
        const viewport = slider.querySelector("[data-slider-viewport]");
        if (!track || !baseSlides.length) return;

        const totalSlides = baseSlides.length;
        const wrapClone = (slide) => {
            const clone = slide.cloneNode(true);
            clone.dataset.clone = "true";
            clone.classList.remove("is-active");
            return clone;
        };

        const firstClone = wrapClone(baseSlides[0]);
        const lastClone = wrapClone(baseSlides[baseSlides.length - 1]);
        track.appendChild(firstClone);
        track.insertBefore(lastClone, baseSlides[0]);

        const slides = Array.from(track.querySelectorAll(".hero-slide"));
        const realSlides = slides.filter((slide) => !slide.dataset.clone);

        let position = 1; // first real slide
        let activeIndex = 0;
        let isTransitioning = false;
        let autoplayId;
        const AUTOPLAY_MS = 4500;

        const setTransform = (animate = true) => {
            if (animate) {
                isTransitioning = true;
                track.style.transition = "";
            } else {
                isTransitioning = false;
                track.style.transition = "none";
            }
            track.style.transform = `translateX(-${position * 100}%)`;
        };

        const dots = realSlides.map((_, idx) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "hero-gallery__dot";
            dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
            dot.addEventListener("click", () => {
                goTo(idx);
                restartAutoplay();
            });
            dotsRoot?.appendChild(dot);
            return dot;
        });

        const syncIndicators = () => {
            realSlides.forEach((slide, idx) => {
                slide.classList.toggle("is-active", idx === activeIndex);
            });
            dots.forEach((dot, idx) => {
                dot.classList.toggle("is-active", idx === activeIndex);
            });
        };

        const goTo = (nextIndex) => {
            if (isTransitioning) return;
            activeIndex = (nextIndex + totalSlides) % totalSlides;
            position = activeIndex + 1;
            setTransform();
            syncIndicators();
        };

        const next = () => {
            if (isTransitioning) return;
            position += 1;
            if (position === slides.length - 1) {
                activeIndex = 0;
            } else {
                activeIndex = (activeIndex + 1) % totalSlides;
            }
            setTransform();
            syncIndicators();
        };

        const prev = () => {
            if (isTransitioning) return;
            position -= 1;
            if (position === 0) {
                activeIndex = totalSlides - 1;
            } else {
                activeIndex = (activeIndex - 1 + totalSlides) % totalSlides;
            }
            setTransform();
            syncIndicators();
        };

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const startAutoplay = () => {
            stopAutoplay();
            if (!prefersReducedMotion) {
                autoplayId = window.setInterval(next, AUTOPLAY_MS);
            }
        };

        const stopAutoplay = () => {
            if (autoplayId) {
                clearInterval(autoplayId);
                autoplayId = undefined;
            }
        };

        const restartAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        prevBtn?.addEventListener("click", () => {
            prev();
            restartAutoplay();
        });
        nextBtn?.addEventListener("click", () => {
            next();
            restartAutoplay();
        });

        // Touch/drag support
        let startX = 0;
        let deltaX = 0;
        let isDragging = false;

        const onPointerDown = (event) => {
            if (isTransitioning) return;
            isDragging = true;
            startX = "touches" in event ? event.touches[0].clientX : event.clientX;
            deltaX = 0;
            stopAutoplay();
        };

        const onPointerMove = (event) => {
            if (!isDragging || !viewport) return;
            const currentX = "touches" in event ? event.touches[0].clientX : event.clientX;
            deltaX = currentX - startX;
            track.style.transition = "none";
            const percentOffset = (deltaX / viewport.clientWidth) * 100;
            track.style.transform = `translateX(${percentOffset - position * 100}%)`;
        };

        const onPointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = "";
            if (Math.abs(deltaX) > 50) {
                deltaX < 0 ? next() : prev();
            } else {
                setTransform();
            }
            startAutoplay();
        };

        viewport?.addEventListener("touchstart", onPointerDown, { passive: true });
        viewport?.addEventListener("touchmove", onPointerMove, { passive: true });
        viewport?.addEventListener("touchend", onPointerUp);
        viewport?.addEventListener("mousedown", (event) => {
            event.preventDefault();
            onPointerDown(event);
        });
        viewport?.addEventListener("mousemove", (event) => {
            if (!isDragging) return;
            event.preventDefault();
            onPointerMove(event);
        });
        viewport?.addEventListener("mouseup", onPointerUp);
        viewport?.addEventListener("mouseleave", () => {
            if (isDragging) onPointerUp();
        });

        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", startAutoplay);

        track.addEventListener("transitionend", () => {
            isTransitioning = false;
            if (slides[position]?.dataset.clone === "true") {
                if (position === slides.length - 1) {
                    position = 1;
                } else if (position === 0) {
                    position = slides.length - 2;
                }
                setTransform(false);
            }
        });

        setTransform(false);
        syncIndicators();
        startAutoplay();
    }
})();
