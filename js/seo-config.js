/**
 * Canonical URL, hreflang hrefs, minimal JSON-LD placeholders (runs before i18n).
 */
(function () {
  "use strict";

  function absUrl(path) {
    var base = window.location.origin;
    if (!path || path === "/") return base + "/";
    return base + (path.charAt(0) === "/" ? path : "/" + path);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var path = html.getAttribute("data-canonical-path") || "/";
    var canonical = absUrl(path);

    var link = document.getElementById("seo-canonical");
    if (link) link.setAttribute("href", canonical);

    document.querySelectorAll("link[data-hreflang]").forEach(function (el) {
      el.setAttribute("href", canonical);
    });

    var xdef = document.getElementById("hreflang-x-default");
    if (xdef) xdef.setAttribute("href", canonical);

    ["seo-jsonld-local", "seo-jsonld-faq"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node && (!node.textContent || !node.textContent.trim())) {
        node.textContent = '{"@context":"https://schema.org"}';
      }
    });
  });
})();
