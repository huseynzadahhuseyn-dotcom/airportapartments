/**
 * Gallery + apartment sliders: only absolute paths `/images/<file>` (source files in `public/images/`,
 * mirrored to root `images/` so static hosts resolve `/images/*` from site root).
 */
(function () {
  "use strict";

  var SITE_GALLERY_IMAGES = [
    "/images/1.jpg",
    "/images/room1.png",
    "/images/apartment2.webp",
  ];

  window.SITE_GALLERY_IMAGES = SITE_GALLERY_IMAGES;
  /** @deprecated Use SITE_GALLERY_IMAGES */
  window.POSTIMG_GALLERY_IMAGES = SITE_GALLERY_IMAGES;

  /**
   * Horizon Apartment — 13 photos, order matches:
   * tYv1GvX8, yDJD1hdp, k2V2JNGn, 4YKYfvdM, 21q1kd6t, mPcPL3D5, k2V2JN4k,
   * RW3WS1hr, HrJrY0nm, 4YKYfvym, DSWSvQ0z, rDdDVGsm, dh7hsR33 (postimg.cc).
   */
  /**
   * Airport Layover Studio — 12 photos only (postimg.cc order: 64GrGs6g … mhcNn9Nx).
   */
  var EXPRESS_STUDIO_IMAGES = [
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

  /**
   * Spacious Family Apartment — 16 photos only (postimg.cc order: KKgBHDFv … qz1JCNY9).
   */
  var FAMILY_APARTMENT_IMAGES = [
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

  var HORIZON_APARTMENT_IMAGES = [
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

  /**
   * Six listing cards: most use SITE_GALLERY_IMAGES; Horizon uses `images: HORIZON_APARTMENT_IMAGES`.
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
      images: HORIZON_APARTMENT_IMAGES,
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
      images: EXPRESS_STUDIO_IMAGES,
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
      images: FAMILY_APARTMENT_IMAGES,
    },
  ];

  window.getApartmentSlideAltKey = function (apt, slideIndex) {
    var m = apt.altMode;
    if (m === "comfort") return "comfort_residence_alt_" + (slideIndex + 1);
    if (m === "horizon") return "horizon_apartment_alt_" + (slideIndex + 1);
    if (m === "express") return "apt_slide_express_" + (slideIndex + 1);
    if (m === "family") return "spacious_family_alt_" + (slideIndex + 1);
    return "apt_slide_alt_generic_" + ((slideIndex % 4) + 1);
  };
})();
