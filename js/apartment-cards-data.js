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
  window.APARTMENT_CARDS_DATA = [
    {
      id: "airport-studio-gyd",
      title: "Airport Studio Near Baku Airport (GYD) – Free Pickup, 5 Min",
      description:
        "Cozy airport studio just 5 minutes from Baku Airport, ideal for transit guests and short stays. Includes free pickup, fast check-in, and a comfortable private space near GYD.",
      guests: "Ideal for 1–2 guests",
      price: "Book on Booking.com or Airbnb",
      images: ["/images/placeholder.svg"],
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.ru.html",
      airbnb: "https://airbnb.ru/h/airporth",
      details: "",
      featured: false,
      freeAirportTransfer: false,
      distanceKey: "",
      heroBadges: ["5 min from airport", "Free Pickup", "Transit Friendly"],
      otaTextButtons: true,
    },
    {
      id: "premium-apartment-gyd",
      title: "Premium Apartment Near Baku Airport (GYD)",
      description:
        "Spacious, quiet and comfortable apartment perfect for rest before or after flight.",
      guests: "Up to 4 guests",
      price: "Contact for rates",
      images: ["/images/placeholder.svg"],
      whatsapp: "#",
      booking: "",
      airbnb: "",
      details: "",
      featured: false,
    },
    {
      id: "family-apartment-gyd",
      title: "Family Apartment Near Baku Airport (GYD) – 2 Bedrooms, Up to 5 Guests",
      description:
        "Spacious 2-bedroom apartment ideal for families and groups of up to 5 people. Fully equipped, comfortable stay just 5 minutes from the airport.",
      guests: "Up to 5 guests",
      price: "Book on Booking.com or Airbnb",
      images: ["/images/placeholder.svg"],
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html",
      airbnb: "https://airbnb.ru/h/binaairport",
      details: "",
      featured: false,
      freeAirportTransfer: true,
      distanceKey: "",
      heroBadges: ["5 min from airport", "Family friendly"],
      otaTextButtons: true,
    },
    {
      id: "layover-studio-gyd",
      title: "Layover Studio Near Baku Airport (GYD)",
      description: "Best choice for transit passengers, fast check-in, close to airport.",
      guests: "Ideal for 1–3 guests",
      price: "Rates on Booking.com",
      images: ["/images/placeholder.svg"],
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html",
      airbnb: "",
      details: "",
      featured: false,
    },
    {
      id: "villa-2br-gyd",
      title: "2 Bedroom Villa Near Baku Airport (GYD)",
      description: "Large villa for families, quiet area, near airport and expo center.",
      guests: "Families and groups",
      price: "See Booking.com or Airbnb",
      images: ["/images/placeholder.svg"],
      whatsapp: "#",
      booking: "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html",
      airbnb: "https://www.airbnb.com.tr/rooms/1240319336186131182",
      details: "",
      featured: true,
    },
  ];
})();
