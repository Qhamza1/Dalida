(function () {
  "use strict";

  /* ===== Edit everything here: dates, photos, captions and texts ===== */
  const DALIDA = {
    name: "Dalida",
    birthDate: "2025-01-01",
    secondBirthday: "2027-01-01",
    hero: {
      photo: "dalida.jpg",
      line: "A little girl. A thousand beautiful moments.",
      ar: "سنتين من الضحكة، والخطوات الصغيرة، والحب الكبير."
    },
    chapters: [
      { label: "Chapter One", text: "And then, Dalida arrived...", photo: "dalida1.jpg", date: "January 2025" },
      { label: "Chapter Two", text: "Little steps, big adventures...", photo: "dalida2.jpg", date: "2025" },
      { label: "Chapter Three", text: "The world became her playground.", photo: "dalida3.jpg", date: "2026" }
    ],
    photos: [
      { src: "dalida4.jpg", caption: "Her laugh" },
      { src: "dalida5.jpg", caption: "Playtime" },
      { src: "dalida6.jpg", caption: "Sweet dreams" },
      { src: "dalida7.jpg", caption: "Family" },
      { src: "dalida8.jpg", caption: "Outside" },
      { src: "dalida1.jpg", caption: "So tiny" },
      { src: "dalida2.jpg", caption: "First steps" },
      { src: "dalida3.jpg", caption: "Almost two" }
    ],
    things: [
      { icon: "✨", text: "Your smile" },
      { icon: "🌸", text: "Your little laugh" },
      { icon: "🦋", text: "Your tiny steps" },
      { icon: "💗", text: "Your curious eyes" },
      { icon: "🌙", text: "The way you fall asleep" },
      { icon: "☀️", text: "The happiness you bring" }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");
  const day = (s) => new Date(s + "T00:00:00");
  const longDate = (s) => day(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function picture(src, alt) {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => img.parentElement.classList.add("is-empty"));
    return img;
  }

  /* ===== Fill content ===== */
  document.title = "The Little Book of " + DALIDA.name;
  $("coverDate").textContent = "Born " + longDate(DALIDA.birthDate);
  $("heroImg").src = DALIDA.hero.photo;
  $("heroImg").addEventListener("error", (e) => e.target.parentElement.classList.add("is-empty"));
  $("heroName").textContent = DALIDA.name;
  $("heroLine").textContent = DALIDA.hero.line;
  $("heroAr").textContent = DALIDA.hero.ar;
  $("message").textContent = DALIDA.birthdayMessage;
  $("message").dir = "auto";
  $("bigDate").textContent = longDate(DALIDA.secondBirthday);

  DALIDA.chapters.forEach((c) => {
    const page = el("article", "page reveal");
    const fig = el("figure", "frame");
    fig.appendChild(picture(c.photo, c.text));
    page.append(el("h2", "", c.label), el("p", "", c.text), fig, el("time", "", c.date));
    $("chapters").appendChild(page);
  });

  DALIDA.photos.forEach((p, i) => {
    const li = el("li", "reveal");
    const b = el("button", "polaroid");
    b.type = "button";
    b.style.setProperty("--r", (i % 2 ? 2 : -2) + "deg");
    b.append(picture(p.src, p.caption), el("span", "", p.caption));
    b.addEventListener("click", () => openLightbox(i));
    li.appendChild(b);
    $("scrap").appendChild(li);
  });

  DALIDA.things.forEach((t) => {
    const li = el("li", "reveal");
    const i = el("i", "", t.icon);
    i.setAttribute("aria-hidden", "true");
    li.append(i, el("span", "", t.text));
    $("things").appendChild(li);
  });

  /* ===== Age ===== */
  const born = day(DALIDA.birthDate);
  const now = new Date();
  let years = now.getFullYear() - born.getFullYear();
  let months = now.getMonth() - born.getMonth();
  if (now.getDate() < born.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  const totalDays = Math.floor((now - born) / 86400000);
  $("ageYears").textContent = years + (years === 1 ? " year" : " years");
  $("ageMonths").textContent = years * 12 + months;
  $("ageWeeks").textContent = "~" + Math.floor(totalDays / 7);
  $("ageDays").textContent = totalDays;

  /* ===== Effects ===== */
  function pop(char, x, y) {
    const s = el("span", "pop", char);
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.addEventListener("animationend", () => s.remove());
    $("fx").appendChild(s);
  }
  function burstAt(char, node, count) {
    if (reduce) return;
    const r = node.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      pop(char, r.left + Math.random() * r.width, r.top + Math.random() * r.height);
    }
  }
  function confetti() {
    if (reduce) return;
    const colors = ["#C9707A", "#F8D2B0", "#E9C877", "#F9D9D3"];
    for (let i = 0; i < 36; i++) {
      const b = el("span", "bit" + (i % 3 === 0 ? " r" : i % 7 === 0 ? " g" : ""));
      if (b.classList.contains("g")) b.textContent = i % 2 ? "★" : "♥";
      b.style.left = Math.random() * 100 + "%";
      b.style.background = colors[i % colors.length];
      b.style.color = colors[i % 2 ? 0 : 2];
      b.style.animationDelay = Math.random() * 0.8 + "s";
      b.addEventListener("animationend", () => b.remove());
      $("fx").appendChild(b);
    }
  }
  function onDoubleTap(node, fn) {
    let last = 0;
    node.addEventListener("pointerup", (e) => {
      if (e.timeStamp - last < 300) fn(e);
      last = e.timeStamp;
    });
  }
  $("heroName").addEventListener("click", (e) => burstAt("♥", e.currentTarget, 6));
  let taps = 0;
  $("num2").addEventListener("click", (e) => {
    taps += 1;
    if (taps % 3 === 0) burstAt("★", e.currentTarget, 8);
  });
  onDoubleTap($("heroImg").parentElement, (e) => pop("♥", e.clientX, e.clientY));

  /* ===== Reveal on scroll ===== */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((list) => {
      list.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((n) => io.observe(n));
  } else {
    reveals.forEach((n) => n.classList.add("in"));
  }

  /* ===== Lightbox ===== */
  const box = $("lightbox");
  let current = 0;
  function showPhoto(i) {
    const n = DALIDA.photos.length;
    current = (i + n) % n;
    $("lbImg").src = DALIDA.photos[current].src;
    $("lbImg").alt = DALIDA.photos[current].caption;
    $("lbCap").textContent = DALIDA.photos[current].caption;
  }
  function openLightbox(i) { showPhoto(i); box.showModal(); }
  $("lbNext").addEventListener("click", () => showPhoto(current + 1));
  $("lbPrev").addEventListener("click", () => showPhoto(current - 1));
  $("lbClose").addEventListener("click", () => box.close());
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") showPhoto(current + 1);
    if (e.key === "ArrowLeft") showPhoto(current - 1);
  });
  let startX = 0;
  box.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
  });
  onDoubleTap($("lbImg"), (e) => pop("♥", e.clientX, e.clientY));

  /* ===== Music ===== */
  const audio = $("audio");
  const music = $("music");
  const PLAY = "M8 5v14l11-7z";
  const PAUSE = "M7 5h4v14H7zM13 5h4v14h-4z";
  const startMusic = () => audio.play().catch(() => {});
  audio.addEventListener("play", () => setMusicUi(true));
  audio.addEventListener("pause", () => setMusicUi(false));
  function setMusicUi(on) {
    music.classList.toggle("is-playing", on);
    music.setAttribute("aria-pressed", String(on));
    music.setAttribute("aria-label", on ? "Pause music" : "Play music");
    $("musicIcon").setAttribute("d", on ? PAUSE : PLAY);
  }
  music.addEventListener("click", () => {
    if (audio.paused) startMusic(); else audio.pause();
  });

  /* ===== Opening the book ===== */
  $("openBook").addEventListener("click", () => {
    const btn = $("openBook");
    btn.disabled = true;
    audio.play().then(() => {
      const cover = $("cover");
      cover.classList.add("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(() => cover.remove(), 950);
    }).catch(() => {
      $("coverErr").hidden = false;
      btn.disabled = false;
    });
  });

  /* ===== Countdown ===== */
  const target = day(DALIDA.secondBirthday);
  const big = $("bigday");
  let celebrated = false;
  function celebrate() {
    $("countdown").hidden = true;
    $("party").hidden = false;
    if (celebrated) return;
    celebrated = true;
    if ("IntersectionObserver" in window) {
      const once = new IntersectionObserver((l) => {
        if (l[0].isIntersecting) { confetti(); once.disconnect(); }
      }, { threshold: 0.3 });
      once.observe(big);
    } else {
      confetti();
    }
  }
  function tick() {
    const ms = target - new Date();
    if (ms <= 0) { celebrate(); return; }
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    $("cdDays").textContent = d;
    $("cdHours").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cdMinutes").textContent = pad(Math.floor((s % 3600) / 60));
    $("cdSeconds").textContent = pad(s % 60);
    $("sleeps").textContent = "Only " + Math.ceil(ms / 86400000) + " sleeps until " + DALIDA.name + " turns TWO";
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();
})();
