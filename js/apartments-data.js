/**
 * Gallery image paths: files live in `public/images/` (mirrored to root `images/` for `/images/*` URLs).
 */
(function () {
  "use strict";

  var POSTIMG_GALLERY_IMAGES = [
    "/images/1.jpg",
    "/images/555f64cc-0f41-4e14-a943-9a9a5aa5b569.jpg",
    "/images/619884148.jpg",
    "/images/809414780.jpg",
    "/images/809905749.jpg",
    "/images/813869831.jpg",
    "/images/813870546.jpg",
    "/images/813871146.jpg",
    "/images/813876698.jpg",
    "/images/Chat-GPT-Image-Mar-28-2026-01-39-54-PM.png",
    "/images/heyet.jpg",
    "/images/Whats-App-Image-2025-09-05-at-09-16-40.jpg",
    "/images/Whats-App-Image-2025-09-05-at-09-16-41-(4).jpg",
  ];

  window.POSTIMG_GALLERY_IMAGES = POSTIMG_GALLERY_IMAGES;

  /**
   * Six listing cards: slide images reuse the Comfort Residence gallery URLs (all still on CDN).
   * `haven` uses the full 13 for parity with #gallery lightbox set.
   */
  window.APARTMENTS_DATA = [
    {
      id: "haven",
      premium: true,
      featured: true,
      titleKey: "listing_name_haven",
      blurbKey: "apt_card_blurb_haven",
      guestsKey: "apt_card_guests_haven",
      priceFrom: 95,
      waSuffixKey: "wa_suffix_haven",
      otaAriaKey: "aria_book_haven_ota",
      ota: {
        booking: "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.en-gb.html",
        airbnb: "https://www.airbnb.com/h/airporth",
      },
      altMode: "comfort",
      imgCount: 13,
      imgStart: 0,
    },
    {
      id: "avia",
      premium: false,
      titleKey: "listing_name_avia",
      blurbKey: "apt_card_blurb_avia",
      guestsKey: "apt_card_guests_avia",
      priceFrom: 85,
      waSuffixKey: "wa_suffix_avia",
      otaAriaKey: "aria_book_avia_ota",
      altMode: "generic",
      imgCount: 4,
      imgStart: 0,
    },
    {
      id: "bina",
      premium: false,
      titleKey: "listing_name_bina",
      blurbKey: "apt_card_blurb_bina",
      guestsKey: "apt_card_guests_bina",
      priceFrom: 120,
      waSuffixKey: "wa_suffix_bina",
      otaAriaKey: "aria_book_bina_ota",
      altMode: "generic",
      imgCount: 4,
      imgStart: 3,
    },
    {
      id: "horizon",
      premium: false,
      titleKey: "listing_name_horizon",
      blurbKey: "apt_card_blurb_horizon",
      guestsKey: "apt_card_guests_horizon",
      priceFrom: 90,
      waSuffixKey: "wa_suffix_horizon",
      otaAriaKey: "aria_book_horizon_ota",
      altMode: "horizon",
      imgCount: 5,
      imgStart: 2,
    },
    {
      id: "express",
      premium: false,
      titleKey: "apt_name_express",
      blurbKey: "apt_card_blurb_express",
      guestsKey: "apt_card_guests_express",
      priceFrom: 70,
      waSuffixKey: "wa_suffix_express",
      otaAriaKey: "aria_book_express_ota",
      altMode: "express",
      imgCount: 3,
      imgStart: 5,
    },
    {
      id: "family",
      premium: true,
      titleKey: "apt_name_family",
      blurbKey: "apt_card_blurb_family",
      guestsKey: "apt_card_guests_family",
      priceFrom: 110,
      waSuffixKey: "wa_suffix_family",
      otaAriaKey: "aria_book_family_ota",
      altMode: "family",
      imgCount: 4,
      imgStart: 7,
    },
  ];
})();
