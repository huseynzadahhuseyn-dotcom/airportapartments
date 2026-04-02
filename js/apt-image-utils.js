/**
 * Site images: normalize paths to `/images/*`, swap broken `<img>` src to placeholder, log failures.
 */
(function () {
  "use strict";

  var IMAGE_PLACEHOLDER = "/images/placeholder.svg";

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

  function applyImgFallback(img) {
    if (!img || img.tagName !== "IMG") return;
    if (img.getAttribute("data-no-img-fallback") === "true") return;
    if (img.getAttribute("data-img-fallback-once") === "1") return;
    var src = img.getAttribute("src") || "";
    if (!src || src.indexOf(IMAGE_PLACEHOLDER) !== -1) return;
    if (src.indexOf("/images/") === -1) return;
    img.setAttribute("data-img-fallback-once", "1");
    img.src = IMAGE_PLACEHOLDER;
  }

  if (typeof document !== "undefined") {
    document.addEventListener(
      "error",
      function (e) {
        var t = e.target;
        if (!t || t.tagName !== "IMG") return;
        logImageLoadFailure(t);
        applyImgFallback(t);
      },
      true
    );
  }

  window.AptImageUtils = {
    normalizeSiteImageUrl: normalizeSiteImageUrl,
    logImageLoadFailure: logImageLoadFailure,
    imagePlaceholder: IMAGE_PLACEHOLDER,
    applyImgFallback: applyImgFallback,
    bindGalleryImages: function () {},
  };
})();
