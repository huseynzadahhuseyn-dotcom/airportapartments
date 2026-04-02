/**
 * Site images: normalize paths to `/images/*` and log failed `<img>` loads in the console.
 */
(function () {
  "use strict";

  /**
   * Force in-app URLs onto `/images/...` (root-relative). Leaves http(s), data:, and protocol-relative URLs unchanged.
   * @param {string|null|undefined} raw
   * @returns {string|null|undefined}
   */
  function normalizeSiteImageUrl(raw) {
    if (raw == null || raw === "") return raw;
    var u = String(raw).trim();
    if (/^https?:\/\//i.test(u) || /^data:/i.test(u) || /^\/\//.test(u)) return u;
    u = u.replace(/^\/public\/images\//i, "/images/");
    u = u.replace(/^public\/images\//i, "/images/");
    u = u.replace(/^\.\/images\//, "/images/");
    u = u.replace(/^\.\.\/images\//, "/images/");
    if (/^images\//i.test(u) && !/^\/images\//i.test(u)) {
      u = "/" + u.replace(/^\/+/, "");
    }
    return u;
  }

  function logImageLoadFailure(img) {
    if (!img || img.tagName !== "IMG") return;
    console.warn("[image load failed]", {
      src: img.getAttribute("src") || "",
      currentSrc: img.currentSrc || "",
    });
  }

  if (typeof document !== "undefined") {
    document.addEventListener(
      "error",
      function (e) {
        var t = e.target;
        if (t && t.tagName === "IMG") logImageLoadFailure(t);
      },
      true
    );
  }

  window.AptImageUtils = {
    normalizeSiteImageUrl: normalizeSiteImageUrl,
    logImageLoadFailure: logImageLoadFailure,
    bindGalleryImages: function () {},
  };
})();
