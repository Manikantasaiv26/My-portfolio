(function () {
  "use strict";

  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderBar = document.getElementById("loaderBar");
  const yearEl = document.getElementById("year");

  const hero = document.querySelector(".hero");
  const title = document.getElementById("heroTitle");
  const subtitle = document.getElementById("heroSub");
  const side = document.getElementById("heroSide");
  const imageA = document.getElementById("heroImageA");
  const imageB = document.getElementById("heroImageB");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  function hideLoader() {
    if (loader) loader.classList.add("hidden");
    document.body.classList.add("is-ready");
  }

  // Failsafe: never leave phones stuck on the loading screen
  window.setTimeout(hideLoader, 2500);

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const scenes = [
    {
      title: "CREATIVE\nDEVOPS",
      sub: "Automating reliable cloud systems for modern teams.",
      side: "AWS / AZURE / KUBERNETES"
    },
    {
      title: "FULL STACK\nINFRA",
      sub: "Terraform, CI/CD, Docker, and production-grade orchestration.",
      side: "PIPELINES / IaC / MONITORING"
    },
    {
      title: "SCALABLE\nSYSTEMS",
      sub: "24×7 incident response, RCA, and continuous reliability improvements.",
      side: "SRE / INCIDENT / HIGH AVAILABILITY"
    }
  ];

  function runLoader() {
    let progress = 0;
    const step = reducedMotion || isMobile() ? 10 : 2;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + step);
      if (loaderPercent) loaderPercent.textContent = progress + "%";
      if (loaderBar) loaderBar.style.width = progress + "%";
      if (progress === 100) {
        clearInterval(timer);
        setTimeout(hideLoader, reducedMotion ? 0 : 220);
      }
    }, reducedMotion || isMobile() ? 12 : 18);
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function applyScene(index) {
    if (!title || !subtitle || !side) return;
    const scene = scenes[index];
    title.innerHTML = scene.title.replace("\n", "<br>");
    subtitle.textContent = scene.sub;
    side.textContent = scene.side;
  }

  function updateHero() {
    if (!hero || !imageA || !imageB) return;

    if (isMobile() || reducedMotion) {
      applyScene(0);
      imageA.style.opacity = "1";
      imageB.style.opacity = "0";
      imageA.style.transform = "";
      imageB.style.transform = "";
      title.style.transform = "";
      subtitle.style.transform = "";
      side.style.transform = "";
      return;
    }

    const rect = hero.getBoundingClientRect();
    const full = hero.offsetHeight - window.innerHeight;
    if (full <= 0) return;

    const p = clamp(-rect.top / full, 0, 1);
    const sceneIndex = clamp(Math.floor(p * scenes.length), 0, scenes.length - 1);
    applyScene(sceneIndex);

    const mix = clamp((p - 0.28) / 0.42, 0, 1);
    imageA.style.opacity = String(1 - mix);
    imageB.style.opacity = String(mix);
    imageA.style.transform = `scale(${1 + p * 0.05}) translateY(${p * -12}px)`;
    imageB.style.transform = `scale(${1.02 - mix * 0.02}) translateY(${(1 - mix) * -8}px)`;

    const lift = p * 36;
    title.style.transform = `translateY(${-lift}px)`;
    subtitle.style.transform = `translateY(${-lift * 0.45}px)`;
    side.style.transform = `translateY(${-lift * 0.65}px)`;
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");

    // Always show content eventually (important for iOS/Android)
    window.setTimeout(() => {
      items.forEach((el) => el.classList.add("visible"));
    }, 1800);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  // Mobile nav: open Hire Me / sections smoothly
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  runLoader();
  applyScene(0);
  updateHero();
  initReveal();

  window.addEventListener("scroll", updateHero, { passive: true });
  window.addEventListener("resize", updateHero);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(updateHero, 150);
  });
  window.addEventListener("load", hideLoader);
})();
