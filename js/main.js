(function () {
  "use strict";

  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderBar = document.getElementById("loaderBar");

  const hero = document.querySelector(".hero");
  const title = document.getElementById("heroTitle");
  const subtitle = document.getElementById("heroSub");
  const side = document.getElementById("heroSide");
  const imageA = document.getElementById("heroImageA");
  const imageB = document.getElementById("heroImageB");

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
      sub: "24x7 incident response, RCA, and continuous reliability improvements.",
      side: "SRE / INCIDENT / HIGH AVAILABILITY"
    }
  ];

  function runLoader() {
    let progress = 0;
    const timer = setInterval(() => {
      progress += 2;
      if (progress > 100) progress = 100;
      loaderPercent.textContent = progress + "%";
      loaderBar.style.width = progress + "%";
      if (progress === 100) {
        clearInterval(timer);
        setTimeout(() => loader.classList.add("hidden"), 260);
      }
    }, 20);
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function updateHero() {
    const rect = hero.getBoundingClientRect();
    const full = hero.offsetHeight - window.innerHeight;
    if (full <= 0) return;
    const consumed = clamp(-rect.top, 0, full);
    const p = consumed / full;

    const sceneIndex = clamp(Math.floor(p * scenes.length), 0, scenes.length - 1);
    const scene = scenes[sceneIndex];

    title.innerHTML = scene.title.replace("\n", "<br>");
    subtitle.textContent = scene.sub;
    side.textContent = scene.side;

    const crossFadeStart = 0.32;
    const crossFadeEnd = 0.7;
    let mix = (p - crossFadeStart) / (crossFadeEnd - crossFadeStart);
    mix = clamp(mix, 0, 1);

    imageA.style.opacity = String(1 - mix);
    imageB.style.opacity = String(mix);

    imageA.style.transform = `scale(${1 + p * 0.04}) translateY(${p * -10}px)`;
    imageB.style.transform = `scale(${1 + (1 - p) * 0.03}) translateY(${(1 - p) * -8}px)`;

    const textLift = p * 40;
    title.style.transform = `translateY(${-textLift}px)`;
    subtitle.style.transform = `translateY(${-textLift * 0.5}px)`;
    side.style.transform = `translateY(${-textLift * 0.7}px)`;
  }

  runLoader();
  updateHero();
  window.addEventListener("scroll", updateHero, { passive: true });
  window.addEventListener("resize", updateHero);
})();
