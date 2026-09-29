/* ==========================================================================
   CONFIGURATION & CUSTOMIZATION
   ========================================================================== */
const CONFIG = {
  // 1. Person's Name
  name: "Dr. Chizubem Benson",

  // 2. Target Birthday Date (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
  birthdayDate: "2026-10-01T00:00:00",

  // 3. Typewriter Personal Message (Combined Master Message)
  typedMessage: `To a remarkable mentor, guide, and incredible uncle—Happy Birthday, Dr. Chizubem Benson! 🌟

Thank you for your endless wisdom, support, and the great example you set for us every single day. Your dedication, warmth, and laughter make every moment with family special, and having an uncle as wise, supportive, and dependable as you is a true blessing.

May God bless your new age with divine grace, distinguished success, robust health, total peace, and extraordinary achievements. Cheers to long life, prosperity, and a wonderful celebration! 🥂✨`,

  // 4. Floating ambient emojis
  floatingEmojis: ['🎈', '✨', '💖', '🎉', '🌸', '⭐']
};

/* ==========================================================================
   DOM ELEMENTS & INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Apply Name to HTML Placeholders
  document.querySelectorAll('.highlight-name').forEach(el => el.textContent = CONFIG.name);

  // Initialize Canvas Animations
  initParticles();
  initFloatingElements();

  // Loader Simulation
  let progress = 0;
  const loaderBar = document.getElementById('loader-bar');
  const loadingInterval = setInterval(() => {
    progress += 15;
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        const main = document.getElementById('main-content');
        if (loader) loader.style.opacity = '0';
        setTimeout(() => {
          if (loader) loader.classList.add('hidden');
          if (main) main.classList.remove('hidden');
        }, 800);
      }, 300);
    }
  }, 150);

  // Event Listeners Setup
  setupWelcomeFlow();
  setupGiftBox();
  setupGalleryLightbox();
  setupCakeInteraction();
  setupMusicPlayer();
  setupCountdown();
  setupReplay();
  setupScrollTypewriter(); // Triggers typewriter when scrolled into view
});

/* ==========================================================================
   1. WELCOME & FLOW CONTROL
   ========================================================================== */
let musicUnlocked = false;

function unlockMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio || musicUnlocked) return;

  audio.muted = false;
  audio.loop = true;
  audio.volume = 0.8;

  const playPromise = audio.play();

  if (playPromise && typeof playPromise.then === 'function') {
    playPromise
      .then(() => {
        musicUnlocked = true;
        syncMusicUi();
      })
      .catch(() => {
        // Browser still blocked; wait for direct user interaction
      });
  } else {
    musicUnlocked = true;
    syncMusicUi();
  }
}

function syncMusicUi() {
  const audio = document.getElementById('bg-music');
  const playBtn = document.getElementById('play-pause-btn');
  const disc = document.getElementById('disc-icon');

  if (!audio || !playBtn || !disc) return;

  const isPlaying = !audio.paused && !audio.muted;
  playBtn.textContent = isPlaying ? '⏸️' : '▶️';
  disc.classList.toggle('spinning', isPlaying);
}

function setupWelcomeFlow() {
  const startBtn = document.getElementById('start-btn');
  const wrapper = document.getElementById('experience-wrapper');

  startBtn.addEventListener('click', () => {
    unlockMusic();
    triggerConfetti(3000);
    wrapper.classList.add('show-flow');
    
    // Smooth scroll to Gift section
    setTimeout(() => {
      document.getElementById('gift-section').scrollIntoView({ behavior: 'smooth' });
    }, 400);
  });

  // Global listeners for any tap/click to unlock music
  document.addEventListener('pointerdown', unlockMusic, { passive: true });
  document.addEventListener('touchstart', unlockMusic, { passive: true });
  document.addEventListener('click', unlockMusic, { passive: true });
}

/* ==========================================================================
   2. GIFT BOX SURPRISE
   ========================================================================== */
function setupGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const giftMessage = document.getElementById('gift-message');

  giftBox.addEventListener('click', () => {
    unlockMusic();

    if (!giftBox.classList.contains('open')) {
      giftBox.classList.add('open');
      triggerConfetti(2000);
      setTimeout(() => {
        giftMessage.classList.remove('hidden-card');
        giftMessage.classList.add('show-card');
      }, 400);
    }
  });
}

/* ==========================================================================
   3. PHOTO GALLERY LIGHTBOX
   ========================================================================== */
