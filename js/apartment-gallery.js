/**
 * Homepage #gallery: one large centered cover; all listing photos live in a hidden vault for GLightbox.
 * Tap cover → full set (all groups, in order). Broken files hidden (no placeholders).
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

  function queryOrderedFigures(container) {
    return container.querySelectorAll(
      ".gallery-single-wrap .gallery-apt-item:not(.is-broken), .gallery-vault .gallery-apt-item:not(.is-broken)"
    );
  }

  function updateHeroChrome(container) {
    var figures = queryOrderedFigures(container);
    var n = figures.length;
    var badge = container.querySelector(".gallery-single-wrap .gallery-hero-count");
    var hint = container.querySelector(".gallery-single-wrap .gallery-hero-hint");
    if (badge) badge.textContent = String(n);
    if (hint) {
      if (n > 1) hint.removeAttribute("hidden");
      else hint.setAttribute("hidden", "");
    }
  }

  function decorateHeroButton(btn, withExtras) {
    btn.classList.add("gallery-hero-open", "gallery-global-hero");
    btn.setAttribute("data-i18n-aria-label", "apt_hero_open_gallery_a11y");
    btn.setAttribute("aria-label", "");
    var existing = btn.querySelector(".gallery-hero-count, .gallery-hero-hint");
    if (existing) return;
    if (withExtras) {
      btn.appendChild(el("span", { className: "gallery-hero-count", textContent: "0" }));
      var hint = el("span", { className: "gallery-hero-hint" });
      hint.setAttribute("data-i18n", "apt_hero_more_photos");
      btn.appendChild(hint);
    }
  }

  function collectLightboxPayloadFromGallery(container, clickedBtn) {
    var figures = queryOrderedFigures(container);
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

  function openLightbox(container, clickedBtn) {
    var payload = collectLightboxPayloadFromGallery(container, clickedBtn);
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
      openLightbox(container, btn);
    });
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

  function promoteGalleryHero(container) {
    var wrap = container.querySelector(".gallery-single-wrap");
    var vault = container.querySelector(".gallery-vault");
    if (!wrap || !vault) return;
    wrap.textContent = "";
    var next = vault.querySelector(".gallery-apt-item:not(.is-broken)");
    if (!next) {
      wrap.setAttribute("hidden", "");
      wrap.setAttribute("aria-hidden", "true");
      return;
    }
    wrap.removeAttribute("hidden");
    wrap.removeAttribute("aria-hidden");
    next.classList.add("gallery-apt-item--hero-global");
    var btn = next.querySelector("button.gallery-apt-thumb");
    if (btn) {
      var totalSlots = container.querySelectorAll(".gallery-apt-item").length;
      decorateHeroButton(btn, totalSlots > 1);
    }
    wrap.appendChild(next);
    updateHeroChrome(container);
  }

  function onThumbError(img, container) {
    var wrap = img.closest(".gallery-apt-item");
    if (!wrap) return;
    wrap.classList.add("is-broken");
    wrap.setAttribute("hidden", "");
    wrap.setAttribute("aria-hidden", "true");

    var inHeroSlot = img.closest(".gallery-single-wrap");
    if (inHeroSlot) {
      promoteGalleryHero(container);
    }

    checkGalleryHasPhotos(container);
    updateHeroChrome(container);
  }

  function renderGallery(container) {
    if (!container) return;
    container.textContent = "";
    container.className = "gallery-grid gallery-grid--by-apartment gallery-grid--single-hero";

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
    var allFigures = [];

    groups.forEach(function (group) {
      if (!group || !group.images || !group.images.length) return;

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

        var img = el("img", {
          className: "gallery-apt-img",
          src: url,
          alt: alt,
          width: "1200",
          height: "900",
          sizes: "(max-width: 767px) 100vw, min(56rem, 90vw)",
          decoding: "async",
        });
        img.setAttribute("data-no-img-fallback", "true");
        if (globalSlot < 20) {
          img.setAttribute("loading", "eager");
          if (globalSlot < 6) img.setAttribute("fetchpriority", "high");
          if (globalSlot < 2) img.setAttribute("decoding", "sync");
        } else {
          img.setAttribute("loading", "lazy");
        }
        globalSlot++;

        img.addEventListener(
          "load",
          function () {
            updateHeroChrome(container);
          },
          { once: true }
        );

        img.addEventListener(
          "error",
          function () {
            onThumbError(img, container);
          },
          { once: true }
        );

        btn.appendChild(img);
        figure.appendChild(btn);
        allFigures.push(figure);
      });
    });

    if (!allFigures.length) {
      var empty2 = el("p", { className: "gallery-empty" });
      empty2.setAttribute("data-i18n", "gallery_empty_apartments");
      container.appendChild(empty2);
      if (window.I18N && typeof window.I18N.apply === "function") {
        window.I18N.apply(container);
      }
      return;
    }

    var wrap = el("div", { className: "gallery-single-wrap" });
    var vault = el("div", { className: "gallery-vault gallery-apartment-grid--extras" });

    var heroFig = allFigures[0];
    heroFig.classList.add("gallery-apt-item--hero-global");
    var heroBtn = heroFig.querySelector("button.gallery-apt-thumb");
    if (heroBtn) {
      decorateHeroButton(heroBtn, allFigures.length > 1);
    }
    wrap.appendChild(heroFig);

    for (var i = 1; i < allFigures.length; i++) {
      vault.appendChild(allFigures[i]);
    }

    container.appendChild(wrap);
    container.appendChild(vault);

    updateHeroChrome(container);

    attachDelegate(container);

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(container);
    }

    if (window.AptImageUtils && typeof window.AptImageUtils.bindGalleryImages === "function") {
      window.AptImageUtils.bindGalleryImages(container);
    }

    window.requestAnimationFrame(function () {
      checkGalleryHasPhotos(container);
      updateHeroChrome(container);
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
