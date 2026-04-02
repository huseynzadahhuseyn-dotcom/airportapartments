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
      bookingUrl: "",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    express: {
      airportDistanceKey: "apt_airport_dist_express",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "",
      bookingUrl: "",
      telegramUrl: DEFAULT_TELEGRAM,
    },
    family: {
      airportDistanceKey: "apt_airport_dist_family",
      priceOnRequest: false,
      coverImage: "",
      airbnbUrl: "",
      bookingUrl: "",
      telegramUrl: DEFAULT_TELEGRAM,
    },
  };

  function pick(cfg, key) {
    if (!cfg || !Object.prototype.hasOwnProperty.call(cfg, key)) return undefined;
    return cfg[key];
  }

  function apply() {
    var rows = window.APARTMENTS_DATA;
    if (!Array.isArray(rows)) return;

    window.APARTMENTS_DATA = rows.map(function (apt) {
      var cfg = APARTMENT_CARD_CONFIG[apt.id] || {};
      var imgs = apt.images && apt.images.length ? apt.images.slice() : [];

      var cover = pick(cfg, "coverImage");
      if (typeof cover === "string" && cover.trim()) {
        cover = cover.trim();
        imgs = [cover].concat(
          imgs.filter(function (u) {
            return u !== cover;
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

  apply();

  window.APARTMENT_CARD_CONFIG = APARTMENT_CARD_CONFIG;
})();
