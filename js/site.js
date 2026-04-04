/**
 * WhatsApp links: unified booking text from `whatsapp_message` (all locales).
 * - `data-wa-prefill` — uses `data-wa-body` if set, else `whatsapp_message`.
 * - `data-wa-full-key` — legacy attribute; href still uses `whatsapp_message` so every CTA matches.
 */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/994506581718";

  function encode(text) {
    return encodeURIComponent(text || "");
  }

  function defaultWhatsAppText() {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t("whatsapp_message") || "";
    }
    return "";
  }

  function applyWaLinks() {
    var fallback = defaultWhatsAppText();

    document.querySelectorAll("a[data-wa-full-key]").forEach(function (a) {
      var body = fallback;
      a.setAttribute("href", WA_BASE + "?text=" + encode(body));
    });

    document.querySelectorAll("a[data-wa-prefill]").forEach(function (a) {
      if (a.hasAttribute("data-wa-full-key")) return;
      var bodyOnly = a.getAttribute("data-wa-body");
      var msg =
        bodyOnly !== null && bodyOnly !== ""
          ? bodyOnly
          : fallback;
      a.setAttribute("href", WA_BASE + "?text=" + encode(msg));
    });
  }

  window.applyWhatsAppLinks = applyWaLinks;
  window.addEventListener("i18n:applied", applyWaLinks);
})();
