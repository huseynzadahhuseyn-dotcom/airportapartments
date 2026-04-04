/**
 * Optional extra apartments for the homepage #apartments-grid (booking-style cards).
 * Loaded before `apartment-listings-config.js` so the same link/cover rules apply.
 *
 * If `js/apartment-cards-data.js` sets a non-empty `APARTMENT_CARDS_DATA`, the grid uses
 * only that list instead of `APARTMENTS_DATA` + this extra array.
 *
 * Each row should mirror entries in `js/apartments-data.js` plus merged card fields
 * from `apartment-listings-config.js` (cardBookingUrl, cardAirbnbUrl, …).
 *
 * ── Field reference (copy when adding a listing) ─────────────────────────────
 * id              string   URL id for apartment-detail.html?apt=
 * titleKey        string   i18n key for the card title
 * blurbKey        string   i18n key for short description
 * guestsKey       string   i18n key for guest capacity line
 * priceFrom       number   shown as "from X AZN / night" unless cardPriceOnRequest
 * cardPriceOnRequest  bool (optional) true → "Price on request" (set via listings-config)
 * waSuffixKey     string   i18n key appended to WhatsApp prefill (see other listings)
 * images          string[] image URLs; use ["/images/placeholder.svg"] until you add photos
 * bookingLink     string   (optional) Booking.com URL; can also rely on listings-config
 * ota             object   optional { booking: "...", airbnb: "..." }
 * premium         bool     optional "featured" badge
 *
 * After adding rows here, add matching i18n keys in locales/en.json, az.json, tr.json, ar.json
 * and (if needed) a block in `apartment-listings-config.js` for airport line / airbnb / booking overrides.
 *
 * Example (commented — duplicate and uncomment to add a 7th listing):
 *
 * {
 *   id: "my-new-apt",
 *   premium: false,
 *   titleKey: "listing_name_avia",
 *   blurbKey: "apt_card_blurb_avia",
 *   guestsKey: "apt_card_guests_avia",
 *   priceFrom: 60,
 *   waSuffixKey: "wa_suffix_avia",
 *   images: ["/images/placeholder.svg", "/images/placeholder.svg"],
 *   bookingLink: "https://www.booking.com/...",
 *   ota: { airbnb: "https://www.airbnb.com/..." },
 * },
 */
(function () {
  "use strict";

  window.APARTMENTS_BOOKING_EXTRA = window.APARTMENTS_BOOKING_EXTRA || [];

  /* Skeleton examples (same shape as real rows). Replace keys/urls/images for new listings.

  { id: "example-1", premium: false, titleKey: "listing_name_avia",      blurbKey: "apt_card_blurb_avia",      guestsKey: "apt_card_guests_avia",      priceFrom: 60,  waSuffixKey: "wa_suffix_avia",      images: ["/images/placeholder.svg"] },
  { id: "example-2", premium: false, titleKey: "listing_name_bina",      blurbKey: "apt_card_blurb_bina",      guestsKey: "apt_card_guests_bina",      priceFrom: 80, waSuffixKey: "wa_suffix_bina",      images: ["/images/placeholder.svg"] },
  { id: "example-3", premium: false, titleKey: "listing_name_horizon",   blurbKey: "apt_card_blurb_horizon",   guestsKey: "apt_card_guests_horizon",   priceFrom: 80,  waSuffixKey: "wa_suffix_horizon",   images: ["/images/placeholder.svg"] },
  { id: "example-4", premium: false, titleKey: "listing_name_layover",   blurbKey: "apt_card_blurb_layover",   guestsKey: "apt_card_guests_layover",   priceFrom: 80,  waSuffixKey: "wa_suffix_layover",   images: ["/images/placeholder.svg"] },

  */
})();
