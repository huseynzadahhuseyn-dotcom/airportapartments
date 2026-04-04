/**
 * In-card image sliders for apartment grids (see buildApartmentCards).
 */
(function () {
  "use strict";

  function initAptSlider(root) {
    if (!root || root.getAttribute("data-apt-slider-initialized") === "true") return;
    var viewport = root.querySelector(".apt-slider-viewport");
    var track = root.querySelector(".apt-slider-track");
    var slides = root.querySelectorAll(".apt-slider-slide");
    var prev = root.querySelector(".apt-slider-prev");
    var next = root.querySelector(".apt-slider-next");
    var dots = root.querySelectorAll(".apt-slider-dot");
    if (!viewport || !track || !slides.length) return;

    root.setAttribute("data-apt-slider-initialized", "true");
    var n = slides.length;
    var i = 0;

    function setActive() {
      var pct = i * 100;
      track.style.transform = "translateX(-" + pct + "%)";
      dots.forEach(function (d, di) {
        d.classList.toggle("is-active", di === i);
      });
      root.dispatchEvent(
        new CustomEvent("apt-slider-changed", { detail: { index: i, slides: n } })
      );
    }

    function go(idx) {
      i = ((idx % n) + n) % n;
      setActive();
    }

    root.addEventListener("apt-slider-goto", function (e) {
      var idx = e.detail && e.detail.index;
      if (typeof idx === "number" && !isNaN(idx)) go(idx);
    });

    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });
    dots.forEach(function (d, di) {
      d.addEventListener("click", function () { go(di); });
    });

    var detailHref = root.getAttribute("data-apt-detail-href");
    if (detailHref) {
      viewport.addEventListener("click", function (e) {
        if (e.target.closest(".apt-slider-nav")) return;
        if (e.target.closest(".apt-slider-dots")) return;
        if (e.target.closest(".apt-card-view-photos")) return;
        if (e.target.closest(".apt-card-thumb-strip")) return;
        window.location.href = detailHref;
      });
    }

    var startX = 0;
    viewport.addEventListener(
      "touchstart",
      function (e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        startX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].screenX - startX;
        if (dx > 56) go(i - 1);
        else if (dx < -56) go(i + 1);
      },
      { passive: true }
    );

    setActive();
  }

  function initAll() {
    document.querySelectorAll("[data-apt-slider]").forEach(initAptSlider);
  }

  window.initApartmentSliders = initAll;
})();
