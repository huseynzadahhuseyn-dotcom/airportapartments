/**
 * Sedan city tour: lightbox order is always city / experience first, sedan vehicle last
 * (figures without baku-tour-gallery__item--vehicle, then that class). Thumbnails should
 * match; this ordering fixes slide sequence even if DOM order drifts.
 */
(function () {
  "use strict";

  var ROOT = ".tour-card-media--sedan-gallery";
  var LINK = "a.tour-sedan-glightbox";
  var VEHICLE = "baku-tour-gallery__item--vehicle";

  function orderedLinks(root) {
    var items = Array.prototype.slice.call(
      root.querySelectorAll(".baku-tour-gallery > .gallery-item")
    );
    var city = [];
    var vehicle = [];
    items.forEach(function (fig) {
      var a = fig.querySelector(LINK);
      if (!a) return;
      if (fig.classList.contains(VEHICLE)) vehicle.push(a);
      else city.push(a);
    });
    return city.concat(vehicle);
  }

  function buildElements(links) {
    return links.map(function (anchor) {
      var img = anchor.querySelector("img");
      return {
        href: anchor.getAttribute("href") || "",
        type: "image",
        alt: img ? img.getAttribute("alt") || "" : "",
      };
    });
  }

  function openSedanGallery(root, anchor) {
    if (typeof GLightbox === "undefined") return;
    var links = orderedLinks(root).filter(function (a) {
      return (a.getAttribute("href") || "").length;
    });
    var elements = buildElements(links);
    if (!elements.length) return;

    var startAt = links.indexOf(anchor);
    if (startAt < 0) startAt = 0;

    var lb = GLightbox({
      elements: elements,
      startAt: startAt,
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
    });
    lb.open();
  }

  document.addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest(LINK);
      if (!anchor) return;
      var root = anchor.closest(ROOT);
      if (!root) return;
      e.preventDefault();
      e.stopPropagation();
      openSedanGallery(root, anchor);
    },
    true
  );
})();
