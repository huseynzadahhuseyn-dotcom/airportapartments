/**
 * Renders `#apartments-grid` on the homepage (booking-style cards: hero photo, lightbox for the rest,
 * icon row: Booking / Airbnb / WhatsApp under the image).
 *
 * Uses `apt.images` only (no mixed gallery pool). If missing/invalid, stable Unsplash demo URLs.
 * `data-no-img-fallback` on hero when using real listing URLs.
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
    avia: 0,
    bina: 4,
    horizon: 8,
    layover: 12,
    "premium-villa-2-bedroom": 0,
    "airport-family-apartment-2-bedroom": 2,
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
      var raw = String(urlList[i]).trim();
      if (!raw) {
        return { payload: [], ok: false };
      }
      var src;
      if (directUrls) {
        src = cardSliderSrc(raw) || normImgUrl(raw) || raw;
      } else {
        src = bookCardImgSrc(raw) || raw;
        if (isPlaceholderImageUrl(src)) {
          return { payload: [], ok: false };
        }
      }
      if (!src) {
        return { payload: [], ok: false };
      }
      payload.push({ src: String(src).trim(), altIndex: i });
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
   * Homepage grid: one slide per `apt.images` entry — never placeholder.svg, never gallery URLs.
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
   * @param {boolean} [opts.bookListingImagesOnly] — only `apt.images` URLs, no gallery pool or placeholder.svg slides
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

  /**
   * Brand-inspired marks (not official trademarks) — booking vs messaging read clearly at small sizes.
   * Booking: dot grid reminiscent of Booking.com; Airbnb: loop/belo shape; WA/TG: chat icons.
   */
  function iconSvgBooking() {
    return svgNs(
      '<svg class="apt-booking-icon-svg apt-booking-icon-svg--booking" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<g fill="currentColor">' +
        '<circle cx="6.5" cy="6.5" r="2.1"/><circle cx="12" cy="6.5" r="2.1"/><circle cx="17.5" cy="6.5" r="2.1"/>' +
        '<circle cx="9.25" cy="12" r="2.1"/><circle cx="14.75" cy="12" r="2.1"/>' +
        '<circle cx="12" cy="17.5" r="2.1"/>' +
        "</g></svg>"
    );
  }

  function iconSvgAirbnb() {
    return svgNs(
      '<svg class="apt-booking-icon-svg apt-booking-icon-svg--airbnb" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="currentColor" d="M12 3.4L10.5 6c-.9 1.55-2.7 4.75-3.45 6.2-.55 1.05-.55 2.25 0 3.35.45.85 1.35 1.4 2.35 1.4.95 0 1.85-.5 2.45-1.35.6.85 1.5 1.35 2.45 1.35 1 0 1.9-.55 2.35-1.4.55-1.1.55-2.3 0-3.35-.75-1.45-2.55-4.65-3.45-6.2L12 3.4zm0 2.35c.75 1.3 2.35 4.1 3.05 5.45.25.5.25 1.05 0 1.55-.15.3-.45.45-.75.45-.35 0-.65-.2-.85-.5l-1.45-2.1-1.45 2.1c-.2.3-.5.5-.85.5-.3 0-.6-.15-.75-.45-.25-.5-.25-1.05 0-1.55.7-1.35 2.3-4.15 3.05-5.45z"/>' +
        "</svg>"
    );
  }

  function iconSvgWhatsApp() {
    return svgNs(
      '<svg class="apt-booking-icon-svg apt-booking-icon-svg--wa" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.96.51 3.83 1.48 5.48L2 22l4.74-1.24a9.86 9.86 0 0 0 5.3 1.53h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 1.8c4.48 0 8.11 3.63 8.11 8.11 0 4.48-3.63 8.11-8.11 8.11-.89 0-1.76-.14-2.58-.41l-.19-.07-2.66.7.71-2.59-.08-.2a8.06 8.06 0 0 1-1.24-4.33c0-4.48 3.63-8.11 8.11-8.11zm4.38 6.15c.24-.01.54.08.7.28.18.22.35.63.35 1.02 0 .2-.04.4-.12.6-.08.22-.62 1.18-.62 1.36s-.19.44-.56.77c-.34.31-.67.53-.77.62-.22.18-.47.27-.72.27-.18 0-.35-.04-.52-.12-.16-.08-.62-.23-1.78-.73-1.5-.65-2.48-1.46-2.86-1.7-.38-.24-.66-.37-.85-.62-.19-.26-.29-.48-.29-.7 0-.22.1-.42.22-.58.14-.18.31-.45.47-.6.16-.16.22-.27.33-.45.11-.18.05-.34-.02-.48-.08-.14-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.6c-.2 0-.52.08-.79.38-.27.31-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.09 3.38 5.28 4.61.74.28 1.31.45 1.76.58.74.21 1.41.18 1.94.11.59-.09 1.82-.74 2.08-1.46.26-.72.26-1.34.18-1.46-.08-.12-.3-.19-.62-.33z"/>' +
        "</svg>"
    );
  }

  function iconSvgTelegram() {
    return svgNs(
      '<svg class="apt-booking-icon-svg apt-booking-icon-svg--tg" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="currentColor" d="M21.924 3.625a1.05 1.05 0 0 0-1.05-.05L3.265 11.35a1.05 1.05 0 0 0 .05 1.97l4.62 1.72 1.78 5.58a1.05 1.05 0 0 0 1.97.08l2.48-4.55 5.32 3.88a1.05 1.05 0 0 0 1.63-.58l2.95-14.7zM17.1 6.35 9.62 13.1l-.22 3.15-1.2-3.75 7.9-6.15z"/>' +
        "</svg>"
    );
  }

  function wrapIconMark(tile, svgNode) {
    var mark = el("span", "apt-booking-icon-mark");
    mark.appendChild(svgNode.cloneNode(true));
    tile.appendChild(mark);
  }

  function appendIconLabel(tile, i18nKey) {
    var lab = el("span", "apt-booking-icon-label");
    lab.setAttribute("data-i18n", i18nKey);
    tile.appendChild(lab);
  }

  function addIconTile(row, tag, cls, iconFactory, attrs, labelKey) {
    var node = el(tag, cls, attrs || {});
    wrapIconMark(node, iconFactory());
    appendIconLabel(node, labelKey);
    row.appendChild(node);
    return node;
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

  function applyWhatsAppChatLinkAttrs(link, apt) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    if (apt._plain) {
      if (apt.whatsappIsUrl) {
        link.setAttribute("href", apt.whatsappRaw);
      } else {
        link.setAttribute("href", "#");
        link.setAttribute("data-wa-prefill", "");
        if (apt.waMessage) link.setAttribute("data-wa-body", apt.waMessage);
        if (apt.waSuffixKey) link.setAttribute("data-wa-suffix-key", apt.waSuffixKey);
      }
    } else {
      link.setAttribute("href", "#");
      link.setAttribute("data-wa-prefill", "");
      link.setAttribute("data-wa-suffix-key", apt.waSuffixKey || "");
    }
  }

  function appendBookPreviewChatRow(body, apt) {
    var row = el("div", "apt-book-preview-cta-row");
    var wa = el("a", "apt-book-preview-btn apt-book-preview-btn--wa");
    applyWhatsAppChatLinkAttrs(wa, apt);
    wa.setAttribute("data-i18n", "book_preview_chat_whatsapp");
    var tgHref = (apt.cardTelegramUrl || "https://t.me/apartamentnearbaku").trim() || "https://t.me/apartamentnearbaku";
    var tg = el("a", "apt-book-preview-btn apt-book-preview-btn--tg", {
      href: tgHref,
    });
    tg.setAttribute("target", "_blank");
    tg.setAttribute("rel", "noopener noreferrer");
    tg.setAttribute("data-i18n", "book_preview_chat_telegram");
    row.appendChild(wa);
    row.appendChild(tg);
    body.appendChild(row);
  }

  function appendPlainOtaTextButtonRow(body, bookingUrl, airbnbUrl) {
    if (!bookingUrl || !airbnbUrl || !body) return;
    var row = el("div", "apt-booking-ota-text-row");
    var b = el("a", "apt-booking-ota-text apt-booking-ota-text--booking", {
      href: bookingUrl,
      text: "🔵 Book on Booking.com",
    });
    b.setAttribute("target", "_blank");
    b.setAttribute("rel", "noopener noreferrer");
    b.setAttribute("aria-label", "Book on Booking.com");
    var ar = el("a", "apt-booking-ota-text apt-booking-ota-text--airbnb", {
      href: airbnbUrl,
      text: "🔴 Book on Airbnb",
    });
    ar.setAttribute("target", "_blank");
    ar.setAttribute("rel", "noopener noreferrer");
    ar.setAttribute("aria-label", "Book on Airbnb");
    row.appendChild(b);
    row.appendChild(ar);
    body.appendChild(row);
  }

  function appendBookingIconRow(media, apt, bookingUrl, airbnbUrl) {
    var row = el("div", "apt-booking-icon-row");
    row.setAttribute("role", "group");
    row.setAttribute("data-i18n-aria-label", "apt_booking_icons_group_a11y");
    row.setAttribute("aria-label", "");

    var otaAsTextRow = apt.otaTextButtons === true && bookingUrl && airbnbUrl;

    if (bookingUrl && !otaAsTextRow) {
      var b = addIconTile(
        row,
        "a",
        "apt-booking-icon-tile apt-booking-icon-tile--booking",
        iconSvgBooking,
        {
          href: bookingUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "apt_label_booking"
      );
      b.setAttribute("data-i18n-title", "apt_icon_booking_title");
      b.setAttribute("data-i18n-aria-label", "apt_icon_booking_title");
    }

    if (airbnbUrl && !otaAsTextRow) {
      var ar = addIconTile(
        row,
        "a",
        "apt-booking-icon-tile apt-booking-icon-tile--airbnb",
        iconSvgAirbnb,
        {
          href: airbnbUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "apt_label_airbnb"
      );
      ar.setAttribute("data-i18n-title", "apt_icon_airbnb_title");
      ar.setAttribute("data-i18n-aria-label", "apt_icon_airbnb_title");
    }

    var wa = el("a", "apt-booking-icon-tile apt-booking-icon-tile--wa");
    wrapIconMark(wa, iconSvgWhatsApp());
    appendIconLabel(wa, "apt_label_whatsapp");
    wa.setAttribute("data-i18n-title", "apt_icon_whatsapp_title");
    wa.setAttribute("data-i18n-aria-label", "apt_icon_whatsapp_title");
    applyWhatsAppChatLinkAttrs(wa, apt);
    row.appendChild(wa);

    var tgHref = (apt.cardTelegramUrl || "https://t.me/apartamentnearbaku").trim() || "https://t.me/apartamentnearbaku";
    var tg = el("a", "apt-booking-icon-tile apt-booking-icon-tile--tg");
    wrapIconMark(tg, iconSvgTelegram());
    appendIconLabel(tg, "apt_label_telegram");
    tg.setAttribute("href", tgHref);
    tg.setAttribute("target", "_blank");
    tg.setAttribute("rel", "noopener noreferrer");
    tg.setAttribute("data-i18n-title", "apt_icon_telegram_title");
    tg.setAttribute("data-i18n-aria-label", "apt_icon_telegram_title");
    row.appendChild(tg);

    media.appendChild(row);
  }

  function buildApartmentCards(grid, data) {
    if (!grid || !data || !data.length) return;
    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    var listingOnlyImages =
      grid.id === "apartments-grid" ||
      grid.id === "book-apartments-grid" ||
      grid.id === "book-apartments-grid-preview";
    var isBookPreviewGrid = grid.id === "book-apartments-grid-preview";
    grid.textContent = "";
    grid.setAttribute("role", "list");

    data.forEach(function (apt) {
      try {
      var slidesPayload = [];
      var usedBookDemo = false;

      if (listingOnlyImages) {
        var listingUrls = slideUrls(apt, pool, { bookListingImagesOnly: true });
        var bookPack = assembleBookSlidesPayload(apt, listingUrls, false);
        if (!bookPack.ok || !bookPack.payload.length) {
          bookPack = assembleBookSlidesPayload(apt, [PLACEHOLDER_IMAGE], true);
          usedBookDemo = false;
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

      var artCls =
        "apt-card apt-card--booking" +
        (apt.premium ? " apt-card--booking-featured" : "") +
        (isBookPreviewGrid ? " apt-card--book-preview" : "");
      var art = el("article", artCls);
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
      if (listingOnlyImages && !usedBookDemo) {
        heroImg.setAttribute("data-no-img-fallback", "true");
      }
      heroBtn.appendChild(heroImg);

      function buildTransferBadge(inStack) {
        var transferBadge = el(
          "span",
          "apt-booking-transfer-badge" + (inStack ? " apt-booking-transfer-badge--in-stack" : "")
        );
        var transferIc = el("span", "apt-booking-transfer-badge__ic", { "aria-hidden": "true" });
        transferIc.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor" focusable="false"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-3.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';
        transferBadge.appendChild(transferIc);
        var transferLbl = el("span", "apt-booking-transfer-badge__text");
        transferLbl.setAttribute("data-i18n", "apt_badge_free_transfer");
        transferBadge.appendChild(transferLbl);
        return transferBadge;
      }

      var hbList = Array.isArray(apt.heroBadges) && apt.heroBadges.length ? apt.heroBadges : [];
      var showTransfer = apt.cardFreeTransfer !== false;
      if (hbList.length) {
        var badgeCol = el("div", "apt-booking-hero-badges-col");
        if (showTransfer) {
          badgeCol.appendChild(buildTransferBadge(true));
        }
        for (var bix = 0; bix < hbList.length; bix++) {
          badgeCol.appendChild(
            el("span", "apt-booking-mini-badge", { text: "\u2705 " + hbList[bix] })
          );
        }
        heroBtn.appendChild(badgeCol);
      } else if (showTransfer) {
        heroBtn.appendChild(buildTransferBadge(false));
      }
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

        if (apt.cardDistanceKey) {
          var distPlain = el("p", "apt-booking-distance-label");
          distPlain.setAttribute("data-i18n", apt.cardDistanceKey);
          body.appendChild(distPlain);
        }

        body.appendChild(el("p", "apt-booking-desc", { text: apt.plainDesc }));

        var guestsRowP = el("div", "apt-booking-guests");
        guestsRowP.appendChild(el("span", "apt-booking-guests-ic", { "aria-hidden": "true", text: "👥" }));
        guestsRowP.appendChild(el("span", "apt-booking-guests-text", { text: apt.plainGuests }));
        body.appendChild(guestsRowP);

        body.appendChild(
          el(
            "div",
            "apt-booking-price apt-booking-price--plain" +
              (isBookPreviewGrid ? " apt-booking-price--promo" : ""),
            { text: apt.plainPrice }
          )
        );

        if (apt.otaTextButtons === true) {
          appendPlainOtaTextButtonRow(body, bookingUrl, airbnbUrl);
        }

        if (isBookPreviewGrid) {
          appendBookPreviewChatRow(body, apt);
        }

        if (apt.detailHref) {
          body.appendChild(
            el("a", "apt-booking-details-btn", {
              href: apt.detailHref,
              "data-i18n": "view_details",
            })
          );
        }
      } else {
        body.appendChild(el("h3", "apt-booking-title", { "data-i18n": apt.titleKey }));

        if (apt.cardDistanceKey) {
          var distLegacy = el("p", "apt-booking-distance-label");
          distLegacy.setAttribute("data-i18n", apt.cardDistanceKey);
          body.appendChild(distLegacy);
        }

        body.appendChild(el("p", "apt-booking-desc", { "data-i18n": apt.blurbKey }));

        var guestsRow = el("div", "apt-booking-guests");
        guestsRow.appendChild(el("span", "apt-booking-guests-ic", { "aria-hidden": "true", text: "👥" }));
        var gSpan = el("span", "apt-booking-guests-text");
        gSpan.setAttribute("data-i18n", apt.guestsKey);
        guestsRow.appendChild(gSpan);
        body.appendChild(guestsRow);

        var priceRow = el("div", "apt-booking-price" + (isBookPreviewGrid ? " apt-booking-price--promo" : ""));
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
            '<span class="apt-booking-price-cur" data-i18n="currency_azn"></span> ' +
            '<span class="apt-booking-price-per" data-i18n="price_per_night"></span>';
        }
        body.appendChild(priceRow);

        if (isBookPreviewGrid) {
          appendBookPreviewChatRow(body, apt);
        }

        body.appendChild(
          el("a", "apt-booking-details-btn", {
            href: "apartment-detail.html?apt=" + encodeURIComponent(apt.id),
            "data-i18n": "view_details",
          })
        );
      }

      art.appendChild(body);
      grid.appendChild(art);
      } catch (err) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[apartment-cards] skipped listing", apt && apt.id, err);
        }
      }
    });

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(grid);
    }

    if (typeof window.applyWhatsAppLinks === "function") {
      window.applyWhatsAppLinks();
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
    if (typeof window.applyWhatsAppLinks === "function") {
      window.applyWhatsAppLinks();
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

    if (aptGrid) {
      if (hasData) {
        buildApartmentCards(aptGrid, data);
      } else {
        renderFallback(aptGrid);
      }
    }
  }

  window.buildApartmentCards = buildApartmentCards;
  window.getApartmentListingRows = getApartmentListingRows;

  window.__i18nDomHydrators = window.__i18nDomHydrators || [];
  window.__i18nDomHydrators.push(tryRender);
})();
