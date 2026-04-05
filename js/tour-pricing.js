/**
 * Tour cards: prominent 1-person price + optional extra tiers (sedan).
 * AZ → AZN; EN / TR / RU → USD (1 USD = 1.70 AZN). X5 1p = $180 → 306 AZN.
 */
(function () {
  "use strict";

  var AZN_PER_USD = 1.7;

  /** Fixed 1-guest display amounts (USD / AZN). */
  var USD_1P = { sedan: 50, vito: 70, x5: 180 };
  var AZN_1P = {
    sedan: Math.round(USD_1P.sedan * AZN_PER_USD),
    vito: Math.round(USD_1P.vito * AZN_PER_USD),
    x5: Math.round(USD_1P.x5 * AZN_PER_USD),
  };

  /** Sedan: additional guest tiers (AZN). */
  var SEDAN_EXTRA_AZN = [102, 102];

  function roundClean(n) {
    var x = Math.round(Number(n));
    return x < 1 ? 1 : x;
  }

  function formatAmount(lang, azn) {
    if (lang === "az") {
      return roundClean(azn) + " ₼";
    }
    return "$" + roundClean(azn / AZN_PER_USD);
  }

  function tierRow(qtyKey, azn, lang) {
    return (
      '<li><span class="tour-price-tier-qty" data-i18n="' +
      qtyKey +
      '"></span><span class="tour-price-tier-amt">' +
      formatAmount(lang, azn) +
      "</span></li>"
    );
  }

  function onePersonBlock(kind, lang) {
    var amt =
      lang === "az"
        ? "<strong>" + AZN_1P[kind] + " ₼</strong>"
        : "<strong>$" + USD_1P[kind] + "</strong>";
    return (
      '<p class="tour-1p-price" role="status">' +
      '<span class="tour-1p-price__prefix" data-i18n="tour_1p_prefix"></span> ' +
      amt +
      "</p>"
    );
  }

  function htmlForKind(kind, lang) {
    var out = onePersonBlock(kind, lang);
    if (kind === "sedan") {
      out +=
        '<p class="tour-price-subheading" data-i18n="tour_price_more_guests_heading"></p>' +
        '<ul class="tour-price-tiers tour-price-tiers--premium tour-price-tiers--secondary" role="list">' +
        tierRow("tour_price_qty_2_guests", SEDAN_EXTRA_AZN[0], lang) +
        tierRow("tour_price_qty_up_to_4", SEDAN_EXTRA_AZN[1], lang) +
        "</ul>";
    }
    return out;
  }

  function refreshTourPrices() {
    if (!window.I18N || typeof window.I18N.getLang !== "function") return;
    var lang = window.I18N.getLang() || "en";
    document.querySelectorAll("[data-tour-pricing]").forEach(function (el) {
      var kind = el.getAttribute("data-tour-pricing");
      if (!kind) return;
      el.innerHTML = htmlForKind(kind, lang);
    });
    var root = document.getElementById("tours");
    if (root && typeof window.I18N.apply === "function") {
      window.I18N.apply(root);
    }
  }

  document.addEventListener("i18n:applied", refreshTourPrices);
  document.addEventListener("DOMContentLoaded", function () {
    refreshTourPrices();
  });
})();
