/**
 * Apartment cards — editable links, cover image, airport line, price mode.
 *
 * Keys must match `id` in js/apartments-data.js: haven | avia | bina | horizon | express | family
 *
 * Rules:
 * - Omit `airbnbUrl` / `bookingUrl` to inherit from apartments-data (ota + bookingLink).
 * - Set `airbnbUrl` or `bookingUrl` to "" to hide that button on the card.
 * - `coverImage`: optional full path e.g. "/images/cozy-01.jpg" — shown first in the slider.
 * - `priceOnRequest`: true → shows "Price on request" instead of from-price.
 * - `airportDistanceKey`: i18n key; add matching strings in locales/en.json (and az, ru).
 */
(function () {
  "use strict";

  var DEFAULT_TELEGRAM = "https://t.me/apartamentnearbaku";

  var APARTMENT_CARD_CONFIG = {
    haven: {
      airportDistanceKey: "apt_airport_dist_haven",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "https://www.airbnb.com/h/airporth",
      bookingUrl: "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.ru.html",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    avia: {
      airportDistanceKey: "apt_airport_dist_avia",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "https://www.airbnb.com/h/aviaapartmentz",
      bookingUrl: "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    bina: {
      airportDistanceKey: "apt_airport_dist_bina",
      priceOnRequest: true,
      coverImage: "",
      airbnbUrl: "https://www.airbnb.com/h/binaairport",
      bookingUrl: "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    horizon: {
      airportDistanceKey: "apt_airport_dist_horizon",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "",
      bookingUrl:
        "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html?label=gen173bo-10CAsoEUInaG91c2UtbmVhci1haXJwb3J0LWFuZC1iYWt1LWV4cG8tY2VudGVySDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALuxLnOBsACAdICJDMyMDY4ZGMyLTUyZTEtNDRjNC1iMzNiLWY3OTY5NTJjMGNmZtgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&group_adults=2&group_children=0&no_rooms=1&sb_price_type=total&type=total&",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    express: {
      airportDistanceKey: "apt_airport_dist_express",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "",
      bookingUrl: "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    family: {
      airportDistanceKey: "apt_airport_dist_family",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "",
      bookingUrl: "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html",
      telegramUrl: DEFAULT_TELEGRAM,
    },
  };

  function pick(cfg, key) {
    if (!cfg || !Object.prototype.hasOwnProperty.call(cfg, key)) return undefined;
    return cfg[key];
  }

  function resolveImg(u) {
    if (typeof window.resolveListingImageUrl === "function") {
      return window.resolveListingImageUrl(u);
    }
    return u;
  }

  function applyApartmentCardConfig(rows) {
    if (!Array.isArray(rows)) return [];

    return rows.map(function (apt) {
      var cfg = APARTMENT_CARD_CONFIG[apt.id] || {};
      var imgs = apt.images && apt.images.length ? apt.images.slice() : [];

      var cover = pick(cfg, "coverImage");
      if (typeof cover === "string" && cover.trim()) {
        cover = cover.trim();
        var coverR = resolveImg(cover);
        imgs = [coverR].concat(
          imgs.filter(function (u) {
            return u !== coverR;
          })
        );
      }

      var airbnbV = pick(cfg, "airbnbUrl");
      var cardAirbnbUrl =
        airbnbV !== undefined ? String(airbnbV).trim() : ((apt.ota && apt.ota.airbnb) || "").trim();

      var bookV = pick(cfg, "bookingUrl");
      var cardBookingUrl =
        bookV !== undefined
          ? String(bookV).trim()
          : (apt.bookingLink || (apt.ota && apt.ota.booking) || "").trim();

      var tgV = pick(cfg, "telegramUrl");
      var cardTelegramUrl =
        tgV !== undefined && String(tgV).trim() ? String(tgV).trim() : DEFAULT_TELEGRAM;

      var cardDistanceKey = pick(cfg, "airportDistanceKey") || "apt_airport_dist_generic";
      var cardPriceOnRequest = pick(cfg, "priceOnRequest") === true;

      return Object.assign({}, apt, {
        images: imgs,
        cardAirbnbUrl: cardAirbnbUrl,
        cardBookingUrl: cardBookingUrl,
        cardTelegramUrl: cardTelegramUrl,
        cardDistanceKey: cardDistanceKey,
        cardPriceOnRequest: cardPriceOnRequest,
      });
    });
  }

  window.APARTMENTS_DATA = applyApartmentCardConfig(window.APARTMENTS_DATA || []);
  window.APARTMENTS_BOOKING_EXTRA = applyApartmentCardConfig(window.APARTMENTS_BOOKING_EXTRA || []);

  window.applyApartmentCardConfig = applyApartmentCardConfig;

  window.APARTMENT_CARD_CONFIG = APARTMENT_CARD_CONFIG;
})();
