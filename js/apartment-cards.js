/**
 * Renders #apartments-grid and #book-apartments-grid — booking-style cards (one hero photo, lightbox for the rest,
 * icon row: Booking / Airbnb / WhatsApp under the image).
 *
 * #book-apartments-grid: prefers `apt.images` (gallery URLs). If missing/invalid, uses stable Unsplash demo
 * URLs so the section is never blank. `data-no-img-fallback` only when using real listing URLs.
 *
 * Data source (first match wins):
 * 1. `APARTMENT_CARDS_DATA` + `normalizeApartmentCardEntry` (see apartment-cards-data.js) when that array is non-empty
 * 2. Otherwise `APARTMENTS_DATA` + `APARTMENTS_BOOKING_EXTRA`
 */
(function () {
  "use strict";

  var PLACEHOLDER_IMAGE = "/images/placeholder.svg";

  /** Remote demo interiors (Unsplash) — temporary until real photos are wired; each listing gets a distinct slice. */
  var BOOK_DEMO_QS = "?auto=format&fit=crop&w=1600&q=82";
  var BOOK_STAY_DEMO_URLS = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1484154218962-a197022b5858" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1554995207-c18c203602cb" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1560185893-a8d9366a4890" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1600566753190-9aa6c8c8218c" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1600573472550-8090bdc5bab9" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1512918728675-ac5fa6b613d1" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea" + BOOK_DEMO_QS,
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" + BOOK_DEMO_QS,
  ];

  /** Stable starting index per known listing so cards don’t all look identical. */
  var BOOK_DEMO_START_BY_ID = {
    haven: 0,
    avia: 2,
    bina: 4,
    horizon: 6,
    express: 8,
    family: 10,
  };

  var BOOK_DEMO_SLIDE_COUNT = 4;

  function getBookStayDemoUrls(apt) {
    var pool = BOOK_STAY_DEMO_URLS;
    if (!pool.length) return [];
    var id = String((apt && apt.id) || "");
    var start = Object.prototype.hasOwnProperty.call(BOOK_DEMO_START_BY_ID, id)
      ? BOOK_DEMO_START_BY_ID[id]
      : 0;
    if (!Object.prototype.hasOwnProperty.call(BOOK_DEMO_START_BY_ID, id)) {
      var h = 0;
      for (var c = 0; c < id.length; c++) {
        h = (h * 31 + id.charCodeAt(c)) >>> 0;
      }
      start = h % pool.length;
    }
    var out = [];
    for (var j = 0; j < BOOK_DEMO_SLIDE_COUNT; j++) {
      out.push(pool[(start + j) % pool.length]);
    }
    return out;
  }

  /**
   * @param {boolean} directUrls — true = urlList is already https demo URLs (use as-is)
   */
  function assembleBookSlidesPayload(apt, urlList, directUrls) {
    var payload = [];
    if (!urlList || !urlList.length) {
      return { payload: payload, ok: false };
    }
    for (var i = 0; i < urlList.length; i++) {
      var src = directUrls
        ? String(urlList[i]).trim()
        : bookCardImgSrc(urlList[i]) || String(urlList[i]).trim();
      if (!src || isPlaceholderImageUrl(src)) {
        return { payload: [], ok: false };
      }
      payload.push({ src: src, altIndex: i });
    }
    return { payload: payload, ok: true };
  }

  function normImgUrl(u) {
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function isPlaceholderImageUrl(u) {
    if (u == null || typeof u !== "string") return true;
    var s = u.trim().toLowerCase();
    return s === "" || s.indexOf("placeholder.svg") !== -1;
  }

  /** Same pipeline as listing data: resolve /images/… (remote/local) then normalize path. */
  function cardSliderSrc(url) {
    var u = url;
    if (typeof window.resolveListingImageUrl === "function") {
      var r = window.resolveListingImageUrl(u);
      if (r != null && String(r).trim() !== "") u = r;
    }
    var out = normImgUrl(u);
    return out == null ? "" : String(out);
  }

  /**
   * #book-apartments-grid: one slide per `apt.images` entry — never placeholder.svg, never gallery URLs.
   * Uses resolve + normalize; falls back to the raw listing string so slide count always matches the array.
   */
  function bookCardImgSrc(raw) {
    var s = String(raw).trim();
    if (!s || isPlaceholderImageUrl(s)) return "";
    var primary = cardSliderSrc(s);
    if (primary && !isPlaceholderImageUrl(primary)) return primary;
    var fb = normImgUrl(s);
    var fbs = fb == null ? "" : String(fb).trim();
    if (fbs && !isPlaceholderImageUrl(fbs)) return fbs;
    return s;
  }

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

  /**
   * @param {object} opts
   * @param {boolean} [opts.bookListingImagesOnly] — #book-apartments-grid: only `apt.images` URLs, no gallery pool or placeholder.svg slides
   */
  function slideUrls(apt, pool, opts) {
    opts = opts || {};
    var bookOnly = opts.bookListingImagesOnly === true;
    var out = [];

    if (apt.images && Array.isArray(apt.images) && apt.images.length) {
      for (var i = 0; i < apt.images.length; i++) {
        var item = apt.images[i];
        if (item == null) continue;
        var s = String(item).trim();
        if (!s) continue;
        if (bookOnly && isPlaceholderImageUrl(s)) continue;
        out.push(s);
      }
    }

    if (!out.length && !bookOnly) {
      var len = pool.length;
      if (len) {
        var count = apt.imgCount || 4;
        var start = apt.imgStart || 0;
        for (var j = 0; j < count; j++) {
          out.push(pool[(start + j) % len]);
        }
      }
    }
    if (!out.length && !bookOnly) {
      out.push(PLACEHOLDER_IMAGE);
    }
    return out;
  }

  function imgAltFor(apt, si) {
    if (apt._plain) {
      return apt.plainTitle ? apt.plainTitle + " — " + (si + 1) : t("apt_slide_alt_generic_1");
    }
    return t(altKeyFor(apt, si));
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

  function svgNs(html) {
    var wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstChild;
  }

  function iconSvgBooking() {
    return svgNs(
      '<svg class="apt-booking-icon-svg" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V10h14v9zM5 8V5h14v3H5z"/></svg>'
    );
  }

  function iconSvgAirbnb() {
    return svgNs(
      '<svg class="apt-booking-icon-svg" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 20v-6h4v6h5v-12h3L12 3 2 8h3v12h5z"/></svg>'
    );
  }

  function iconSvgWhatsApp() {
    return svgNs(
      '<svg class="apt-booking-icon-svg" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2C6.5 2 2 5.58 2 9.5c0 2.05 1.05 3.9 2.7 5.2L3 22l7.6-2.4c.8.2 1.6.4 2.4.4 5.5 0 10-3.58 10-7.5S17.5 2 12 2zm0 13.5c-.5 0-1-.1-1.5-.2l-.3-.1-3.1 1 1.1-2.9-.2-.3c-.7-1.1-1-2.4-1-3.7 0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6-2.9 6-6.5 6z"/></svg>'
    );
  }

  function openApartmentLightbox(apt, slidesPayload) {
    if (!slidesPayload || !slidesPayload.length) return;
    var elements = slidesPayload.map(function (cell) {
      return { href: cell.src, type: "image", alt: imgAltFor(apt, cell.altIndex) };
    });
    if (typeof window.openComfortImageLightbox === "function") {
      window.openComfortImageLightbox(elements, 0);
    }
  }

  function appendBookingIconRow(media, apt, bookingUrl, airbnbUrl) {
    var row = el("div", "apt-booking-icon-row");
    row.setAttribute("role", "group");
    row.setAttribute("data-i18n-aria-label", "apt_booking_icons_group_a11y");
    row.setAttribute("aria-label", "");

    function addTile(tag, cls, innerNode, attrs) {
      var node = el(tag, cls, attrs || {});
      node.appendChild(innerNode.cloneNode(true));
      row.appendChild(node);
      return node;
    }

    if (bookingUrl) {
      var b = addTile("a", "apt-booking-icon-tile apt-booking-icon-tile--booking", iconSvgBooking(), {
        href: bookingUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      });
      b.setAttribute("data-i18n-title", "apt_icon_booking_title");
      b.setAttribute("data-i18n-aria-label", "apt_icon_booking_title");
    } else {
      var bs = addTile("span", "apt-booking-icon-tile apt-booking-icon-tile--booking apt-booking-icon-tile--disabled", iconSvgBooking());
      bs.setAttribute("data-i18n-title", "apt_icon_unavailable");
      bs.setAttribute("data-i18n-aria-label", "apt_cta_unavailable");
    }

    if (airbnbUrl) {
      var a = addTile("a", "apt-booking-icon-tile apt-booking-icon-tile--airbnb", iconSvgAirbnb(), {
        href: airbnbUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      });
      a.setAttribute("data-i18n-title", "apt_icon_airbnb_title");
      a.setAttribute("data-i18n-aria-label", "apt_icon_airbnb_title");
    } else {
      var as = addTile("span", "apt-booking-icon-tile apt-booking-icon-tile--airbnb apt-booking-icon-tile--disabled", iconSvgAirbnb());
      as.setAttribute("data-i18n-title", "apt_icon_unavailable");
      as.setAttribute("data-i18n-aria-label", "apt_cta_unavailable");
    }

    var wa = el("a", "apt-booking-icon-tile apt-booking-icon-tile--wa");
    wa.appendChild(iconSvgWhatsApp());
    wa.setAttribute("target", "_blank");
    wa.setAttribute("rel", "noopener noreferrer");
    wa.setAttribute("data-i18n-title", "apt_icon_whatsapp_title");
    wa.setAttribute("data-i18n-aria-label", "apt_icon_whatsapp_title");
    if (apt._plain) {
      if (apt.whatsappIsUrl) {
        wa.setAttribute("href", apt.whatsappRaw);
      } else {
        wa.setAttribute("href", "#");
        wa.setAttribute("data-wa-prefill", "");
        if (apt.waMessage) wa.setAttribute("data-wa-body", apt.waMessage);
        if (apt.waSuffixKey) wa.setAttribute("data-wa-suffix-key", apt.waSuffixKey);
      }
    } else {
      wa.setAttribute("href", "#");
      wa.setAttribute("data-wa-prefill", "");
      wa.setAttribute("data-wa-suffix-key", apt.waSuffixKey || "");
    }
    row.appendChild(wa);

    media.appendChild(row);
  }

  function buildApartmentCards(grid, data) {
    if (!grid || !data || !data.length) return;
    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    var bookGrid = grid.id === "book-apartments-grid";
    grid.textContent = "";
    grid.setAttribute("role", "list");

    data.forEach(function (apt) {
      var slidesPayload = [];
      var usedBookDemo = false;

      if (bookGrid) {
        var listingUrls = slideUrls(apt, pool, { bookListingImagesOnly: true });
        var bookPack = assembleBookSlidesPayload(apt, listingUrls, false);
        if (!bookPack.ok || !bookPack.payload.length) {
          bookPack = assembleBookSlidesPayload(apt, getBookStayDemoUrls(apt), true);
          usedBookDemo = true;
        }
        if (!bookPack.payload.length) {
          bookPack = assembleBookSlidesPayload(apt, [BOOK_STAY_DEMO_URLS[0]], true);
          usedBookDemo = true;
        }
        slidesPayload = bookPack.payload;
      } else {
        var urls = slideUrls(apt, pool, { bookListingImagesOnly: false });
        if (!urls.length) return;
        for (var ui = 0; ui < urls.length; ui++) {
          var resolvedSrc = cardSliderSrc(urls[ui]);
          if (resolvedSrc) {
            slidesPayload.push({ src: resolvedSrc, altIndex: ui });
          }
        }
        if (!slidesPayload.length) return;
      }

      if (!slidesPayload.length) return;

      var bookingUrl = (apt.cardBookingUrl || "").trim();
      var airbnbUrl = (apt.cardAirbnbUrl || "").trim();

      var art = el(
        "article",
        "apt-card apt-card--booking" + (apt.premium ? " apt-card--booking-featured" : "")
      );
      art.setAttribute("role", "listitem");
      art.setAttribute("data-apt-id", apt.id);

      if (apt.premium) {
        var badge = el("span", "apt-card-badge apt-card-badge--gold apt-booking-badge", {});
        badge.setAttribute("data-i18n", "apt_badge_featured");
        art.appendChild(badge);
      }

      var media = el("div", "apt-booking-media");

      var heroBtn = el("button", "apt-booking-hero-open", { type: "button" });
      heroBtn.setAttribute("data-i18n-aria-label", "apt_hero_open_gallery_a11y");
      var hero0 = slidesPayload[0];
      var heroImg = el("img", "apt-booking-hero-img", {
        src: hero0.src,
        alt: imgAltFor(apt, hero0.altIndex),
        loading: "eager",
        decoding: "async",
      });
      heroImg.setAttribute("fetchpriority", "high");
      if (bookGrid && !usedBookDemo) {
        heroImg.setAttribute("data-no-img-fallback", "true");
      }
      heroBtn.appendChild(heroImg);
      if (slidesPayload.length > 1) {
        heroBtn.appendChild(
          el("span", "apt-booking-hero-count", { text: String(slidesPayload.length) })
        );
        var hint = el("span", "apt-booking-hero-hint");
        hint.setAttribute("data-i18n", "apt_hero_more_photos");
        heroBtn.appendChild(hint);
      }
      heroBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        openApartmentLightbox(apt, slidesPayload);
      });

      media.appendChild(heroBtn);
      appendBookingIconRow(media, apt, bookingUrl, airbnbUrl);
      art.appendChild(media);

      var body = el("div", "apt-booking-body");

      if (apt._plain) {
        body.appendChild(el("h3", "apt-booking-title", { text: apt.plainTitle }));

        body.appendChild(el("p", "apt-booking-desc", { text: apt.plainDesc }));

        var guestsRowP = el("div", "apt-booking-guests");
        guestsRowP.appendChild(el("span", "apt-booking-guests-ic", { "aria-hidden": "true", text: "👥" }));
        guestsRowP.appendChild(el("span", "apt-booking-guests-text", { text: apt.plainGuests }));
        body.appendChild(guestsRowP);

        body.appendChild(el("div", "apt-booking-price apt-booking-price--plain", { text: apt.plainPrice }));

        if (apt.detailHref) {
          body.appendChild(
            el("a", "apt-booking-details-btn", {
              href: apt.detailHref,
              "data-i18n": "view_details",
            })
          );
        } else {
          body.appendChild(
            el("span", "apt-booking-details-btn apt-booking-details-btn--disabled", {
              "data-i18n": "view_details",
              "aria-disabled": "true",
            })
          );
        }
      } else {
        body.appendChild(el("h3", "apt-booking-title", { "data-i18n": apt.titleKey }));

        body.appendChild(el("p", "apt-booking-desc", { "data-i18n": apt.blurbKey }));

        var guestsRow = el("div", "apt-booking-guests");
        guestsRow.appendChild(el("span", "apt-booking-guests-ic", { "aria-hidden": "true", text: "👥" }));
        var gSpan = el("span", "apt-booking-guests-text");
        gSpan.setAttribute("data-i18n", apt.guestsKey);
        guestsRow.appendChild(gSpan);
        body.appendChild(guestsRow);

        var priceRow = el("div", "apt-booking-price");
        if (apt.cardPriceOnRequest) {
          var pr = el("span", "apt-booking-price-text");
          pr.setAttribute("data-i18n", "price_on_request");
          priceRow.appendChild(pr);
        } else {
          priceRow.innerHTML =
            '<span class="apt-booking-price-from" data-i18n="price_from"></span> ' +
            '<strong class="apt-booking-price-num">' +
            apt.priceFrom +
            "</strong> " +
            '<span class="apt-booking-price-cur" data-i18n="currency_azn"></span>' +
            '<span class="apt-booking-price-per" data-i18n="price_per_night"></span>';
        }
        body.appendChild(priceRow);

        body.appendChild(
          el("a", "apt-booking-details-btn", {
            href: "apartment-detail.html?apt=" + encodeURIComponent(apt.id),
            "data-i18n": "view_details",
          })
        );
      }

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

  function getApartmentListingRows() {
    var simple = window.APARTMENT_CARDS_DATA;
    if (Array.isArray(simple) && simple.length && typeof window.normalizeApartmentCardEntry === "function") {
      return simple.map(window.normalizeApartmentCardEntry).filter(Boolean);
    }
    return []
      .concat(Array.isArray(window.APARTMENTS_DATA) ? window.APARTMENTS_DATA : [])
      .concat(Array.isArray(window.APARTMENTS_BOOKING_EXTRA) ? window.APARTMENTS_BOOKING_EXTRA : []);
  }

  function tryRender() {
    var data = getApartmentListingRows();
    var hasData = data.length > 0;
    var aptGrid = document.getElementById("apartments-grid");
    var bookGrid = document.getElementById("book-apartments-grid");

    if (aptGrid) {
      if (hasData) {
        buildApartmentCards(aptGrid, data);
      } else {
        renderFallback(aptGrid);
      }
    }

    if (bookGrid) {
      if (hasData) {
        buildApartmentCards(bookGrid, data);
      } else {
        bookGrid.textContent = "";
      }
    }
  }

  window.buildApartmentCards = buildApartmentCards;
  window.getApartmentListingRows = getApartmentListingRows;

  window.__i18nDomHydrators = window.__i18nDomHydrators || [];
  window.__i18nDomHydrators.push(tryRender);
})();
