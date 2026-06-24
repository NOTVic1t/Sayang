/* ============================================================
   ENGINE.JS — Semua logic interaktif.
   Jangan edit data personal di sini, edit di config.js.
   ============================================================ */

(() => {
  "use strict";

  /* ---------------- HELPERS ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) { /* ignore */ }
  }

  /* ---------------- TINY SOUND ENGINE (Web Audio, no asset files) ---------------- */
  const SoundFX = (() => {
    let ctx;
    function getCtx() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      return ctx;
    }
    function tone(freq, duration, type = "sine", gainVal = 0.05, delay = 0) {
      const c = getCtx();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = gainVal;
      osc.connect(gain);
      gain.connect(c.destination);
      const start = c.currentTime + delay;
      osc.start(start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.stop(start + duration + 0.02);
    }
    return {
      tick() { tone(1800, 0.03, "square", 0.02); },
      pop() { tone(700, 0.06, "sine", 0.04); },
      error() { tone(220, 0.18, "sawtooth", 0.04); },
      chime() {
        tone(660, 0.18, "sine", 0.05, 0);
        tone(880, 0.18, "sine", 0.05, 0.12);
        tone(1320, 0.25, "sine", 0.05, 0.24);
      }
    };
  })();

  /* ================= LOADING -> GATE ================= */
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      $("#scene-loading").classList.add("scene-out");
      initGate();
    }, 1500);
  });

  /* ================= GATE LOGIC ================= */
  function initGate() {
    const code = CONFIG.gate.code.split("");
    let entered = [];
    const slotsEl = $("#gate-slots");
    const clueEl = $("#gate-clue");
    const gateCard = $("#gate-card");

    // build slots
    slotsEl.innerHTML = code.map(() =>
      `<div class="gate-slot"><span class="digit"></span>${heartSvg()}</div>`
    ).join("");

    const slotEls = $$(".gate-slot", slotsEl);

    function heartSvg() {
      return `<svg viewBox="0 0 32 28"><path d="M16 26C16 26 2 17.5 2 8.8C2 3.9 6 0.5 10.3 0.5C13 0.5 15 2 16 4C17 2 19 0.5 21.7 0.5C26 0.5 30 3.9 30 8.8C30 17.5 16 26 16 26Z"/></svg>`;
    }

    function render() {
      slotEls.forEach((el, i) => {
        const d = entered[i];
        el.querySelector(".digit").textContent = d !== undefined ? d : "";
        el.classList.toggle("filled", d !== undefined);
      });
    }

    function checkComplete() {
      if (entered.length === code.length) {
        const guess = entered.join("");
        if (guess === CONFIG.gate.code) {
          unlockSuccess();
        } else {
          gateFail();
        }
      }
    }

    function gateFail() {
      vibrate([60, 40, 60]);
      SoundFX.error();
      gateCard.classList.add("shake");
      clueEl.textContent = CONFIG.gate.clueWrong;
      clueEl.classList.add("show");
      setTimeout(() => {
        gateCard.classList.remove("shake");
        entered = [];
        render();
      }, 550);
    }

    function unlockSuccess() {
      vibrate([30, 30, 30, 30, 80]);
      SoundFX.chime();
      $("#scene-gate").classList.add("scene-out");
      burstConfetti(60);
      setTimeout(() => {
        $("#scene-main").classList.remove("hidden");
        startMainExperience();
      }, 500);
    }

    $("#gate-keypad").addEventListener("click", (e) => {
      const key = e.target.closest(".gate-key");
      if (!key) return;
      vibrate(12);
      SoundFX.pop();
      if (key.dataset.key === "back") {
        entered.pop();
      } else if (entered.length < code.length) {
        entered.push(key.dataset.key);
      }
      render();
      checkComplete();
    });

    render();
  }

  /* ================= MAIN EXPERIENCE ================= */
  let mainStarted = false;
  function startMainExperience() {
    if (mainStarted) return;
    mainStarted = true;

    initScrollReveal();
    initTypewriter();
    initLetter();
    initTogetherCounter();
    initGallery();
    initMusicPlayer();
    initReasons();
    initFinalReveal();
    initEasterEgg();
    initNightToggle();
    initLastVisited();
    initFloatingHearts();
    initTouchTrail();
    initVibrationButtons();
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initScrollReveal() {
    const els = $$(".reveal");
    const hints = $$(".scroll-hint");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.25 });
    els.forEach((el) => io.observe(el));

    const hintIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const hint = entry.target.querySelector(".scroll-hint");
        if (!hint) return;
        hint.style.opacity = entry.isIntersecting ? "0.55" : "0";
      });
    }, { threshold: 0.6 });
    $$(".section").forEach((sec) => hintIo.observe(sec));
  }

  /* ---------------- TYPEWRITER GREETING ---------------- */
  function initTypewriter() {
    const el = $("#greeting-text");
    if (!el) return;
    const text = CONFIG.greeting.text;
    let i = 0;
    const cursor = document.createElement("span");
    cursor.className = "cursor-blink";
    cursor.textContent = "\u00A0";

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && i === 0) {
          el.appendChild(cursor);
          type();
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);

    function type() {
      if (i < text.length) {
        cursor.insertAdjacentText("beforebegin", text[i]);
        if (text[i].trim() !== "") SoundFX.tick();
        i++;
        setTimeout(type, 65);
      } else {
        cursor.remove();
      }
    }
  }

  /* ---------------- SURAT CINTA ---------------- */
  function initLetter() {
    const trigger = $("#letter-trigger");
    const card = $("#letter-card");
    if (!trigger || !card) return;

    card.innerHTML = CONFIG.letter.paragraphs.map((p) =>
      `<p class="letter-p">${escapeHtml(p)}</p>`
    ).join("") + `<p class="letter-sign">${escapeHtml(CONFIG.letter.signOff)}</p>`;

    trigger.addEventListener("click", () => {
      vibrate(20);
      SoundFX.pop();
      trigger.classList.add("hidden");
      card.classList.remove("hidden");
      const ps = $$(".letter-p, .letter-sign", card);
      ps.forEach((p, idx) => {
        setTimeout(() => p.classList.add("show"), idx * 350);
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- TOGETHER COUNTER ---------------- */
  function initTogetherCounter() {
    const headlineEl = $("#counter-headline");
    const dEl = $("#count-days");
    const hEl = $("#count-hours");
    const mEl = $("#count-minutes");
    const sEl = $("#count-seconds");
    if (!headlineEl) return;

    const start = new Date(CONFIG.relationship.startDate);

    function calendarDiff(from, to) {
      let y = to.getFullYear() - from.getFullYear();
      let m = to.getMonth() - from.getMonth();
      let d = to.getDate() - from.getDate();
      if (d < 0) {
        m--;
        const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
        d += prevMonth.getDate();
      }
      if (m < 0) {
        y--;
        m += 12;
      }
      return { y, m, d };
    }

    function tick() {
      const now = new Date();
      const totalSeconds = Math.max(0, Math.floor((now - start) / 1000));
      const totalDays = Math.floor(totalSeconds / 86400);
      const remainder = totalSeconds % 86400;
      const hh = Math.floor(remainder / 3600);
      const mm = Math.floor((remainder % 3600) / 60);
      const ss = remainder % 60;

      const { y, m, d } = calendarDiff(start, now);
      let parts = [];
      if (y > 0) parts.push(`${y} Tahun`);
      if (m > 0 || y > 0) parts.push(`${m} Bulan`);
      parts.push(`${d} Hari`);

      headlineEl.innerHTML = `Udah <span>${parts.join(" ")}</span><br>kita bersama`;
      dEl.textContent = totalDays;
      hEl.textContent = String(hh).padStart(2, "0");
      mEl.textContent = String(mm).padStart(2, "0");
      sEl.textContent = String(ss).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- GALLERY ---------------- */
  function initGallery() {
    const grid = $("#gallery-grid");
    if (!grid) return;

    grid.innerHTML = CONFIG.gallery.map((item, i) => `
      <div class="gallery-item" data-index="${i}">
        <div class="shimmer"></div>
        <img data-src="${item.src}" alt="${escapeHtml(item.caption)}">
      </div>
    `).join("");

    $$(".gallery-item img", grid).forEach((img) => {
      const realSrc = img.dataset.src;
      const loader = new Image();
      loader.onload = () => {
        img.src = realSrc;
        img.classList.add("loaded");
        const shimmer = img.previousElementSibling;
        if (shimmer) shimmer.remove();
      };
      loader.onerror = () => {
        const shimmer = img.previousElementSibling;
        if (shimmer) shimmer.remove();
      };
      loader.src = realSrc;
    });

    const lightbox = $("#lightbox");
    const lightboxImg = $("#lightbox-img");

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (!item) return;
      const idx = Number(item.dataset.index);
      const src = CONFIG.gallery[idx].src;
      lightboxImg.src = src;
      lightbox.classList.add("show");
      vibrate(15);
    });

    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("show");
    });
  }

  /* ---------------- MUSIC PLAYER ---------------- */
  function initMusicPlayer() {
    const toggle = $("#music-toggle");
    if (!toggle) return;
    const audio = new Audio(CONFIG.music.src);
    audio.loop = true;
    let playing = false;
    let available = true;

    audio.addEventListener("error", () => {
      available = false;
      toggle.classList.add("muted");
      toggle.title = "Tambahkan file musik di assets/music/song.mp3";
    });

    toggle.addEventListener("click", () => {
      vibrate(15);
      if (!available) {
        SoundFX.pop();
        return;
      }
      if (playing) {
        audio.pause();
        toggle.classList.remove("spinning");
      } else {
        audio.play().catch(() => {
          available = false;
          toggle.classList.add("muted");
        });
        toggle.classList.add("spinning");
      }
      playing = !playing;
    });
  }

  /* ---------------- REASONS I LOVE YOU ---------------- */
  function initReasons() {
    const btn = $("#reason-btn");
    const textEl = $("#reason-text");
    if (!btn || !textEl) return;

    let pool = [...CONFIG.reasons];
    let lastIdx = -1;

    function shuffleAndPick() {
      if (pool.length === 0) pool = [...CONFIG.reasons];
      let idx;
      do {
        idx = Math.floor(Math.random() * pool.length);
      } while (pool.length > 1 && idx === lastIdx);
      lastIdx = idx;
      const val = pool[idx];
      pool.splice(idx, 1);
      return val;
    }

    btn.addEventListener("click", () => {
      vibrate(15);
      SoundFX.pop();
      textEl.classList.remove("show");
      setTimeout(() => {
        textEl.textContent = shuffleAndPick();
        textEl.classList.add("show");
      }, 200);
    });

    textEl.textContent = "Tap tombol di bawah buat liat alasannya~";
    textEl.classList.add("show");
  }

  /* ---------------- FINAL REVEAL ---------------- */
  function initFinalReveal() {
    const section = $("#section-final");
    if (!section) return;
    let fired = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          burstConfetti(90);
          vibrate([40, 30, 40, 30, 100]);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(section);
  }

  /* ---------------- EASTER EGG ---------------- */
  function initEasterEgg() {
    const logo = $("#egg-logo");
    const modal = $("#egg-modal");
    const msgEl = $("#egg-message");
    const closeBtn = $("#egg-close");
    if (!logo || !modal) return;

    msgEl.textContent = CONFIG.easterEgg.message;
    let taps = 0;
    let timer = null;

    logo.addEventListener("click", () => {
      taps++;
      vibrate(10);
      clearTimeout(timer);
      timer = setTimeout(() => { taps = 0; }, 3000);
      if (taps >= 5) {
        taps = 0;
        modal.classList.add("show");
        burstConfetti(50);
        SoundFX.chime();
        vibrate([30, 30, 30]);
      }
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      vibrate(10);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("show");
    });
  }

  /* ---------------- NIGHT TOGGLE ---------------- */
  function initNightToggle() {
    const btn = $("#night-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      vibrate(15);
      document.body.classList.toggle("night-mode");
      btn.textContent = document.body.classList.contains("night-mode") ? "☀️" : "🌙";
    });
  }

  /* ---------------- LAST VISITED ---------------- */
  function initLastVisited() {
    const el = $("#last-visited");
    if (!el) return;
    try {
      const prev = localStorage.getItem("bucin_last_visited");
      if (prev) {
        const d = new Date(prev);
        const formatted = d.toLocaleString("id-ID", {
          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        el.textContent = `Kamu terakhir buka surat ini: ${formatted}`;
      } else {
        el.textContent = "Ini pertama kalinya kamu buka surat ini 💕";
      }
      localStorage.setItem("bucin_last_visited", new Date().toISOString());
    } catch (e) { /* localStorage unavailable */ }
  }

  /* ---------------- FLOATING HEARTS AMBIENT ---------------- */
  function initFloatingHearts() {
    const layer = $("#floating-hearts-layer");
    if (!layer) return;
    const emojis = ["💕", "💗", "💓", "🩷", "💖"];
    let count = 0;
    const max = 14;

    function spawn() {
      if (count >= max) return;
      count++;
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const x = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 80;
      const duration = 6 + Math.random() * 5;
      heart.style.left = x + "vw";
      heart.style.setProperty("--drift", drift + "px");
      heart.style.animationDuration = duration + "s";
      heart.style.fontSize = (14 + Math.random() * 12) + "px";
      layer.appendChild(heart);
      setTimeout(() => {
        heart.remove();
        count--;
      }, duration * 1000);
    }

    setInterval(spawn, 750);
  }

  /* ---------------- TOUCH TRAIL ---------------- */
  function initTouchTrail() {
    const layer = $("#touch-trail-layer");
    if (!layer) return;
    let lastSpawn = 0;
    const emojis = ["💗", "💕", "🩷"];

    function spawnTrail(x, y) {
      const now = Date.now();
      if (now - lastSpawn < 90) return;
      lastSpawn = now;
      const heart = document.createElement("span");
      heart.className = "trail-heart";
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = x + "px";
      heart.style.top = y + "px";
      layer.appendChild(heart);
      setTimeout(() => heart.remove(), 750);
    }

    document.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      if (t) spawnTrail(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener("pointermove", (e) => {
      if (e.pointerType === "mouse") spawnTrail(e.clientX, e.clientY);
    });
  }

  /* ---------------- VIBRATION ON GENERIC BUTTONS ---------------- */
  function initVibrationButtons() {
    $$(".btn-pill, .letter-trigger").forEach((btn) => {
      btn.addEventListener("click", () => vibrate(15), { once: false });
    });
  }

  /* ---------------- CONFETTI (lightweight canvas) ---------------- */
  function burstConfetti(count = 60) {
    const canvas = $("#confetti-canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx2d = canvas.getContext("2d");
    const colors = ["#FF5C7A", "#FFB199", "#C9A6E0", "#FFD1DC", "#FFFFFF"];

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 3,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? "heart" : "rect"
    }));

    let frame = 0;
    const maxFrames = 130;

    function drawHeart(ctx3, size) {
      ctx3.beginPath();
      ctx3.moveTo(0, size * 0.3);
      ctx3.bezierCurveTo(0, 0, -size, 0, -size, size * 0.3);
      ctx3.bezierCurveTo(-size, size * 0.7, 0, size, 0, size * 1.2);
      ctx3.bezierCurveTo(0, size, size, size * 0.7, size, size * 0.3);
      ctx3.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
      ctx3.fill();
    }

    function loop() {
      frame++;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx2d.save();
        ctx2d.translate(p.x, p.y);
        ctx2d.rotate((p.rot * Math.PI) / 180);
        ctx2d.fillStyle = p.color;
        if (p.shape === "heart") {
          drawHeart(ctx2d, p.size * 0.5);
        } else {
          ctx2d.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx2d.restore();
      });
      if (frame < maxFrames) {
        requestAnimationFrame(loop);
      } else {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    loop();
  }

})();
