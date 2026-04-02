/**
 * Renders #apartments-grid from window.APARTMENTS_DATA + SITE_GALLERY_IMAGES (`/images/*` paths).
 */
(function () {
  "use strict";

  function t(key) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key) || "";
    }
    return key;
  }

  function altKeyFor(apt, slideIndex) {
    if (typeof window.getApartmentSlideAltKey === "function") {
      return window.getApartmentSlideAltKey(apt, slideIndex);
    }
    return "apt_slide_alt_generic_1";
  }

  function slideUrls(apt, pool) {
    if (apt.images && Array.isArray(apt.images) && apt.images.length) {
      return apt.images.slice();
    }
    var out = [];
    var len = pool.length;
    if (!len) return out;
    var count = apt.imgCount || 4;
    var start = apt.imgStart || 0;
    for (var s = 0; s < count; s++) {
      out.push(pool[(start + s) % len]);
    }
    return out;
  }

  function el(tag, cls, attrs) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function buildApartmentCards(grid, data) {
    if (!grid || !data || !data.length) return;
    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    grid.textContent = "";
    grid.setAttribute("role", "list");

    data.forEach(function (apt) {
      var urls = slideUrls(apt, pool);
      if (!urls.length) return;

      var art = el("article", "apt-card" + (apt.premium ? " apt-card--premium" : ""));
      art.setAttribute("role", "listitem");
      art.setAttribute("data-apt-id", apt.id);

      if (apt.featured) {
        var badge = el("span", "apt-card-badge");
        badge.setAttribute("data-i18n", "apt_badge_featured");
        art.appendChild(badge);
      }

      var sliderRoot = el("div", "apt-card-slider");
      sliderRoot.setAttribute("data-apt-slider", "");
      sliderRoot.setAttribute("tabindex", "0");

      var viewport = el("div", "apt-slider-viewport");
      var track = el("div", "apt-slider-track");

      urls.forEach(function (url, si) {
        var slide = el("div", "apt-slider-slide");
        var img = el("img", "apt-slider-img", {
          src: url,
          alt: t(altKeyFor(apt, si)),
          loading: si === 0 ? "eager" : "lazy",
          decoding: "async",
        });
        if (si === 0) img.setAttribute("fetchpriority", "high");
        slide.appendChild(img);
        track.appendChild(slide);
      });

      viewport.appendChild(track);
      sliderRoot.appendChild(viewport);

      var prevBtn = el("button", "apt-slider-nav apt-slider-prev", {
        type: "button",
        "data-i18n-aria-label": "slider_prev",
      });
      var nextBtn = el("button", "apt-slider-nav apt-slider-next", {
        type: "button",
        "data-i18n-aria-label": "slider_next",
      });
      sliderRoot.appendChild(prevBtn);
      sliderRoot.appendChild(nextBtn);

      var dotsWrap = el("div", "apt-slider-dots");
      urls.forEach(function (_, di) {
        var dot = el("button", "apt-slider-dot" + (di === 0 ? " is-active" : ""), {
          type: "button",
        });
        if (window.I18N && typeof window.I18N.t === "function") {
          dot.setAttribute(
            "aria-label",
            window.I18N.t("tour_slider_goto", { n: di + 1, total: urls.length })
          );
        }
        dotsWrap.appendChild(dot);
      });
      sliderRoot.appendChild(dotsWrap);

      art.appendChild(sliderRoot);

      var body = el("div", "apt-card-body");

      var guests = el("p", "apt-card-guests");
      guests.appendChild(el("span", "apt-guest-pill", { text: "👥" }));
      var gspan = el("span", "", { "data-i18n": apt.guestsKey });
      guests.appendChild(gspan);
      body.appendChild(guests);

      body.appendChild(el("h3", "", { "data-i18n": apt.titleKey }));

      body.appendChild(el("p", "apt-card-blurb", { "data-i18n": apt.blurbKey }));

      var price = el("p", "apt-card-price");
      price.innerHTML =
        '<span class="apt-price-cur">' +
        t("price_from") +
        '</span> <span class="apt-price-num">' +
        apt.priceFrom +
        '</span> <span class="apt-price-cur">' +
        t("currency_azn") +
        '</span> <span class="apt-price-per">' +
        t("price_per_night") +
        "</span>";
      body.appendChild(price);

      var chatRow = el("div", "apt-card-chat-row");
      var wa = el("a", "btn btn-primary apt-card-book--full", {
        href: "#",
        target: "_blank",
        rel: "noopener noreferrer",
        "data-wa-prefill": "",
        "data-wa-suffix-key": apt.waSuffixKey,
        "data-i18n": "book_whatsapp_short",
      });
      var tg = el("a", "btn btn-telegram btn-telegram-card", {
        href: "https://t.me/apartamentnearbaku",
        target: "_blank",
        rel: "noopener noreferrer",
        "data-i18n": "nav_telegram",
      });
      chatRow.appendChild(wa);
      chatRow.appendChild(tg);
      body.appendChild(chatRow);

      if (apt.ota && apt.ota.booking && apt.ota.airbnb) {
        var ota = el("div", "apt-card-actions--ota");
        if (apt.otaAriaKey) ota.setAttribute("data-i18n-aria-label", apt.otaAriaKey);
        var bk = el("a", "btn btn-ota btn-booking", {
          href: apt.ota.booking,
          target: "_blank",
          rel: "noopener noreferrer",
          "data-i18n": "brand_booking",
        });
        var ab = el("a", "btn btn-ota btn-airbnb-ota", {
          href: apt.ota.airbnb,
          target: "_blank",
          rel: "noopener noreferrer",
          "data-i18n": "brand_airbnb",
        });
        ota.appendChild(bk);
        ota.appendChild(ab);
        body.appendChild(ota);
      }

      var det = el("a", "apt-card-details-link", {
        href: "apartment-detail.html?apt=" + encodeURIComponent(apt.id),
        "data-i18n": "view_details",
      });
      body.appendChild(det);

      art.appendChild(body);
      grid.appendChild(art);
    });

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(grid);
    }

    if (typeof window.initApartmentSliders === "function") {
      window.initApartmentSliders();
    }
  }

  function renderFallback(grid) {
    if (grid.children.length) return;
    var p = document.createElement("p");
    p.className = "apartments-fallback";
    p.style.cssText = "text-align:center;margin:1rem 0;";
    var a = document.createElement("a");
    a.href = "index.html#apartments";
    a.className = "btn btn-lg btn-primary";
    a.setAttribute("data-i18n", "book_cta_browse_apartments");
    p.appendChild(a);
    grid.appendChild(p);
    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(grid);
    }
  }

  function tryRender() {
    var grid = document.getElementById("apartments-grid");
    if (!grid) return;
    var data = window.APARTMENTS_DATA;
    if (data && Array.isArray(data) && data.length) {
      buildApartmentCards(grid, data);
      return;
    }
    renderFallback(grid);
  }

  window.buildApartmentCards = buildApartmentCards;

  window.addEventListener("i18n:applied", tryRender);
})();
