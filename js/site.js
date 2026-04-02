/**
 * WhatsApp links: data-wa-prefill (whatsapp_message) and data-wa-full-key (locale key).
 */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/994506581718";

  function encode(text) {
    return encodeURIComponent(text || "");
  }

  function applyWaLinks() {
    var defaultMsg = "";
    if (window.I18N && typeof window.I18N.t === "function") {
      defaultMsg = window.I18N.t("whatsapp_message") || "";
    }

    document.querySelectorAll("a[data-wa-full-key]").forEach(function (a) {
      var key = a.getAttribute("data-wa-full-key");
      if (!key || !window.I18N || typeof window.I18N.t !== "function") return;
      var body = window.I18N.t(key);
      a.setAttribute("href", WA_BASE + "?text=" + encode(body));
    });

    document.querySelectorAll("a[data-wa-prefill]").forEach(function (a) {
      if (a.hasAttribute("data-wa-full-key")) return;
      var msg = defaultMsg;
      if (window.I18N && typeof window.I18N.t === "function") {
        msg = window.I18N.t("whatsapp_message") || msg;
      }
      a.setAttribute("href", WA_BASE + "?text=" + encode(msg));
    });
  }

  window.addEventListener("i18n:applied", applyWaLinks);
})();
