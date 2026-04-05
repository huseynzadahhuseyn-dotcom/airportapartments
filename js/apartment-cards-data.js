/**
 * Simple apartment cards — edit `APARTMENT_CARDS_DATA` only; the homepage grid updates on reload.
 *
 * - `APARTMENT_CARD_ENTRY_EXAMPLE` is a reusable template (copy or Object.assign).
 * - When `APARTMENT_CARDS_DATA` has at least one entry, the grid uses **only** these rows
 *   (plain text + URLs). Set `APARTMENT_CARDS_DATA = []` to use bilingual
 *   `APARTMENTS_DATA` + `APARTMENTS_BOOKING_EXTRA` instead.
 * - Use `whatsapp`, `booking`, `airbnb`, `details` with `"#"` or `""` until you have real links
 *   (missing Booking/Airbnb URLs omit those buttons; `details: ""` hides View details).
 * - Optional `distanceKey`: i18n key for the airport line (default `hero_badge_airport`); `""` hides it.
 *   On the homepage grid, distance is replaced by the standard top lines + hero badges (see apartment-cards.js).
 * - Optional `imagesFromApartmentId`: legacy `id` from `js/apartments-data.js` (`avia`, `bina`, `layover`,
 *   `premium-villa-2-bedroom`, `airport-family-apartment-2-bedroom`, …) — reuses that listing’s resolved
 *   `images` (postimg / local URLs). Omit `images` or leave empty when using this. Loads after `apartments-data.js`.
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
  function imagesFromLegacyListing(legacyId) {
    var lid = legacyId == null ? "" : String(legacyId).trim();
    if (!lid || !Array.isArray(window.APARTMENTS_DATA)) return null;
    for (var i = 0; i < window.APARTMENTS_DATA.length; i++) {
      var row = window.APARTMENTS_DATA[i];
      if (!row || row.id !== lid) continue;
      if (!Array.isArray(row.images) || !row.images.length) return null;
      var out = [];
      for (var j = 0; j < row.images.length; j++) {
        if (row.images[j] == null) continue;
        out.push(normImg(String(row.images[j]).trim()));
      }
      return out.length ? out : null;
    }
    return null;
  }

  window.normalizeApartmentCardEntry = function (raw) {
    if (!raw || typeof raw !== "object") return null;

    var id = String(raw.id || "apartment").trim() || "apartment";

    var legacySrc =
      raw.imagesFromApartmentId != null ? String(raw.imagesFromApartmentId).trim() : "";
    var images = legacySrc ? imagesFromLegacyListing(legacySrc) : null;
    if (!images || !images.length) {
      images =
        Array.isArray(raw.images) && raw.images.length
          ? raw.images.map(normImg)
          : [normImg(PLACEHOLDER_IMAGE)];
    }

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

    var dkRaw = raw.distanceKey;
    var cardDistanceKey;
    if (dkRaw !== undefined && dkRaw !== null) {
      cardDistanceKey = String(dkRaw).trim();
    } else {
      cardDistanceKey = "hero_badge_airport";
    }

    var heroBadges = [];
    if (Array.isArray(raw.heroBadges) && raw.heroBadges.length) {
      for (var hb = 0; hb < raw.heroBadges.length; hb++) {
        var t = raw.heroBadges[hb];
        if (t == null) continue;
        var ts = String(t).trim();
        if (ts) heroBadges.push(ts);
      }
    }

    return {
      id: id,
      _plain: true,
      premium: !!raw.featured,
      cardFreeTransfer: raw.freeAirportTransfer !== false,
      cardDistanceKey: cardDistanceKey,
      heroBadges: heroBadges,
      otaTextButtons: raw.otaTextButtons === true,
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
   * Homepage “Book your stay” order (strict):
   * 1 Studio → 2 Layover → 3 Premium → 4 Family → 5 Modern → 6 Villa
   *
   * `otaTextButtons: true` matches the Airport Studio card (text Booking/Airbnb + WhatsApp/Telegram icons).
   * Standard top lines + hero badges are injected in js/apartment-cards.js for this grid.
   */
  window.APARTMENT_CARDS_DATA = [
    {
      id: "airport-studio-gyd",
      imagesFromApartmentId: "avia",
      title: "Airport Studio Near Baku Airport (GYD)",
      description:
        "Cozy studio apartment just 5 minutes from Baku Airport (GYD), ideal for transit stays and short visits. Free airport pickup, fast check-in, and fully equipped for a comfortable stay near the airport. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 3 guests",
      price: "Book on Booking.com or Airbnb",
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.ru.html",
      airbnb: "https://www.airbnb.com/h/aviaapartmentz",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_avia",
    },
    {
      id: "layover-studio-gyd",
      imagesFromApartmentId: "layover",
      title: "Layover Near Baku Airport (GYD)",
      description:
        "Designed for layovers and short stays near Baku Airport (GYD), offering quick check-in, restful comfort, and easy access to the terminal. Ideal for transit passengers. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 3 guests",
      price: "Book on Booking.com",
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html",
      airbnb: "",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_layover",
    },
    {
      id: "premium-apartment-gyd",
      imagesFromApartmentId: "bina",
      title: "Premium Apartment Near Baku Airport (GYD)",
      description:
        "Spacious 2-bedroom premium apartment 5 minutes from Baku Airport (GYD), perfect for families or groups up to 6 guests. Quiet, modern, and fully equipped. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 6 guests",
      price: "Book on Booking.com or Airbnb",
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html",
      airbnb: "https://www.airbnb.com/h/binaairport",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_bina",
    },
    {
      id: "family-apartment-gyd",
      imagesFromApartmentId: "airport-family-apartment-2-bedroom",
      title: "Family Apartment Near Baku Airport (GYD)",
      description:
        "Family-friendly 2-bedroom apartment near Baku Airport (GYD), ideal for groups up to 6 guests. Comfortable, spacious, and fully equipped for a relaxing stay. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 6 guests",
      price: "Book on Booking.com or Airbnb",
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html",
      airbnb: "https://www.airbnb.com/h/binaairport",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_airport_family_2br",
    },
    {
      id: "horizon-apartment-gyd",
      imagesFromApartmentId: "horizon",
      title: "Modern Apartment Near Baku Airport (GYD)",
      description:
        "Modern and comfortable apartment near Baku Airport (GYD), located in a quiet area with easy access to the airport. Ideal for short and long stays. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 3 guests",
      price: "Book on Booking.com",
      whatsapp: "#",
      booking:
        "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html?label=gen173bo-10CAsoEUInaG91c2UtbmVhci1haXJwb3J0LWFuZC1iYWt1LWV4cG8tY2VudGVySDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALuxLnOBsACAdICJDMyMDY4ZGMyLTUyZTEtNDRjNC1iMzNiLWY3OTY5NTJjMGNmZtgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&group_adults=2&group_children=0&no_rooms=1&sb_price_type=total&type=total&",
      airbnb: "",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_horizon",
    },
    {
      id: "villa-2br-gyd",
      imagesFromApartmentId: "premium-villa-2-bedroom",
      title: "2 Bedroom Villa Near Baku Airport (GYD)",
      description:
        "Spacious 2-bedroom villa near Baku Airport (GYD), perfect for families and groups up to 6 guests. Quiet location with large living space. Free airport transfer, breakfast included, and 24/7 check-in available.",
      guests: "Up to 6 guests",
      price: "Book on Booking.com or Airbnb",
      whatsapp: "#",
      booking:
        "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html?label=gen173bo-10CAsoEUInaG91c2UtbmVhci1haXJwb3J0LWFuZC1iYWt1LWV4cG8tY2VudGVySDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALuxLnOBsACAdICJDMyMDY4ZGMyLTUyZTEtNDRjNC1iMzNiLWY3OTY5NTJjMGNmZtgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&group_adults=2&group_children=0&no_rooms=1&sb_price_type=total&type=total&",
      airbnb: "https://www.airbnb.com.tr/rooms/1240319336186131182",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      otaTextButtons: true,
      whatsappSuffixKey: "wa_suffix_premium_villa_2bed",
    },
  ];
})();
