/**
 * Simple apartment cards — edit `APARTMENT_CARDS_DATA` only; the homepage grid updates on reload.
 *
 * - `APARTMENT_CARD_ENTRY_EXAMPLE` is a reusable template (copy or Object.assign).
 * - When `APARTMENT_CARDS_DATA` has at least one entry, the grid uses **only** these rows
 *   (plain text + URLs). Set `APARTMENT_CARDS_DATA = []` to use bilingual
 *   `APARTMENTS_DATA` + `APARTMENTS_BOOKING_EXTRA` instead.
 * - Use `whatsapp`, `booking`, `airbnb`, `details` with `"#"` until you have real links
 *   (those buttons stay disabled or non-navigating where appropriate).
 * - `normalizeApartmentCardEntry` is used by the card script and detail page for the same shape.
 */
(function () {
  "use strict";

  var PLACEHOLDER_IMAGE = "/images/placeholder.svg";

  function normImg(u) {
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function linkUsable(u) {
    if (u == null) return "";
    u = String(u).trim();
    if (u === "" || u === "#") return "";
    return u;
  }

  /**
   * Reusable example — duplicate into `APARTMENT_CARDS_DATA` and change fields.
   */
  window.APARTMENT_CARD_ENTRY_EXAMPLE = {
    id: "apartment-1",
    title: "Apartment Name",
    description: "Short apartment description",
    guests: "Up to 4 guests",
    price: "from 60 AZN / night",
    images: [
      "/images/apartments/example/1.jpg",
      "/images/apartments/example/2.jpg",
      "/images/apartments/example/3.jpg",
    ],
    whatsapp: "#",
    booking: "#",
    airbnb: "#",
    telegram: "https://t.me/apartamentnearbaku",
    details: "#",
    featured: false,
    /** Optional: set false to hide the free airport transfer badge on the card image. */
    freeAirportTransfer: true,
    /** Optional: full WhatsApp message instead of site default (+ optional suffix key). */
    whatsappMessage: "",
    /** Optional: i18n key appended after default `whatsapp_message` (same as legacy listings). */
    whatsappSuffixKey: "",
  };

  /**
   * @param {object} raw Same shape as APARTMENT_CARD_ENTRY_EXAMPLE
   * @returns {object} Normalized row for card + detail render (`_plain: true`)
   */
  window.normalizeApartmentCardEntry = function (raw) {
    if (!raw || typeof raw !== "object") return null;

    var id = String(raw.id || "apartment").trim() || "apartment";
    var images =
      Array.isArray(raw.images) && raw.images.length
        ? raw.images.map(normImg)
        : [normImg(PLACEHOLDER_IMAGE)];

    var wh = raw.whatsapp;
    var whStr = wh == null ? "#" : String(wh).trim();
    if (!whStr) whStr = "#";
    var whatsappIsUrl = /^https?:\/\//i.test(whStr);

    var detailRaw = raw.details;
    var detailHref = "";
    if (detailRaw != null) {
      var ds = String(detailRaw).trim();
      if (ds && ds !== "#") detailHref = ds;
    }

    var tgRaw = raw.telegram == null ? "" : String(raw.telegram).trim();
    var cardTelegramUrl =
      tgRaw && tgRaw !== "#" && /^https?:\/\//i.test(tgRaw) ? tgRaw : "https://t.me/apartamentnearbaku";

    return {
      id: id,
      _plain: true,
      premium: !!raw.featured,
      cardFreeTransfer: raw.freeAirportTransfer !== false,
      plainTitle: String(raw.title || ""),
      plainDesc: String(raw.description || ""),
      plainGuests: String(raw.guests || ""),
      plainPrice: String(raw.price || ""),
      images: images,
      whatsappRaw: whStr,
      whatsappIsUrl: whatsappIsUrl,
      waMessage: raw.whatsappMessage != null ? String(raw.whatsappMessage) : "",
      waSuffixKey: raw.whatsappSuffixKey != null ? String(raw.whatsappSuffixKey) : "",
      cardBookingUrl: linkUsable(raw.booking),
      cardAirbnbUrl: linkUsable(raw.airbnb),
      cardTelegramUrl: cardTelegramUrl,
      detailHref: detailHref,
    };
  };

  /**
   * Your listings. Leave empty to keep the original multilingual apartment grid.
   *
   * Example — one card from the template:
   *   window.APARTMENT_CARDS_DATA = [
   *     Object.assign({}, window.APARTMENT_CARD_ENTRY_EXAMPLE, {
   *       id: "sea-view",
   *       title: "Sea View Apartment",
   *       details: "apartment-detail.html?apt=sea-view",
   *     }),
   *   ];
   */
  window.APARTMENT_CARDS_DATA = [];
})();
