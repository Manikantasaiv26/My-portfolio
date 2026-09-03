(function () {
  'use strict';

  const container = document.getElementById('reelsContainer');
  const slides = document.querySelectorAll('.reel-slide');
  const progressContainer = document.getElementById('storyProgress');
  const slideCounter = document.getElementById('slideCounter');
  const navHint = document.getElementById('navHint');
  const followBtn = document.getElementById('followBtn');
  const likeBtn = document.querySelector('.action-btn.liked');
  const likeCount = document.getElementById('likeCount');

  const totalSlides = slides.length;
  let currentSlide = 0;
  let isScrolling = false;

  const captions = [
    'DevOps & SRE Engineer | AWS • Azure • Kubernetes | 4+ Years Experience ☁️',
    'Building scalable, production-grade cloud systems with passion 🔧',
    'AWS • Azure • Docker • Kubernetes • Terraform • CI/CD 🛠️',
    'Senior Associate Consultant @ Infosys | Azure Container Expert 🏢',
    'Musgrave Project | Bicep IaC & Azure DevOps Pipelines 📦',
    'Payapt @ Primesoft | AWS EKS & Java Microservices ☁️',
    'Infinite Project | Docker & Azure VM Management 🐳',
    'Microsoft Certified: AZ-400 • AZ-104 • AZ-900 🏆',
    'B.Tech Civil Engineering | JNTUK University 🎓',
    'Let\'s connect! Open to DevOps & Cloud opportunities 🚀'
  ];

  function initProgressBars() {
    for (let i = 0; i < totalSlides; i++) {
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.innerHTML = '<div class="progress-fill"></div>';
      progressContainer.appendChild(bar);
    }
    updateProgressBars(0);
  }

  function updateProgressBars(index) {
    const bars = progressContainer.querySelectorAll('.progress-bar');
    bars.forEach((bar, i) => {
      bar.classList.remove('active', 'completed');
      const fill = bar.querySelector('.progress-fill');
      fill.style.width = '';
      fill.style.animation = '';

      if (i < index) {
        bar.classList.add('completed');
      } else if (i === index) {
        bar.classList.add('active');
      }
    });
  }

  function updateSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    updateProgressBars(index);
    slideCounter.textContent = `${index + 1} / ${totalSlides}`;

    const caption = document.querySelector('.reel-caption p');
    if (caption) {
      caption.innerHTML = `<strong>manikanta_devops</strong> ${captions[index]}`;
    }

    if (index > 0) {
      navHint.classList.add('hidden');
    } else {
      navHint.classList.remove('hidden');
    }
  }

  function getCurrentSlideIndex() {
    const scrollTop = container.scrollTop;
    const slideHeight = container.clientHeight;
    return Math.round(scrollTop / slideHeight);
  }

  let scrollTimeout;
  container.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
      const index = getCurrentSlideIndex();
      if (index !== currentSlide) {
        updateSlide(index);
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth'
    });
  }

  // Follow button
  followBtn.addEventListener('click', () => {
    followBtn.classList.toggle('following');
    followBtn.textContent = followBtn.classList.contains('following') ? 'Following' : 'Follow';
  });

  // Like button
  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('liked');
    likeBtn.classList.add('pop');
    setTimeout(() => likeBtn.classList.remove('pop'), 400);

    const count = parseFloat(likeCount.textContent);
    if (likeBtn.classList.contains('liked')) {
      likeCount.textContent = (count + 0.1).toFixed(1) + 'K';
    } else {
      likeCount.textContent = '4.2K';
    }
  });

  // Double tap to like (Instagram style)
  let lastTap = 0;
  container.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      showTapHeart(e.clientX, e.clientY);
      if (!likeBtn.classList.contains('liked')) {
        likeBtn.click();
      }
    }
    lastTap = now;
  });

  function showTapHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'tap-heart';
    heart.textContent = '❤️';

    const rect = container.getBoundingClientRect();
    heart.style.left = (x - rect.left - 40) + 'px';
    heart.style.top = (y - rect.top - 40) + 'px';

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  // Touch swipe support for mouse wheel on desktop
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  // Wheel scroll with snap
  container.addEventListener('wheel', (e) => {
    if (isScrolling) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY;
    if (Math.abs(delta) > 30) {
      isScrolling = true;
      if (delta > 0 && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (delta < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
      setTimeout(() => { isScrolling = false; }, 600);
      e.preventDefault();
    }
  }, { passive: false });

  // Share button
  document.querySelector('[aria-label="Share"]').addEventListener('click', async () => {
    const shareData = {
      title: 'Manikanta Sai - DevOps Engineer',
      text: 'Check out my interactive resume!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(window.location.href);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Link copied!');
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,0.9);
      color: #000;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      z-index: 999;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Auto-advance progress bar restart on slide change
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.slide, 10);
          updateSlide(index);
        }
      });
    },
    { root: container, threshold: 0.6 }
  );

  slides.forEach((slide) => observer.observe(slide));

  initProgressBars();
  updateSlide(0);
})();
