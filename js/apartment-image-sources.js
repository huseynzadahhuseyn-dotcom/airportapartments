/**
 * Apartment + gallery photos: use real files under /images/* (sync from public/images/) or direct HTTPS URLs.
 *
 * - "local": src is /images/cozy-01.jpg etc. (add files, then run: node scripts/sync-public-images.js)
 * - "remote": curated direct Unsplash CDN URLs (not postimg pages) so the site works before files exist
 *
 * `/images/apartments/…`: in **remote** mode, Unsplash previews are used until you add files; set **local** (or
 * `SITE_APARTMENT_IMAGE_STRATEGY_INIT`) to serve only real files from `public/images/apartments/` after sync.
 */
(function () {
  "use strict";

  var STRATEGY = "remote";
  if (typeof window !== "undefined" && window.SITE_APARTMENT_IMAGE_STRATEGY_INIT) {
    var init = String(window.SITE_APARTMENT_IMAGE_STRATEGY_INIT).toLowerCase();
    if (init === "local" || init === "remote") STRATEGY = init;
  }

  var PARAMS = "?auto=format&fit=crop&w=1600&q=82";

  /** Direct image URLs only (Unsplash CDN). Rotated by listing + index for variety. */
  var POOL = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" + PARAMS,
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" + PARAMS,
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" + PARAMS,
    "https://images.unsplash.com/photo-1484154218962-a197022b5858" + PARAMS,
    "https://images.unsplash.com/photo-1554995207-c18c203602cb" + PARAMS,
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" + PARAMS,
    "https://images.unsplash.com/photo-1560185893-a8d9366a4890" + PARAMS,
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0" + PARAMS,
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221" + PARAMS,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" + PARAMS,
    "https://images.unsplash.com/photo-1600566753190-9aa6c8c8218c" + PARAMS,
    "https://images.unsplash.com/photo-1600573472550-8090bdc5bab9" + PARAMS,
    "https://images.unsplash.com/photo-1512918728675-ac5fa6b613d1" + PARAMS,
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb" + PARAMS,
    "https://images.unsplash.com/photo-1600210492493-0946911123ea" + PARAMS,
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" + PARAMS,
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f" + PARAMS,
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf" + PARAMS,
    "https://images.unsplash.com/photo-1600566752229-9fed0aac48dc" + PARAMS,
    "https://images.unsplash.com/photo-1502005229762-fac1e0c115d7" + PARAMS,
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea" + PARAMS,
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d" + PARAMS,
    "https://images.unsplash.com/photo-1556912172-45b7abe8a7e1" + PARAMS,
    "https://images.unsplash.com/photo-1600607688969-a5d15d9f6c59" + PARAMS,
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36" + PARAMS,
    "https://images.unsplash.com/photo-1600585154087-f47f5faa0dd6" + PARAMS,
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0" + PARAMS,
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea" + PARAMS,
    "https://images.unsplash.com/photo-1600573472592-ee6b68d14c68" + PARAMS,
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde" + PARAMS,
    "https://images.unsplash.com/photo-1600047509358-9dc75507daeb" + PARAMS,
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" + PARAMS,
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" + PARAMS,
  ];

  var LISTING_SEED = { cozy: 0, premium: 9, bina: 13, horizon: 2 };

  function basename(path) {
    if (typeof path !== "string") return "";
    var s = path.replace(/\\/g, "/");
    var i = s.lastIndexOf("/");
    return i >= 0 ? s.slice(i + 1) : s;
  }

  function poolIndexForFilename(filename) {
    var name = basename(filename);
    var m = name.match(/^([a-z]+)-(\d+)\./i);
    var listing = m ? m[1].toLowerCase() : "";
    var n = m ? parseInt(m[2], 10) : 0;
    var seed = LISTING_SEED.hasOwnProperty(listing) ? LISTING_SEED[listing] : 0;
    var slot = seed * 17 + (n || 0) * 3 + name.length;
    return POOL.length ? slot % POOL.length : 0;
  }

  /** e.g. /images/apartments/cozy/7.jpg → stable pool slot (remote preview until real files exist). */
  function poolIndexForApartmentsPath(p) {
    var m = String(p).match(/\/images\/apartments\/([a-z0-9]+)\/(\d+)\./i);
    if (!m) return 0;
    var folder = m[1].toLowerCase();
    var n = parseInt(m[2], 10) || 0;
    var seed = Object.prototype.hasOwnProperty.call(LISTING_SEED, folder) ? LISTING_SEED[folder] : 5;
    var slot = seed * 37 + n * 7 + folder.length * 3;
    return POOL.length ? slot % POOL.length : 0;
  }

  function resolveListingImageUrl(path) {
    if (path == null || path === "") return path;
    var p = String(path).trim();
    if (p.indexOf("/images/apartments/") === 0) {
      var normalized = p;
      if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
        normalized = window.AptImageUtils.normalizeSiteImageUrl(p);
      } else if (p.indexOf("/") !== 0) {
        normalized = "/images/" + p.replace(/^\/+/, "");
      }
      if (STRATEGY === "local") {
        return normalized;
      }
      return POOL[poolIndexForApartmentsPath(p)];
    }
    if (/^https?:\/\//i.test(p)) {
      if (/postimg\.cc\//i.test(p) && !/i\.postimg\.cc\//i.test(p)) {
        console.warn(
          "[apartment-image-sources] Blocked non-direct postimg page URL; use /images/… or i.postimg.cc direct link:",
          p
        );
        return POOL[0];
      }
      return p;
    }
    if (STRATEGY === "local") {
      if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
        return window.AptImageUtils.normalizeSiteImageUrl(p);
      }
      return p.indexOf("/") === 0 ? p : "/images/" + p;
    }
    return POOL[poolIndexForFilename(basename(p))];
  }

  window.SITE_APARTMENT_IMAGE_STRATEGY = STRATEGY;
  window.resolveListingImageUrl = resolveListingImageUrl;
})();