function setupGalleryLightbox() {
  const polaroids = document.querySelectorAll('.polaroid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption');
      const imgEl = card.querySelector('img');
      
      lightboxImg.src = src || imgEl.src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

/* ==========================================================================
   4. SCROLL-TRIGGERED TYPEWRITER EFFECT
   ========================================================================== */
let typewriterStarted = false;

function setupScrollTypewriter() {
  const messageSection = document.getElementById('message-section');
  if (!messageSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterStarted) {
        typewriterStarted = true;
        startTypewriter();
        observer.unobserve(entry.target); // Stop observing once started
      }
    });
  }, {
    threshold: 0.3 // Starts when 30% of the section is visible on screen
  });

  observer.observe(messageSection);
}

function startTypewriter() {
  const target = document.getElementById('typewriter-text');
  const text = CONFIG.typedMessage;
  let index = 0;

  target.textContent = ''; // Clear existing text before typing

  function typeNextChar() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(typeNextChar, 35 + Math.random() * 25);
    }
  }

  typeNextChar();
}

/* ==========================================================================
   5. BIRTHDAY CAKE & CANDLES
   ========================================================================== */
function setupCakeInteraction() {
  const cake = document.getElementById('cake');
  const flames = document.querySelectorAll('.flame');
  const wishStatus = document.getElementById('wish-status');
  let blownOut = false;

  cake.addEventListener('click', () => {
    if (!blownOut) {
      blownOut = true;
      flames.forEach(flame => flame.classList.add('out'));
      triggerConfetti(2500);
      wishStatus.classList.remove('hidden-text');
    }
  });
}

/* ==========================================================================
   6. MUSIC PLAYER CONTROLS
   ========================================================================== */
function setupMusicPlayer() {
  const audio = document.getElementById('bg-music');
  const playBtn = document.getElementById('play-pause-btn');
  const seekBar = document.getElementById('seek-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currTimeEl = document.getElementById('curr-time');
  const durTimeEl = document.getElementById('dur-time');
  const disc = document.getElementById('disc-icon');

  if (!audio || !playBtn) return;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  const toggleMusic = () => {
    if (!audio) return;

    if (audio.paused) {
      unlockMusic();
      if (!audio.paused) {
        syncMusicUi();
      }
    } else {
      audio.pause();
      syncMusicUi();
    }
  };

  playBtn.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMusic();
  });

  audio.addEventListener('play', () => {
    syncMusicUi();
  });

  audio.addEventListener('pause', () => {
    syncMusicUi();
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      currTimeEl.textContent = formatTime(audio.currentTime);
      durTimeEl.textContent = formatTime(audio.duration);
    }
  });

  seekBar.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (seekBar.value / 100) * audio.duration;
    }
  });

  volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
  });

  audio.volume = 0.8;
  syncMusicUi();
}

/* ==========================================================================
   7. COUNTDOWN TIMER
   ========================================================================== */
function setupCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const alertEl = document.getElementById('birthday-alert');

  function updateTimer() {
    const target = new Date(CONFIG.birthdayDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      if (alertEl) alertEl.classList.remove('hidden');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = days < 10 ? '0' + days : days;
    cdHours.textContent = hours < 10 ? '0' + hours : hours;
    cdMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
    cdSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   8. REPLAY SURPRISE
   ========================================================================== */
function setupReplay() {
  const replayBtn = document.getElementById('replay-btn');
  replayBtn.addEventListener('click', () => {
    unlockMusic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerConfetti(3000);
  });
}

/* ==========================================================================
   9. CANVASES & AMBIENT EFFECTS
   ========================================================================== */

// Floating Background Emojis
function initFloatingElements() {
  const container = document.getElementById('floating-bg');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'floating-element';
    el.textContent = CONFIG.floatingEmojis[Math.floor(Math.random() * CONFIG.floatingEmojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 12}s`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(el);
  }
}

// Background Glowing Particles Canvas
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      speedY: Math.random() * 0.5 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y -= p.speedY;
      if (p.y < 0) p.y = height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 182, 193, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
}

// Custom Pure Canvas Confetti System
function triggerConfetti(durationMs = 2500) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const colors = ['#ff416c', '#ff4b2b', '#a855f7', '#ffd700', '#ffffff', '#00f2fe'];
  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.25,
      opacity: 1
    });
  }

  const startTime = Date.now();

  function animateConfetti() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;

      if (elapsed > durationMs - 500) {
        p.opacity = Math.max(0, p.opacity - 0.02);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  animateConfetti();
}
