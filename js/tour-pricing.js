/**
 * Injects tour tier prices from canonical AZN bases, converted by site language:
 * AZ → AZN, EN → USD (1 USD = 1.70 AZN), RU → EUR (1 EUR = 2 AZN).
 */
(function () {
  "use strict";

  var AZN_PER_USD = 1.7;
  var AZN_PER_EUR = 2;

  var BASE = {
    sedan: [85, 102, 102],
    vito: [119],
    x5: [260],
  };

  function roundClean(n) {
    var x = Math.round(Number(n));
    return x < 1 ? 1 : x;
  }

  function formatAmount(lang, azn) {
    if (lang === "az") {
      return roundClean(azn) + " ₼";
    }
    if (lang === "ru") {
      return "€" + roundClean(azn / AZN_PER_EUR);
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

  function htmlForKind(kind, lang) {
    var rows = BASE[kind];
    if (!rows || !rows.length) return "";
    if (kind === "sedan") {
      return (
        '<ul class="tour-price-tiers tour-price-tiers--premium" role="list">' +
        tierRow("tour_price_qty_1_guest", rows[0], lang) +
        tierRow("tour_price_qty_2_guests", rows[1], lang) +
        tierRow("tour_price_qty_up_to_4", rows[2], lang) +
        "</ul>"
      );
    }
    if (kind === "vito") {
      return (
        '<ul class="tour-price-tiers tour-price-tiers--flat tour-price-tiers--premium" role="list">' +
        '<li><span class="tour-price-flat-label" data-i18n="tour_price_qty_up_to_6"></span><span class="tour-price-tier-amt">' +
        formatAmount(lang, rows[0]) +
        "</span></li></ul>"
      );
    }
    if (kind === "x5") {
      return (
        '<ul class="tour-price-tiers tour-price-tiers--flat tour-price-tiers--premium" role="list">' +
        '<li><span class="tour-price-flat-label" data-i18n="tour_price_qty_up_to_4_flat"></span><span class="tour-price-tier-amt">' +
        formatAmount(lang, rows[0]) +
        "</span></li></ul>"
      );
    }
    return "";
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
