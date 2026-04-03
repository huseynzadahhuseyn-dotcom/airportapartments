/**
 * Homepage #gallery: one cover image per apartment group; extra photos stay off-screen for lightbox.
 * Tap cover → GLightbox with the full set. Broken files hidden (no placeholders).
 */
(function () {
  "use strict";

  var gbInstance = null;
  var delegateAttached = false;

  function t(key, vars) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key, vars);
    }
    return key;
  }

  function normUrl(u) {
    if (typeof window.resolveListingImageUrl === "function") {
      return window.resolveListingImageUrl(u);
    }
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function collectLightboxPayloadFromBlock(block, clickedBtn) {
    if (!block) return { elements: [], startAt: 0 };
    var figures = block.querySelectorAll(".gallery-apt-item:not(.is-broken)");
    var elements = [];
    var startAt = 0;
    for (var i = 0; i < figures.length; i++) {
      var fig = figures[i];
      var btn = fig.querySelector("button.gallery-apt-thumb");
      var img = fig.querySelector("img.gallery-apt-img");
      if (!btn || !img) continue;
      var href = img.currentSrc || img.getAttribute("src") || "";
      if (!href) continue;
      elements.push({
        href: href,
        type: "image",
        alt: img.getAttribute("alt") || "",
      });
      if (clickedBtn && (btn === clickedBtn || btn.contains(clickedBtn))) {
        startAt = elements.length - 1;
      }
    }
    return { elements: elements, startAt: startAt };
  }

  function openLightbox(block, clickedBtn) {
    var payload = collectLightboxPayloadFromBlock(block, clickedBtn);
    if (!payload.elements.length) return;
    if (typeof window.openComfortImageLightbox === "function") {
      window.openComfortImageLightbox(payload.elements, payload.startAt);
      return;
    }
    if (typeof GLightbox === "undefined") return;
    var lb = GLightbox({
      elements: payload.elements,
      startAt: payload.startAt,
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

  function attachDelegate(container) {
    if (!container || delegateAttached) return;
    delegateAttached = true;
    container.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button.gallery-apt-thumb");
      if (!btn || !container.contains(btn)) return;
      ev.preventDefault();
      var block = btn.closest(".gallery-apartment-block");
      if (!block) return;
      openLightbox(block, btn);
    });
  }

  function refreshApartmentBlock(block) {
    if (!block || !block.classList.contains("gallery-apartment-block")) return;
    var n = block.querySelectorAll(".gallery-apt-item:not(.is-broken)").length;
    if (n === 0) {
      block.setAttribute("hidden", "");
      block.setAttribute("aria-hidden", "true");
    } else {
      block.removeAttribute("hidden");
      block.removeAttribute("aria-hidden");
    }
  }

  function checkGalleryHasPhotos(container) {
    if (!container) return;
    var anyGood = container.querySelector(".gallery-apt-item:not(.is-broken)");
    var msg = container.querySelector(".gallery-empty--global");
    if (anyGood) {
      if (msg) msg.remove();
      return;
    }
    if (msg) return;
    var empty = el("p", { className: "gallery-empty gallery-empty--global" });
    empty.setAttribute("data-i18n", "gallery_empty_apartments");
    container.appendChild(empty);
    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(container);
    }
  }

  function onThumbError(img) {
    var wrap = img.closest(".gallery-apt-item");
    if (!wrap) return;
    wrap.classList.add("is-broken");
    wrap.setAttribute("hidden", "");
    wrap.setAttribute("aria-hidden", "true");
    var block = img.closest(".gallery-apartment-block");
    if (block && wrap.classList.contains("gallery-apt-item--hero")) {
      var extras = block.querySelector(".gallery-apartment-grid--extras");
      if (extras) {
        extras.classList.remove("gallery-apartment-grid--extras");
        extras.classList.add("gallery-apartment-grid--fallback");
      }
    }
    refreshApartmentBlock(block);
    checkGalleryHasPhotos(img.closest("#gallery-grid"));
  }

  function renderGallery(container) {
    if (!container) return;
    container.textContent = "";
    container.className = "gallery-grid gallery-grid--by-apartment";

    var groups = window.SITE_GALLERY_GROUPS;
    if (!groups || !groups.length) {
      var empty = el("p", { className: "gallery-empty" });
      empty.setAttribute("data-i18n", "gallery_empty_apartments");
      container.appendChild(empty);
      if (window.I18N && typeof window.I18N.apply === "function") {
        window.I18N.apply(container);
      }
      return;
    }

    var globalSlot = 0;

    groups.forEach(function (group) {
      if (!group || !group.images || !group.images.length) return;

      var block = el("section", { className: "gallery-apartment-block" });
      var head = el("h3", { className: "gallery-apartment-title" });
      head.setAttribute("data-i18n", group.titleKey || "gallery_listing_name");
      block.appendChild(head);

      var figures = [];

      group.images.forEach(function (rawUrl, idxInGroup) {
        var url = normUrl(rawUrl);
        if (!url) return;

        var listingName = t(group.titleKey || "gallery_listing_name");
        var alt = t("gallery_apt_photo_alt", { name: listingName, n: idxInGroup + 1 });

        var figure = el("figure", { className: "gallery-apt-item" });
        var btn = el("button", {
          type: "button",
          className: "gallery-apt-thumb",
          "aria-label": alt + " — " + t("gallery_open_full_set_a11y"),
        });

        if (idxInGroup === 0) {
          figure.classList.add("gallery-apt-item--hero");
          btn.classList.add("gallery-hero-open");
          btn.setAttribute("data-i18n-aria-label", "apt_hero_open_gallery_a11y");
          btn.setAttribute("aria-label", "");
        }

        var img = el("img", {
          className: "gallery-apt-img",
          src: url,
          alt: alt,
          width: "800",
          height: "600",
          sizes: "(max-width: 767px) 100vw, 90vw",
          decoding: "async",
        });
        img.setAttribute("data-no-img-fallback", "true");
        if (globalSlot < 15) {
          img.setAttribute("loading", "eager");
          if (globalSlot < 8) img.setAttribute("fetchpriority", "high");
          if (globalSlot < 3) img.setAttribute("decoding", "sync");
        } else {
          img.setAttribute("loading", "lazy");
        }
        globalSlot++;

        img.addEventListener(
          "load",
          function () {
            refreshApartmentBlock(img.closest(".gallery-apartment-block"));
          },
          { once: true }
        );

        img.addEventListener(
          "error",
          function () {
            onThumbError(img);
          },
          { once: true }
        );

        btn.appendChild(img);
        figure.appendChild(btn);
        figures.push(figure);
      });

      if (!figures.length) return;

      var heroFig = figures[0];
      block.appendChild(heroFig);

      if (figures.length > 1) {
        var extras = el("div", { className: "gallery-apartment-grid gallery-apartment-grid--extras" });
        for (var fi = 1; fi < figures.length; fi++) {
          extras.appendChild(figures[fi]);
        }
        block.appendChild(extras);

        var heroBtn = heroFig.querySelector("button.gallery-hero-open");
        if (heroBtn) {
          heroBtn.appendChild(
            el("span", { className: "gallery-hero-count", textContent: String(figures.length) })
          );
          var hint = el("span", { className: "gallery-hero-hint" });
          hint.setAttribute("data-i18n", "apt_hero_more_photos");
          heroBtn.appendChild(hint);
        }
      }

      container.appendChild(block);
    });

    attachDelegate(container);

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(container);
    }

    if (window.AptImageUtils && typeof window.AptImageUtils.bindGalleryImages === "function") {
      window.AptImageUtils.bindGalleryImages(container);
    }

    window.requestAnimationFrame(function () {
      checkGalleryHasPhotos(container);
    });
  }

  function initLightbox() {
    if (typeof GLightbox === "undefined") return;
    if (gbInstance && typeof gbInstance.destroy === "function") {
      try {
        gbInstance.destroy();
      } catch (e) {}
      gbInstance = null;
    }
    if (!document.querySelector(".glightbox")) return;
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
    initLightbox();
  }

  window.__i18nDomHydrators = window.__i18nDomHydrators || [];
  window.__i18nDomHydrators.push(refreshGallery);
})();
