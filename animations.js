// myAutoBuch Premium Animations
// Fügt Scroll-Reveal-Animationen hinzu, ohne bestehende HTML-Struktur zu ändern.
(function () {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .app-screenshot, .faq-item, .blog-card"
  );
  animatedElements.forEach((element) => {
    element.classList.add("reveal");
  });
  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((element) => element.classList.add("active"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -70px 0px",
    }
  );
  animatedElements.forEach((element) => observer.observe(element));
})();


/* =========================================================
   >>> LANDING-REWORK v1.9 – ergaenzende Scripts (myAutoBuch) <<<
   1) Reveal fuer ALLE .reveal-Elemente (auch die neu im HTML
      gesetzten wie h2, .warum-visual, .compare-col, .preset-chip,
      .beta-card, .ios-card, .carousel3d-caption). Nutzt dieselbe
      .active-Klasse wie dein bestehendes System.
   2) 3D-Karussell-Logik (scharf: perspective() als Funktion,
      aktives Bild ohne Transform; pausiert ausserhalb des Viewports).
   Beide Bloecke sind gekapselt und stoeren deinen Code nicht.
   ========================================================= */

/* 1) Reveal fuer ALLE .reveal-Elemente -> .active */
(function () {
  const els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!els.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("active"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

/* 2) 3D-Karussell (scharf: perspective() als Funktion, aktives Bild ohne Transform) */
(function () {
  var stage = document.getElementById("c3dStage");
  if (!stage) return;
  var items = Array.prototype.slice.call(stage.querySelectorAll(".c3d-item"));
  var capBox = document.getElementById("c3dCaption");
  var capH = capBox.querySelector("h4");
  var capP = capBox.querySelector("p");
  var wrap = document.getElementById("carousel3d");
  var N = items.length;
  var active = 0;
  var timer = null;
  var inView = true;
  var hovering = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    items.forEach(function (el, i) {
      var offset = i - active;
      if (offset > N / 2) offset -= N;
      if (offset < -N / 2) offset += N;
      var abs = Math.abs(offset);
      var opacity = abs > 2 ? 0 : offset === 0 ? 1 : abs === 1 ? 0.55 : 0.28;
      if (offset === 0) {
        // AKTIVES Bild: KEIN transform -> normales Element, pixelscharf in jedem Modus.
        el.style.transform = "none";
      } else {
        // Seitenbilder: perspective() als FUNKTION (nicht als Container-Property!).
        var tx = offset * 300;
        var tz = -abs * 260;
        var ry = offset * -32;
        var scale = Math.max(0.5, 0.66 - (abs - 1) * 0.1);
        el.style.transform =
          "perspective(2000px) translateX(" + tx + "px) translateZ(" + tz +
          "px) rotateY(" + ry + "deg) scale(" + scale + ")";
      }
      el.style.opacity = opacity;
      el.style.zIndex = String(100 - abs);
      el.style.pointerEvents = abs > 2 ? "none" : "auto";
      el.classList.toggle("is-active", offset === 0);
    });
    capH.textContent = items[active].getAttribute("data-title");
    capP.textContent = items[active].getAttribute("data-text");
  }
  function go(dir) { active = (active + dir + N) % N; render(); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function play() {
    stop();
    if (!reduce && inView && !hovering) {
      timer = setInterval(function () { go(1); }, 3800);
    }
  }

  document.getElementById("c3dPrev").addEventListener("click", function () { go(-1); play(); });
  document.getElementById("c3dNext").addEventListener("click", function () { go(1); play(); });
  items.forEach(function (el, i) {
    el.addEventListener("click", function () { active = i; render(); play(); });
  });
  wrap.addEventListener("mouseenter", function () { hovering = true; stop(); });
  wrap.addEventListener("mouseleave", function () { hovering = false; play(); });

  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(
      function (entries) { inView = entries[0].isIntersecting; play(); },
      { threshold: 0.25 }
    );
    io2.observe(wrap);
  }

  render();
  play();
})();
