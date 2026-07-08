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
