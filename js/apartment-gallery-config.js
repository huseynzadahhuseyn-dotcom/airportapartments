/**
 * Homepage #gallery — single group from `SITE_HOMEPAGE_GALLERY_IMAGE_URLS` only
 * (`js/site-homepage-gallery-images.js`). No per-listing merge or /images fallbacks.
 */
(function () {
  "use strict";

  var urls =
    Array.isArray(window.SITE_HOMEPAGE_GALLERY_IMAGE_URLS) && window.SITE_HOMEPAGE_GALLERY_IMAGE_URLS.length
      ? window.SITE_HOMEPAGE_GALLERY_IMAGE_URLS.slice()
      : [];

  window.SITE_GALLERY_GROUPS = urls.length
    ? [
        {
          titleKey: "gallery_group_site",
          images: urls,
        },
      ]
    : [];
})();
