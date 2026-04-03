/**
 * Homepage #gallery: same URL sources as listing cards (`js/*-images.js` globals + fallbacks).
 * Each group uses `window.*_IMAGE_URLS` when non-empty (cozy, haven, horizon, layover, family; premium block = premium + bina merged).
 * Otherwise `/images/apartments/<folder>/1.jpg`, … `titleKey` → locales `gallery_group_*`.
 */
(function () {
  "use strict";

  function seq(folder, count, ext) {
    ext = ext || ".jpg";
    var base = "/images/apartments/" + folder + "/";
    var a = [];
    for (var i = 1; i <= count; i++) {
      a.push(base + i + ext);
    }
    return a;
  }

  function urlsOrLegacy(globalArr, legacyArr) {
    if (Array.isArray(globalArr) && globalArr.length) return globalArr.slice();
    return legacyArr.slice();
  }

  function mergePremiumBinaGallery() {
    var p =
      Array.isArray(window.PREMIUM_RESIDENCE_IMAGE_URLS) && window.PREMIUM_RESIDENCE_IMAGE_URLS.length
        ? window.PREMIUM_RESIDENCE_IMAGE_URLS.slice()
        : [];
    var b =
      Array.isArray(window.BINA_RESIDENCE_IMAGE_URLS) && window.BINA_RESIDENCE_IMAGE_URLS.length
        ? window.BINA_RESIDENCE_IMAGE_URLS.slice()
        : [];
    if (p.length || b.length) return p.concat(b);
    return seq("premium", 24).concat(seq("bina", 24));
  }

  window.SITE_GALLERY_GROUPS = [
    {
      titleKey: "gallery_group_premium",
      images: mergePremiumBinaGallery(),
    },
    {
      titleKey: "gallery_group_cozy",
      images: urlsOrLegacy(window.COZY_AIRPORT_STUDIO_IMAGE_URLS, seq("cozy", 24)),
    },
    {
      titleKey: "gallery_group_haven",
      images: urlsOrLegacy(window.AIRPORT_HAVEN_IMAGE_URLS, seq("haven", 24)),
    },
    {
      titleKey: "gallery_group_horizon",
      images: urlsOrLegacy(window.HORIZON_APARTMENT_IMAGE_URLS, seq("horizon", 24)),
    },
    {
      titleKey: "gallery_group_express",
      images: seq("express", 16, ".jpg"),
    },
    {
      titleKey: "gallery_group_layover",
      images: urlsOrLegacy(window.LAYOVER_STUDIO_IMAGE_URLS, []),
    },
    {
      titleKey: "gallery_group_family",
      images: urlsOrLegacy(window.FAMILY_RESIDENCE_IMAGE_URLS, seq("family", 24)),
    },
  ];
})();
