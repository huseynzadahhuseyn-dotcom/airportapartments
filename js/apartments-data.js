/**
 * Gallery image paths: files live in `public/images/` (mirrored to root `images/` for `/images/*` URLs).
 */
(function () {
  "use strict";

  var POSTIMG_GALLERY_IMAGES = [
    "/images/1.jpg",
    "/images/room1.png",
    "/images/apartment2.webp",
  ];

  window.POSTIMG_GALLERY_IMAGES = POSTIMG_GALLERY_IMAGES;

  /**
   * Six listing cards: sliders cycle `/images/1.jpg`, `room1.png`, `apartment2.webp` (pool length 3).
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
      imgCount: 3,
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
      imgCount: 3,
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
      imgCount: 3,
      imgStart: 1,
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
      imgCount: 3,
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
      imgStart: 0,
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
      imgCount: 3,
      imgStart: 1,
    },
  ];
})();
