/**
 * Mercedes Vito card: horizontal scroll + dot indicators (viewport sync).
 */
(function () {
  "use strict";

  function initSlider(root) {
    if (!root) return;
    var viewport = root.querySelector(".tour-vito-slider__viewport");
    var dots = root.querySelectorAll(".tour-vito-slider__dot");
    var slides = root.querySelectorAll(".tour-vito-slider__slide");
    if (!viewport || !dots.length || !slides.length) return;

    function setActive(i) {
      var n = slides.length;
      var idx = ((i % n) + n) % n;
      dots.forEach(function (dot, di) {
        var on = di === idx;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-current", on ? "true" : "false");
      });
    }

    function indexFromScroll() {
      var w = viewport.clientWidth || 1;
      return Math.round(viewport.scrollLeft / w);
    }

    viewport.addEventListener(
      "scroll",
      function () {
        setActive(indexFromScroll());
      },
      { passive: true }
    );

    dots.forEach(function (dot, di) {
      dot.addEventListener("click", function () {
        var w = viewport.clientWidth;
        viewport.scrollTo({ left: di * w, behavior: "smooth" });
        setActive(di);
      });
    });

    setActive(0);
  }

  function initAll() {
    document.querySelectorAll("[data-tour-vito-slider]").forEach(initSlider);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
