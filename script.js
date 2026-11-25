/* =========================================================
   SCRIPT UTAMA — GATHERING NIGHT DPKB BOJONEGORO
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initMusicAndGate();
  initRundownFilter();
  initScrollReveal();
  initShareInvitation();
});

/* ---------------------------------------------------------
   1. BINTANG-BINTANG TERANG & BERKEDIP TERUS-MENERUS
   --------------------------------------------------------- */
function initStarfield() {
  const canvas = document.getElementById('starfieldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let stars = [];

  const STAR_COUNT = 115;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStar() {
    const isHeroStar = Math.random() < 0.28;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: isHeroStar ? 1.8 + Math.random() * 2.4 : 0.9 + Math.random() * 1.5,
      twinkleSpeed: 0.025 + Math.random() * 0.055,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.35,
      driftY: (Math.random() - 0.5) * 0.35,
      hasSparkle: isHeroStar,
      hue: Math.random() < 0.72 ? '255, 236, 172' : '255, 252, 240'
    };
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => createStar());
  }

  function drawFourPointSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0.25, Math.min(1, alpha));
    ctx.fillStyle = `rgba(255, 245, 196, ${alpha})`;
    ctx.shadowColor = 'rgba(245, 220, 130, 0.95)';
    ctx.shadowBlur = 12;

    const arm = size * 2.6;
    const waist = size * 0.52;

    ctx.beginPath();
    ctx.moveTo(0, -arm);
    ctx.quadraticCurveTo(waist, -waist, arm, 0);
    ctx.quadraticCurveTo(waist, waist, 0, arm);
    ctx.quadraticCurveTo(-waist, waist, -arm, 0);
    ctx.quadraticCurveTo(-waist, -waist, 0, -arm);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.phase += star.twinkleSpeed;
      star.x += star.driftX;
      star.y += star.driftY;

      if (star.x < -20) star.x = width + 20;
      if (star.x > width + 20) star.x = -20;
      if (star.y < -20) star.y = height + 20;
      if (star.y > height + 20) star.y = -20;

      const wave = (Math.sin(star.phase) + 1) * 0.5;
      const alpha = 0.32 + wave * 0.68;
      const currentRadius = star.radius * (0.78 + wave * 0.52);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${star.hue})`;
      ctx.shadowColor = 'rgba(245, 220, 130, 0.9)';
      ctx.shadowBlur = 10 + wave * 10;
      ctx.fill();
      ctx.restore();

      if (star.hasSparkle && wave > 0.35) {
        drawFourPointSparkle(star.x, star.y, currentRadius * 1.15, alpha);
      }
    }

    requestAnimationFrame(renderStars);
  }

  resizeCanvas();
  buildStars();
  renderStars();

  window.addEventListener('resize', () => {
    resizeCanvas();
    buildStars();
  });
}

/* ---------------------------------------------------------
   2. BUKA UNDANGAN & MUSIK LATAR BELAKANG
   --------------------------------------------------------- */
function initMusicAndGate() {
  const gate = document.getElementById('invitationGate');
  const openBtn = document.getElementById('openInvitationBtn');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const musicLabel = document.getElementById('musicLabel');
  const bgMusic = document.getElementById('bgMusic');

  function updateMusicUI(isPlaying) {
    if (!musicToggle || !musicIcon || !musicLabel) return;
    if (isPlaying) {
      musicToggle.classList.remove('is-muted');
      musicIcon.textContent = '♪';
      musicLabel.textContent = 'Musik Aktif';
    } else {
      musicToggle.classList.add('is-muted');
      musicIcon.textContent = '🔇';
      musicLabel.textContent = 'Musik Mati';
    }
  }

  async function startMusic() {
    if (!bgMusic) return;
    try {
      bgMusic.volume = 0.65;
      await bgMusic.play();
      updateMusicUI(true);
    } catch (err) {
      updateMusicUI(false);
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', async () => {
      await startMusic();
      if (gate) gate.classList.add('is-opened');
      if (musicToggle) musicToggle.classList.remove('is-hidden');
    });
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', async () => {
      if (bgMusic.paused) {
        await startMusic();
      } else {
        bgMusic.pause();
        updateMusicUI(false);
      }
    });
  }
}

/* ---------------------------------------------------------
   3. FILTER RUNDOWN ACARA
   --------------------------------------------------------- */
function initRundownFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!filterButtons.length || !timelineItems.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedGroup = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      timelineItems.forEach((item) => {
        const itemGroup = item.getAttribute('data-group');
        const shouldShow = selectedGroup === 'all' || itemGroup === selectedGroup;
        item.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });
}

/* ---------------------------------------------------------
   4. ANIMASI MUNCUL SAAT SCROLL
   --------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   5. SALIN & BAGIKAN LINK UNDANGAN VIA WHATSAPP
   --------------------------------------------------------- */
function initShareInvitation() {
  const linkInput = document.getElementById('invitationLinkInput');
  const copyBtn = document.getElementById('copyLinkBtn');
  const waShareBtn = document.getElementById('shareWhatsAppLinkBtn');
  const feedbackEl = document.getElementById('copyFeedback');

  const currentUrl = window.location.href;
  if (linkInput) {
    linkInput.value = currentUrl;
  }

  const shareText = [
    'Undangan Malam Keakraban — Gathering Night Duta Pemuda Kebudayaan Bojonegoro',
    'Sabtu, 28 November 2026 | Registrasi 18.30–18.40 WIB | IKIP Bojonegoro',
    `Buka undangan di sini: ${currentUrl}`
  ].join('\n');

  if (waShareBtn) {
    waShareBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        if (feedbackEl) feedbackEl.textContent = 'Link undangan berhasil disalin!';
      } catch (err) {
        if (linkInput) {
          linkInput.select();
          document.execCommand('copy');
        }
        if (feedbackEl) feedbackEl.textContent = 'Link undangan berhasil disalin!';
      }
    });
  }
}