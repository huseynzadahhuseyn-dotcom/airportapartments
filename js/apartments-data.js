/**
 * Gallery + apartment sliders: same image pipeline as Cozy (`js/cozy-studio-images.js`).
 *
 * Per-listing URL arrays (load before this file, after `apartment-image-sources.js`):
 *   `COZY_AIRPORT_STUDIO_IMAGE_URLS`, `AIRPORT_HAVEN_IMAGE_URLS`, `HORIZON_APARTMENT_IMAGE_URLS`,
 *   `FAMILY_RESIDENCE_IMAGE_URLS`, `PREMIUM_RESIDENCE_IMAGE_URLS`, `BINA_RESIDENCE_IMAGE_URLS` (listing `bina` = premium then bina).
 * If a global array is missing or empty, legacy `/images/<listing>-NN.*` paths are used.
 *
 * `apartment-image-sources.js` maps `/images/…` when `SITE_APARTMENT_IMAGE_STRATEGY` is `"remote"`. Use `"local"` for production files
 * (`public/images/`, sync via `node scripts/sync-public-images.js`). Direct HTTPS (e.g. i.postimg.cc) passes through.
 * Do not use postimg.cc *page* URLs — only direct file URLs or `/images/…`.
 *
 * Cards, `apartment-detail.html`, and homepage gallery read resolved `APARTMENTS_DATA[].images` / `SITE_GALLERY_GROUPS` (see
 * `apartment-gallery-config.js`). Broken slider/detail images → `placeholder.svg` via `apt-image-utils.js`; gallery hides broken thumbs.
 */
