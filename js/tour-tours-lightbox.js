/**
 * City tour cards: hero + thumbnails open GLightbox at the chosen index (no navigation).
 * Slide order matches apartments story: experience images first, vehicle slide(s) last.
 */
(function () {
  "use strict";

  var CONFIG = [
    {
      root: ".tour-card-media--baku-route-tour",
      link: "a.tour-route-lightbox",
      isVehicle: function () {
        return false;
      },
    },
    {
      root: ".tour-card-media--sedan-tour",
      link: "a.tour-sedan-glightbox",
      isVehicle: function (anchor) {
        return anchor.getAttribute("data-tour-slide") === "vehicle";
      },
    },
    {
      root: ".tour-card-media--vito-city-tour",
      link: "a.tour-vito-city-lightbox",
      isVehicle: function (anchor) {
        return anchor.getAttribute("data-tour-slide") === "vehicle";
      },
    },
    {
      root: ".tour-card-media--x5-tour",
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

  function normHref(h) {
    var n =
      window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function"
        ? window.AptImageUtils.normalizeSiteImageUrl(h) || h
        : h;
    if (window.SITE_USE_IMAGE_PLACEHOLDER !== true) return n;
    if (typeof n === "string" && n.indexOf("/images/placeholder.svg") !== -1) return n;
    if (
      window.AptImageUtils &&
      typeof window.AptImageUtils.isLocalListingImageUrl === "function" &&
      window.AptImageUtils.isLocalListingImageUrl(n)
    ) {
      return n;
    }
    return window.SITE_IMAGE_PLACEHOLDER || n;
  }

  function buildElements(links) {
    return links.map(function (anchor) {
      var img = anchor.querySelector("img");
      return {
        href: normHref(anchor.getAttribute("href") || ""),
        type: "image",
        alt: img ? img.getAttribute("alt") || "" : "",
      };
    });
  }

  function syncHeroPreview(gal, start) {
    if (!gal) return;
    var main = gal.querySelector(".tour-hero-gallery__main .tour-hero-gallery__img");
    var thumb = gal.querySelector(
      '.tour-hero-gallery__thumb[data-tour-lb-start="' + start + '"]'
    );
    if (main && thumb) {
      var im = thumb.querySelector("img");
      if (im) {
        main.src = normHref(im.getAttribute("src") || im.src);
        main.alt = im.alt;
      }
    }
    gal.querySelectorAll(".tour-hero-gallery__thumb").forEach(function (t) {
      var ti = parseInt(t.getAttribute("data-tour-lb-start"), 10);
      t.classList.toggle("is-active", ti === start);
    });
  }

  function resolvePack(el) {
    for (var i = 0; i < CONFIG.length; i++) {
      var cfg = CONFIG[i];
      var root = el.closest(cfg.root);
      if (root) return { root: root, cfg: cfg };
    }
    return null;
  }

  function openTourGallery(root, cfg, startAt) {
    var links = orderedLinks(root, cfg).filter(function (a) {
      return (a.getAttribute("href") || "").length;
    });
    var elements = buildElements(links);
    if (!elements.length) return;
    var start = Math.max(0, Math.min(startAt || 0, elements.length - 1));
    if (typeof window.openComfortImageLightbox === "function") {
      window.openComfortImageLightbox(elements, start);
    } else if (typeof GLightbox !== "undefined") {
      GLightbox({
        elements: elements,
        startAt: start,
        touchNavigation: true,
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
      }).open();
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var trigger = e.target.closest("[data-tour-lb-start]");
      if (!trigger) return;
      var pack = resolvePack(trigger);
      if (!pack) return;
      e.preventDefault();
      e.stopPropagation();
      var start = parseInt(trigger.getAttribute("data-tour-lb-start"), 10);
      if (isNaN(start)) start = 0;
      var gal = trigger.closest("[data-tour-hero-gallery]");
      syncHeroPreview(gal, start);
      openTourGallery(pack.root, pack.cfg, start);
    },
    true
  );
})();
