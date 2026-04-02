/**
 * GLightbox wrapper: shared options, slide counter (e.g. "1 / 14"), premium chrome via CSS.
 */
(function () {
  "use strict";

  function baseOpts(overrides) {
    var o = {
      touchNavigation: true,
      touchFollowAxis: true,
      loop: true,
      closeOnOutsideClick: true,
      keyboardNavigation: true,
      closeButton: true,
      zoomable: true,
      draggable: true,
      dragAutoSnap: true,
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "slide",
      preload: true,
    };
    if (overrides) {
      Object.keys(overrides).forEach(function (k) {
        o[k] = overrides[k];
      });
    }
    return o;
  }

  /**
   * @param {Array<{href:string,type?:string,alt?:string}>} elements
   * @param {number} [startAt]
   * @returns {object|null} GLightbox instance or null
   */
  window.openComfortImageLightbox = function (elements, startAt) {
    if (typeof GLightbox === "undefined" || !elements || !elements.length) return null;
    var total = elements.length;
    var start = Math.max(0, Math.min(startAt == null ? 0 : startAt, total - 1));
    var lb = GLightbox(
      baseOpts({
        elements: elements,
        startAt: start,
      })
    );

    var counterEl = null;

    function ensureCounter() {
      if (counterEl) return;
      counterEl = document.createElement("div");
      counterEl.className = "glightbox-counter";
      counterEl.setAttribute("aria-live", "polite");
      var host = document.querySelector(".glightbox-container");
      if (host) host.appendChild(counterEl);
    }

    function setCounter(index) {
      ensureCounter();
      if (counterEl) {
        counterEl.textContent = index + 1 + " / " + total;
      }
    }

    if (typeof lb.on === "function") {
      lb.on("open", function () {
        requestAnimationFrame(function () {
          setCounter(start);
        });
      });
      lb.on("slide_changed", function (d) {
        if (d && d.current && typeof d.current.slideIndex === "number") {
          setCounter(d.current.slideIndex);
        }
      });
      lb.on("close", function () {
        if (counterEl && counterEl.parentNode) {
          counterEl.parentNode.removeChild(counterEl);
        }
        counterEl = null;
      });
    }

    lb.open();
    return lb;
  };
})();
