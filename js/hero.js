// Hero floating/parallax effects
(function () {
  const floatingIcons = document.querySelectorAll(".floating-icon");
  const hero = document.querySelector(".hero");
  let tick = 0;

  function animate() {
    tick += 0.01;
    floatingIcons.forEach((icon, i) => {
      const speed = parseFloat(icon.dataset.speed || "1");
      const x = Math.sin(tick * speed + i) * 6;
      const y = Math.cos(tick * speed + i * 0.6) * 6;
      icon.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animate);
  }
  if (floatingIcons.length) animate();

  // Parallax on move
  hero?.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    const rings = hero.querySelectorAll(".orbital__ring");
    rings.forEach((ring, idx) => {
      const intensity = (idx + 1) * 0.02;
      ring.style.setProperty("--tx", `${cx * intensity}px`);
      ring.style.setProperty("--ty", `${cy * intensity}px`);
    });
  });
})();
