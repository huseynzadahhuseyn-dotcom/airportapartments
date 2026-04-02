/**
 * City tour cards (Sedan, Vito, BMW X5): programmatic GLightbox with fixed story order —
 * experience / city slides first, vehicle slide(s) last (see markup). Always opens on slide 0
 * (first experience). Thumbnail DOM order should match that sequence.
 */
(function () {
  "use strict";

  var CONFIG = [
    {
      root: ".tour-card-media--sedan-gallery",
      link: "a.tour-sedan-glightbox",
      isVehicle: function (anchor) {
        var fig = anchor.closest(".gallery-item");
        return fig && fig.classList.contains("baku-tour-gallery__item--vehicle");
      },
    },
    {
      root: ".tour-card-media--vito-slider",
      link: "a.tour-vito-lightbox",
      isVehicle: function (anchor) {
        return anchor.getAttribute("data-tour-slide") === "vehicle";
      },
    },
    {
      root: ".tour-card-media--x5-gallery",
      link: "a.tour-x5-lightbox",
      isVehicle: function (anchor) {
        return anchor.getAttribute("data-tour-slide") === "vehicle";
      },
    },
  ];

  function orderedLinks(root, cfg) {
    var nodes = Array.prototype.slice.call(root.querySelectorAll(cfg.link));
    var experience = [];
    var vehicle = [];
    nodes.forEach(function (a) {
      if (cfg.isVehicle(a)) vehicle.push(a);
      else experience.push(a);
    });
    return experience.concat(vehicle);
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

  function openTourGallery(root, cfg) {
    if (typeof GLightbox === "undefined") return;
    var links = orderedLinks(root, cfg).filter(function (a) {
      return (a.getAttribute("href") || "").length;
    });
    var elements = buildElements(links);
    if (!elements.length) return;

    var lb = GLightbox({
      elements: elements,
      startAt: 0,
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
      for (var i = 0; i < CONFIG.length; i++) {
        var cfg = CONFIG[i];
        var anchor = e.target.closest(cfg.link);
        if (!anchor) continue;
        var root = anchor.closest(cfg.root);
        if (!root) continue;
        e.preventDefault();
        e.stopPropagation();
        openTourGallery(root, cfg);
        return;
      }
    },
    true
  );
})();
