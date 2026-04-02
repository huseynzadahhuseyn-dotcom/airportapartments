/**
 * Homepage #gallery: one cover image; tap opens GLightbox with `window.SITE_GALLERY_IMAGES` (`/images/*` only).
 * (prev/next controls, keyboard, swipe on touch).
 */
(function () {
  "use strict";

  var PREVIEW_COUNT = 1;
  var GALLERY_NAME = "baku-airport-apartments";
  var gbInstance = null;
  var previewListenerAttached = false;

  function t(key, vars) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key, vars);
    }
    return key;
  }

  function buildGalleryItems() {
    var urls = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    return urls.map(function (url, i) {
      var idx = i + 1;
      var isFirst = idx === 1;
      return {
        gallery: GALLERY_NAME,
        altKey: "gallery_alt_" + idx,
        photoIndex: idx,
        captionKey: isFirst ? "gallery_caption_1" : null,
        captionIsHtml: isFirst,
        captionSimple: !isFirst,
        imageUrl: url,
      };
    });
  }

  function resolveFullUrl(item) {
    var u = item.imageUrl || "";
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function resolveThumbUrl(item) {
    return resolveFullUrl(item);
  }

  function captionForItem(item) {
    if (item.captionKey && item.captionIsHtml) return t(item.captionKey);
    if (item.captionSimple) {
      return t("gallery_caption_simple", {
        name: t("gallery_listing_name"),
        n: item.photoIndex,
      });
    }
    return "";
  }

  function altForItem(item) {
    return t(item.altKey);
  }

  function titleForItem() {
    return t("gallery_listing_name");
  }

  function descForItem(item) {
    return t("gallery_photo_n", { n: item.photoIndex });
  }

  function el(tag, attrs, innerHTML) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (innerHTML != null) node.innerHTML = innerHTML;
    return node;
  }

  function openFullGallery(startIndex) {
    if (typeof GLightbox === "undefined") return;
    var items = buildGalleryItems();
    if (!items.length) return;

    var elements = items.map(function (item) {
      return {
        href: resolveFullUrl(item),
        type: "image",
        title: titleForItem(),
        description: descForItem(item),
        alt: altForItem(item),
      };
    });

    var startAt = Math.max(0, Math.min(startIndex, elements.length - 1));

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

  function attachPreviewClicks(container) {
    if (previewListenerAttached || !container) return;
    previewListenerAttached = true;
    container.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".gallery-preview-btn");
      if (!btn) return;
      ev.preventDefault();
      var idx = parseInt(btn.getAttribute("data-gallery-index"), 10);
      if (isNaN(idx)) idx = 0;
      openFullGallery(idx);
    });
  }

  function updatePreviewLabels(container) {
    if (!container) return;
    var items = buildGalleryItems();
    var total = items.length;
    container.querySelectorAll(".gallery-preview-btn").forEach(function (btn) {
      var i = parseInt(btn.getAttribute("data-gallery-index"), 10);
      if (isNaN(i)) return;
      var item = items[i];
      if (!item) return;
      var alt = altForItem(item);
      var hint = t("gallery_open_full_set_a11y");
      var badgeText = t("gallery_photo_count_badge", { count: total });
      btn.setAttribute("aria-label", alt + " — " + badgeText + ". " + hint);
      var badgeEl = btn.querySelector(".gallery-cover-badge");
      var ctaEl = btn.querySelector(".gallery-cover-cta");
      if (badgeEl) badgeEl.textContent = badgeText;
      if (ctaEl) ctaEl.textContent = t("gallery_view_gallery_cta");
    });
  }

  function renderGallery(container) {
    if (!container) return;
    container.textContent = "";
    container.classList.add("gallery-grid--preview", "gallery-grid--cover");

    var items = buildGalleryItems();
    var n = Math.min(PREVIEW_COUNT, items.length);
    var total = items.length;

    for (var i = 0; i < n; i++) {
      var item = items[i];
      var fullUrl = resolveFullUrl(item);
      if (!fullUrl) continue;

      var figure = el("figure", { className: "gallery-item gallery-item--preview gallery-item--cover" });

      var hint = t("gallery_open_full_set_a11y");
      var btn = el("button", {
        type: "button",
        className: "gallery-preview-btn gallery-preview-btn--cover",
        "data-gallery-index": String(i),
        "aria-label":
          altForItem(item) +
          " — " +
          t("gallery_photo_count_badge", { count: total }) +
          ". " +
          hint,
      });

      var img = el("img", {
        className: "gallery-img",
        src: resolveThumbUrl(item),
        alt: altForItem(item),
        width: "1200",
        height: "900",
        sizes: "(max-width: 767px) 100vw, min(48rem, 88vw)",
        decoding: "async",
      });
      img.setAttribute("loading", "eager");
      img.setAttribute("fetchpriority", "high");

      var overlay = el("span", { className: "gallery-cover-overlay" });
      var badge = el("span", { className: "gallery-cover-badge" });
      badge.textContent = t("gallery_photo_count_badge", { count: total });
      var cta = el("span", { className: "gallery-cover-cta" });
      cta.textContent = t("gallery_view_gallery_cta");
      overlay.appendChild(badge);
      overlay.appendChild(cta);

      btn.appendChild(img);
      btn.appendChild(overlay);
      figure.appendChild(btn);
      container.appendChild(figure);
    }

    attachPreviewClicks(container);
    updatePreviewLabels(container);
  }

  function initLightbox() {
    if (typeof GLightbox === "undefined") return;
    if (gbInstance && typeof gbInstance.destroy === "function") {
      try {
        gbInstance.destroy();
      } catch (e) {}
      gbInstance = null;
    }
    gbInstance = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      closeOnOutsideClick: true,
      keyboardNavigation: true,
      closeButton: true,
      zoomable: true,
      dragAutoSnap: true,
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "slide",
    });
  }

  function refreshGallery() {
    var container = document.getElementById("gallery-grid");
    if (!container) return;
    renderGallery(container);
    if (window.AptImageUtils && typeof window.AptImageUtils.bindGalleryImages === "function") {
      window.AptImageUtils.bindGalleryImages(container);
    }
    initLightbox();
  }

  window.addEventListener("i18n:applied", refreshGallery);
})();