(function () {
  "use strict";

  var SITE_IMAGE_PLACEHOLDER = "/images/placeholder.svg";
  var SITE_USE_IMAGE_PLACEHOLDER = false;

  function mapResolvedUrls(arr) {
    if (!arr || !arr.length) return arr;
    var fn = window.resolveListingImageUrl;
    if (typeof fn !== "function") return arr.slice();
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      out.push(fn(arr[i]));
    }
    return out;
  }

  function keepsRealPath(u) {
    return (
      window.AptImageUtils &&
      typeof window.AptImageUtils.isLocalListingImageUrl === "function" &&
      window.AptImageUtils.isLocalListingImageUrl(u)
    );
  }

  function mapListingImages(arr) {
    if (!SITE_USE_IMAGE_PLACEHOLDER || !arr || !arr.length) return arr;
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var u = arr[i];
      if (typeof u === "string" && keepsRealPath(u)) {
        out.push(u);
      } else {
        out.push(SITE_IMAGE_PLACEHOLDER);
      }
    }
    return out;
  }

  function urlsOrLegacy(globalArr, legacyArr) {
    if (Array.isArray(globalArr) && globalArr.length) return globalArr.slice();
    return legacyArr.slice();
  }

  /** Listing `bina`: `PREMIUM_RESIDENCE_IMAGE_URLS` then `BINA_RESIDENCE_IMAGE_URLS`, or legacy `/images/premium-*.jpg`. */
  function mergePremiumBina(legacyPremium) {
    var p =
      Array.isArray(window.PREMIUM_RESIDENCE_IMAGE_URLS) && window.PREMIUM_RESIDENCE_IMAGE_URLS.length
        ? window.PREMIUM_RESIDENCE_IMAGE_URLS.slice()
        : [];
    var b =
      Array.isArray(window.BINA_RESIDENCE_IMAGE_URLS) && window.BINA_RESIDENCE_IMAGE_URLS.length
        ? window.BINA_RESIDENCE_IMAGE_URLS.slice()
        : [];
    if (p.length || b.length) return p.concat(b);
    return legacyPremium.slice();
  }

  /** Booking.com property links (short URLs; add tracking params in `apartment-listings-config` if needed). */
  var BOOKING_HOUSE_NEAR_EXPO_CENTER =
    "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html?label=gen173bo-10CAsoEUInaG91c2UtbmVhci1haXJwb3J0LWFuZC1iYWt1LWV4cG8tY2VudGVySDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALuxLnOBsACAdICJDMyMDY4ZGMyLTUyZTEtNDRjNC1iMzNiLWY3OTY5NTJjMGNmZtgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&group_adults=2&group_children=0&no_rooms=1&sb_price_type=total&type=total&";

  var BOOKING_FIVE_MINUTE_FROM_AIRPORT =
    "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html";

  var BOOKING_AIRPORT_HAVEN =
    "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.ru.html";

  var BOOKING_HOUSE_NEAR_BOS =
    "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html";

  /** Airport Layover Studio — 12 photos (`express-NN` in public/images). */
  var EXPRESS_STUDIO_PATHS = [
    "/images/express-01.png",
    "/images/express-02.png",
    "/images/express-03.png",
    "/images/express-04.png",
    "/images/express-05.png",
    "/images/express-06.png",
    "/images/express-07.png",
    "/images/express-08.png",
    "/images/express-09.png",
    "/images/express-10.png",
    "/images/express-11.png",
    "/images/express-12.png",
  ];
  var EXPRESS_STUDIO_IMAGES = mapResolvedUrls(EXPRESS_STUDIO_PATHS);

  /** Spacious Family Apartment — `js/family-residence-images.js` or local `family-*`. */
  var FAMILY_APARTMENT_LEGACY = [
    "/images/family-01.jpg",
    "/images/family-02.png",
    "/images/family-03.jpg",
    "/images/family-04.jpg",
    "/images/family-05.jpg",
    "/images/family-06.jpg",
    "/images/family-07.png",
    "/images/family-08.png",
    "/images/family-09.jpg",
    "/images/family-10.jpg",
    "/images/family-11.jpg",
    "/images/family-12.jpg",
    "/images/family-13.jpg",
    "/images/family-14.jpg",
    "/images/family-15.jpg",
    "/images/family-16.jpg",
  ];
  var FAMILY_APARTMENT_PATHS = urlsOrLegacy(window.FAMILY_RESIDENCE_IMAGE_URLS, FAMILY_APARTMENT_LEGACY);
  var FAMILY_APARTMENT_IMAGES = mapResolvedUrls(FAMILY_APARTMENT_PATHS);

  /** Horizon Apartment — `js/horizon-apartment-images.js` or local `horizon-*`. */
  var HORIZON_APARTMENT_LEGACY = [
    "/images/horizon-01.jpg",
    "/images/horizon-02.jpg",
    "/images/horizon-03.jpg",
    "/images/horizon-04.jpg",
    "/images/horizon-05.jpg",
    "/images/horizon-06.jpg",
    "/images/horizon-07.jpg",
    "/images/horizon-08.jpg",
    "/images/horizon-09.jpg",
    "/images/horizon-10.jpg",
    "/images/horizon-11.jpg",
    "/images/horizon-12.jpg",
    "/images/horizon-13.jpg",
  ];
  var HORIZON_APARTMENT_PATHS = urlsOrLegacy(window.HORIZON_APARTMENT_IMAGE_URLS, HORIZON_APARTMENT_LEGACY);
  var HORIZON_APARTMENT_IMAGES = mapResolvedUrls(HORIZON_APARTMENT_PATHS);

  /** Premium Residence listing (`bina`) — `premium-residence-images.js` + `bina-residence-images.js` or local `premium-*`. */
  var PREMIUM_RESIDENCE_LEGACY = [
    "/images/premium-01.jpg",
    "/images/premium-02.jpg",
    "/images/premium-03.jpg",
    "/images/premium-04.jpg",
    "/images/premium-05.jpg",
    "/images/premium-06.jpg",
    "/images/premium-07.jpg",
    "/images/premium-08.jpg",
    "/images/premium-09.jpg",
    "/images/premium-10.jpg",
    "/images/premium-11.jpg",
    "/images/premium-12.jpg",
    "/images/premium-13.jpg",
    "/images/premium-14.jpg",
  ];
  var PREMIUM_RESIDENCE_PATHS = mergePremiumBina(PREMIUM_RESIDENCE_LEGACY);
  var PREMIUM_RESIDENCE_IMAGES = mapResolvedUrls(PREMIUM_RESIDENCE_PATHS);

  /** Airport Haven (`haven`) — `js/airport-haven-images.js` or local `haven-*`. */
  var HAVEN_COMFORT_LEGACY = [
    "/images/haven-01.jpg",
    "/images/haven-02.jpg",
    "/images/haven-03.jpg",
    "/images/haven-04.jpg",
    "/images/haven-05.jpg",
    "/images/haven-06.jpg",
    "/images/haven-07.jpg",
    "/images/haven-08.jpg",
    "/images/haven-09.jpg",
    "/images/haven-10.jpg",
    "/images/haven-11.jpg",
    "/images/haven-12.jpg",
    "/images/haven-13.jpg",
    "/images/haven-14.jpg",
    "/images/haven-15.jpg",
    "/images/haven-16.jpg",
    "/images/haven-17.jpg",
    "/images/haven-18.jpg",
  ];
  var HAVEN_COMFORT_PATHS = urlsOrLegacy(window.AIRPORT_HAVEN_IMAGE_URLS, HAVEN_COMFORT_LEGACY);
  var HAVEN_COMFORT_IMAGES = mapResolvedUrls(HAVEN_COMFORT_PATHS);

  /** Cozy Airport Studio (`avia`) — `js/cozy-studio-images.js` or local `/images/cozy-NN.jpg`. */
  var AVIA_COZY_PATHS = Array.isArray(window.COZY_AIRPORT_STUDIO_IMAGE_URLS) && window.COZY_AIRPORT_STUDIO_IMAGE_URLS.length
    ? window.COZY_AIRPORT_STUDIO_IMAGE_URLS.slice()
    : [
        "/images/cozy-01.jpg",
        "/images/cozy-02.jpg",
        "/images/cozy-03.jpg",
        "/images/cozy-04.jpg",
        "/images/cozy-05.jpg",
        "/images/cozy-06.jpg",
        "/images/cozy-07.jpg",
        "/images/cozy-08.jpg",
        "/images/cozy-09.jpg",
        "/images/cozy-10.jpg",
        "/images/cozy-11.jpg",
        "/images/cozy-12.jpg",
        "/images/cozy-13.jpg",
        "/images/cozy-14.jpg",
        "/images/cozy-15.jpg",
        "/images/cozy-16.jpg",
        "/images/cozy-17.jpg",
        "/images/cozy-18.jpg",
        "/images/cozy-19.jpg",
        "/images/cozy-20.jpg",
        "/images/cozy-21.jpg",
        "/images/cozy-22.jpg",
        "/images/cozy-23.jpg",
        "/images/cozy-24.jpg",
        "/images/cozy-25.jpg",
        "/images/cozy-26.jpg",
      ];
  var AVIA_COZY_IMAGES = mapResolvedUrls(AVIA_COZY_PATHS);

  /** Homepage #gallery: logical paths (same order as resolved `SITE_GALLERY_IMAGES`) for alt text. */
  var SITE_GALLERY_PATHS = []
    .concat(AVIA_COZY_PATHS.slice(0, 8))
    .concat(HAVEN_COMFORT_PATHS.slice(0, 8))
    .concat(PREMIUM_RESIDENCE_PATHS.slice(0, 8));

  var SITE_GALLERY_IMAGES = mapResolvedUrls(SITE_GALLERY_PATHS);

  /**
   * Listings: dedicated `images` arrays per apartment; only shared pool where no `images` is set.
   */
  var APARTMENTS_DATA = [
    {
      id: "haven",
      premium: true,
      featured: true,
      titleKey: "listing_name_haven",
      amenitiesLineKey: "apt_amenities_haven",
      perksKey: "apt_perks_haven",
      blurbKey: "apt_card_blurb_haven",
      guestsKey: "apt_card_guests_haven",
      priceFrom: 95,
      waSuffixKey: "wa_suffix_haven",
      otaAriaKey: "aria_book_haven_ota",
      bookingLink: BOOKING_AIRPORT_HAVEN,
      ota: {
        booking: BOOKING_AIRPORT_HAVEN,
        airbnb: "https://www.airbnb.com/h/airporth",
      },
      altMode: "comfort",
      images: HAVEN_COMFORT_IMAGES,
    },
    {
      id: "avia",
      premium: false,
      titleKey: "listing_name_avia",
      amenitiesLineKey: "apt_amenities_avia",
      perksKey: "apt_perks_avia",
      blurbKey: "apt_card_blurb_avia",
      guestsKey: "apt_card_guests_avia",
      priceFrom: 85,
      waSuffixKey: "wa_suffix_avia",
      otaAriaKey: "aria_book_avia_ota",
      bookingLink: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
      ota: {
        booking: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
        airbnb: "https://www.airbnb.com/h/aviaapartmentz",
      },
      altMode: "cozy",
      images: AVIA_COZY_IMAGES,
    },
    {
      id: "bina",
      premium: false,
      titleKey: "listing_name_bina",
      amenitiesLineKey: "apt_amenities_bina",
      perksKey: "apt_perks_bina",
      blurbKey: "apt_card_blurb_bina",
      guestsKey: "apt_card_guests_bina",
      priceFrom: 120,
      waSuffixKey: "wa_suffix_bina",
      otaAriaKey: "aria_book_bina_ota",
      bookingLink: BOOKING_HOUSE_NEAR_BOS,
      ota: {
        booking: BOOKING_HOUSE_NEAR_BOS,
        airbnb: "https://www.airbnb.com/h/binaairport",
      },
      altMode: "premium",
      images: PREMIUM_RESIDENCE_IMAGES,
    },
    {
      id: "horizon",
      premium: false,
      titleKey: "listing_name_horizon",
      amenitiesLineKey: "apt_amenities_horizon",
      perksKey: "apt_perks_horizon",
      blurbKey: "apt_card_blurb_horizon",
      guestsKey: "apt_card_guests_horizon",
      priceFrom: 90,
      waSuffixKey: "wa_suffix_horizon",
      otaAriaKey: "aria_book_horizon_ota",
      bookingLink: BOOKING_HOUSE_NEAR_EXPO_CENTER,
      ota: {
        booking: BOOKING_HOUSE_NEAR_EXPO_CENTER,
      },
      altMode: "horizon",
      images: HORIZON_APARTMENT_IMAGES,
    },
    {
      id: "express",
      premium: false,
      titleKey: "apt_name_express",
      amenitiesLineKey: "apt_amenities_express",
      perksKey: "apt_perks_express",
      blurbKey: "apt_card_blurb_express",
      guestsKey: "apt_card_guests_express",
      priceFrom: 70,
      waSuffixKey: "wa_suffix_express",
      otaAriaKey: "aria_book_express_ota",
      bookingLink: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
      ota: {
        booking: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
      },
      altMode: "express",
      images: EXPRESS_STUDIO_IMAGES,
    },
    {
      id: "family",
      premium: true,
      titleKey: "apt_name_family",
      amenitiesLineKey: "apt_amenities_family",
      perksKey: "apt_perks_family",
      blurbKey: "apt_card_blurb_family",
      guestsKey: "apt_card_guests_family",
      priceFrom: 110,
      waSuffixKey: "wa_suffix_family",
      otaAriaKey: "aria_book_family_ota",
      bookingLink: BOOKING_HOUSE_NEAR_BOS,
      ota: {
        booking: BOOKING_HOUSE_NEAR_BOS,
      },
      altMode: "family",
      images: FAMILY_APARTMENT_IMAGES,
    },
  ];

  window.SITE_GALLERY_IMAGE_META = SITE_GALLERY_PATHS.map(function (logical) {
    return { logical: logical };
  });
  window.SITE_GALLERY_IMAGES = mapListingImages(SITE_GALLERY_IMAGES);
  /** @deprecated Use SITE_GALLERY_IMAGES */
  window.POSTIMG_GALLERY_IMAGES = window.SITE_GALLERY_IMAGES;
  window.APARTMENTS_DATA = APARTMENTS_DATA.map(function (apt) {
    var o = {};
    for (var k in apt) {
      if (Object.prototype.hasOwnProperty.call(apt, k)) {
        o[k] = apt[k];
      }
    }
    o.images = mapListingImages(apt.images);
    return o;
  });
  window.SITE_USE_IMAGE_PLACEHOLDER = SITE_USE_IMAGE_PLACEHOLDER;
  window.SITE_IMAGE_PLACEHOLDER = SITE_IMAGE_PLACEHOLDER;

  window.getApartmentSlideAltKey = function (apt, slideIndex) {
    var m = apt.altMode;
    if (m === "comfort") return "comfort_residence_alt_" + (slideIndex + 1);
    if (m === "cozy") return "cozy_studio_alt_" + (slideIndex + 1);
    if (m === "premium") return "premium_residence_alt_" + (slideIndex + 1);
    if (m === "horizon") return "horizon_apartment_alt_" + (slideIndex + 1);
    if (m === "express") return "apt_slide_express_" + (slideIndex + 1);
    if (m === "family") return "spacious_family_alt_" + (slideIndex + 1);
    return "apt_slide_alt_generic_" + ((slideIndex % 4) + 1);
  };
})();
