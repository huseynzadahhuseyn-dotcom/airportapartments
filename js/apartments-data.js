/**
 * Gallery + apartment sliders: runtime URLs must be root-relative `/images/<file>` only (never `/public/images/`,
 * `./images/`, or `public/images/` in strings). Source assets may live in `public/images/`; copy to `images/` before
 * deploy: `node scripts/sync-public-images.js` (or `scripts/sync-public-images.ps1` on Windows).
 * Vercel: `vercel.json` runs `npm run build`, which copies `public/images/*` → `images/` so `/images/*` URLs resolve.
 *
 * When `SITE_USE_IMAGE_PLACEHOLDER` is true, every listing/gallery URL is replaced with `/images/placeholder.svg`
 * so the site stays usable if photo binaries are not deployed. Set to false and run `npm run verify-images` once
 * all files from the paths below exist under `public/images/` (then `npm run build`).
 */
(function () {
  "use strict";

  var SITE_IMAGE_PLACEHOLDER = "/images/placeholder.svg";
  var SITE_USE_IMAGE_PLACEHOLDER = true;

  function mapListingImages(arr, aptId) {
    if (aptId === "avia") return arr;
    if (!SITE_USE_IMAGE_PLACEHOLDER || !arr || !arr.length) return arr;
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      out.push(SITE_IMAGE_PLACEHOLDER);
    }
    return out;
  }

  var SITE_GALLERY_IMAGES = [
    "/images/1.jpg",
    "/images/room1.png",
    "/images/apartment2.webp",
  ];

  /** Fallback when no property-specific Booking URL is set (bina); replace in data if you add a listing. */
  var BOOKING_SEARCH_NEAR_GYD =
    "https://www.booking.com/searchresults.en-gb.html?ss=Heydar+Aliyev+International+Airport";

  /** Booking.com property links (affiliate params preserved). */
  var BOOKING_HOUSE_NEAR_EXPO_CENTER =
    "https://www.booking.com/hotel/az/house-near-airport-and-baku-expo-center.ru.html?label=gen173bo-10CAsoEUInaG91c2UtbmVhci1haXJwb3J0LWFuZC1iYWt1LWV4cG8tY2VudGVySDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuALuxLnOBsACAdICJDMyMDY4ZGMyLTUyZTEtNDRjNC1iMzNiLWY3OTY5NTJjMGNmZtgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&group_adults=2&group_children=0&no_rooms=1&sb_price_type=total&type=total&";

  var BOOKING_FIVE_MINUTE_FROM_AIRPORT =
    "https://www.booking.com/hotel/az/5-minute-from-airport.en-gb.html?label=gen173bo-10CAsoEUIVNS1taW51dGUtZnJvbS1haXJwb3J0SDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuAKzwrnOBsACAdICJDEyMTFmNGE3LTNjMzktNDNhOC05YTY1LTcwZTJmOGE1ZTZkM9gCAeACAQ&sid=b62d44cfcc68ca9d61cc909dab83e40c&dist=0&keep_landing=1&sb_price_type=total&type=total&";

  var BOOKING_AIRPORT_HAVEN =
    "https://www.booking.com/hotel/az/airport-haven-cozy-and-convenient.ru.html?label=gen173bo-10CAsoEUIhYWlycG9ydC1oYXZlbi1jb3p5LWFuZC1jb252ZW5pZW50SDNYA2gRiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBmAIGqAIBuAKMwrnOBsACAdICJGZhYmM0MWEyLTRjYjEtNGRjNS1iMjRhLTFlMTlmMWY3MWM3NdgCAeACAQ&sid=050bd510d0756cc961ebf1977517a667&dist=0&sb_price_type=total&type=total&";

  var BOOKING_HOUSE_NEAR_BOS =
    "https://www.booking.com/hotel/az/house-near-baku-airport-and-bos.ru.html?label=gen173bo-10CAsoEUIfaG91c2UtbmVhci1iYWt1LWFpcnBvcnQtYW5kLWJvc0gzWANoEYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAZgCBqgCAbgCicK5zgbAAgHSAiQxYTliN2ZlNC1iNTAwLTQ1Y2ItYjdjZi02NjcwOWU2ZDQ5ZTfYAgHgAgE&sid=050bd510d0756cc961ebf1977517a667&dist=0&sb_price_type=total&type=total&";

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

  /**
   * Horizon Apartment — 13 photos (postimg: tYv1GvX8 … dh7hsR33).
   */
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

  /** Premium Residence (listing `bina`) — 14 photos; postimg: PL8YRQhW … LJjPpBhC. */
  var PREMIUM_RESIDENCE_IMAGES = [
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

  /** Comfort Residence (`haven`) — 18 photos; postimg: Z9ypMxZT … s1n96cZG. */
  var HAVEN_COMFORT_IMAGES = [
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

  /**
   * Cozy Airport Studio (`avia`) — 26 photos, local `/images/cozy-NN.jpg`.
   * Source gallery pages: postimg.cc s1wWLYjg … Cz2qhwn6 (imported Jan 2026).
   */
  var AVIA_COZY_IMAGES = [
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

  /**
   * Listings: dedicated `images` arrays per apartment; only shared pool where no `images` is set.
   */
  var APARTMENTS_DATA = [
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
      blurbKey: "apt_card_blurb_avia",
      guestsKey: "apt_card_guests_avia",
      priceFrom: 85,
      waSuffixKey: "wa_suffix_avia",
      otaAriaKey: "aria_book_avia_ota",
      bookingLink: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
      ota: {
        booking: BOOKING_FIVE_MINUTE_FROM_AIRPORT,
      },
      altMode: "cozy",
      images: AVIA_COZY_IMAGES,
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
      bookingLink: BOOKING_SEARCH_NEAR_GYD,
      ota: {
        booking: BOOKING_SEARCH_NEAR_GYD,
      },
      altMode: "premium",
      images: PREMIUM_RESIDENCE_IMAGES,
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

  window.SITE_GALLERY_IMAGES = mapListingImages(SITE_GALLERY_IMAGES, null);
  /** @deprecated Use SITE_GALLERY_IMAGES */
  window.POSTIMG_GALLERY_IMAGES = window.SITE_GALLERY_IMAGES;
  window.APARTMENTS_DATA = APARTMENTS_DATA.map(function (apt) {
    var o = {};
    for (var k in apt) {
      if (Object.prototype.hasOwnProperty.call(apt, k)) {
        o[k] = apt[k];
      }
    }
    o.images = mapListingImages(apt.images, apt.id);
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
