// Initializes the 3D cube Swiper inside the hero's visual column once the hero section is ready.
const initializeHeroCube = () => {
    const cubeRoot = document.querySelector("#hero [data-hero-cube]");
    if (!cubeRoot || cubeRoot.dataset.initialized === "true") return;

    const sliderEl = cubeRoot.querySelector(".hero-cube__slider");
    const paginationEl = cubeRoot.querySelector(".hero-cube__pagination");
    const nextEl = cubeRoot.querySelector(".hero-cube__arrow--next");
    const prevEl = cubeRoot.querySelector(".hero-cube__arrow--prev");

    if (!sliderEl || typeof Swiper === "undefined") return;

    cubeRoot.dataset.initialized = "true";

    // Create the cube-effect Swiper with autoplay and navigation controls.
    new Swiper(sliderEl, {
        effect: "cube",
        grabCursor: true,
        loop: true,
        speed: 1200,
        cubeEffect: {
            shadow: false,
            slideShadows: true,
        },
        autoplay: {
            delay: 3200,
            disableOnInteraction: false,
        },
        pagination: {
            el: paginationEl,
            clickable: true,
        },
        navigation: {
            nextEl,
            prevEl,
        },
    });
};

const bootHeroCube = () => {
    const api = window.DariConnecter;
    if (api?.whenSectionReady) {
        api.whenSectionReady("hero", initializeHeroCube);
    } else if (document.readyState !== "loading") {
        initializeHeroCube();
    } else {
        document.addEventListener("DOMContentLoaded", initializeHeroCube);
    }
};

bootHeroCube();
