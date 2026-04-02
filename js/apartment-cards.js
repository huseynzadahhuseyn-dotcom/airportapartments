/**
 * Renders #apartments-grid when window.APARTMENTS_DATA is provided.
 * If missing, shows a single CTA link after i18n (text from book_cta_browse_apartments).
 */
(function () {
  "use strict";

  function renderFallback(grid) {
    if (grid.children.length) return;
    var p = document.createElement("p");
    p.className = "apartments-fallback";
    p.style.cssText = "text-align:center;margin:1rem 0;";
    var a = document.createElement("a");
    a.href = "apartments.html";
    a.className = "btn btn-lg btn-primary";
    a.setAttribute("data-i18n", "book_cta_browse_apartments");
    p.appendChild(a);
    grid.appendChild(p);
    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(grid);
    }
  }

  function tryRender() {
    var grid = document.getElementById("apartments-grid");
    if (!grid) return;
    var data = window.APARTMENTS_DATA;
    if (data && Array.isArray(data) && data.length && typeof window.buildApartmentCards === "function") {
      window.buildApartmentCards(grid, data);
      return;
    }
    renderFallback(grid);
  }

  window.addEventListener("i18n:applied", tryRender);
})();
