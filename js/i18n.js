/**
 * Loads locales/*.json, applies data-i18n / data-i18n-html / aria / title / img alt,
 * updates document title & meta, runs `window.__i18nDomHydrators`, then dispatches i18n:applied.
 *
 * Locales: en (base), az, tr, ar — non-English bundles merge over en.json for missing keys.
 * Arabic (ar) sets document dir=rtl; others use dir=ltr.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site_lang";
  var SUPPORTED = ["en", "az", "tr", "ar"];
  var DEFAULT_LANG = "en";

  var bundle = null;
  var currentLang = DEFAULT_LANG;

  function normalizeStoredLang(code) {
    if (!code || typeof code !== "string") return DEFAULT_LANG;
    var s = code.trim().toLowerCase();
    if (s === "ru") return DEFAULT_LANG;
    if (SUPPORTED.indexOf(s) !== -1) return s;
    return DEFAULT_LANG;
  }

  function getLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        var raw = String(s).trim().toLowerCase();
        var n = normalizeStoredLang(s);
        if (n !== raw) {
          try {
            localStorage.setItem(STORAGE_KEY, n);
          } catch (e2) {}
        }
        return n;
      }
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    var l = normalizeStoredLang(lang);
    if (SUPPORTED.indexOf(l) === -1) l = DEFAULT_LANG;
    currentLang = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (e) {}
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  }

  function interpolate(str, vars) {
    if (!str || !vars) return str;
    return String(str).replace(/\{(\w+)\}/g, function (_, k) {
      return vars[k] != null ? String(vars[k]) : "";
    });
  }

  function t(key, vars) {
    if (!bundle || !key) return "";
    var raw = bundle[key];
    if (raw == null) return key;
    return interpolate(String(raw), vars);
  }

  function applyMeta() {
    var html = document.documentElement;
    var titleKey = html.getAttribute("data-i18n-page-title") || "page_title";
    var metaKey = html.getAttribute("data-i18n-meta-description") || "meta_description";

    var titleEl = document.getElementById("page-title");
    if (titleEl) titleEl.textContent = t(titleKey);

    var md = document.getElementById("meta-description");
    if (md) md.setAttribute("content", t(metaKey));

    var base = window.location.href.split("#")[0];
    var ogTitle = t(titleKey);
    var ogDesc = t(metaKey);

    function setMeta(id, attr, val) {
      var el = document.getElementById(id);
      if (el && val) el.setAttribute(attr, val);
    }

    setMeta("og-title", "content", ogTitle);
    setMeta("og-desc", "content", ogDesc);
    setMeta("og-url", "content", base);
    setMeta("tw-title", "content", ogTitle);
    setMeta("tw-desc", "content", ogDesc);

    var siteName = document.getElementById("og-site-name");
    if (siteName) siteName.setAttribute("content", t("logo_text_fallback") || "Airport Apartments");

    var ogImg = document.getElementById("og-image");
    if (ogImg && !ogImg.getAttribute("content")) {
      ogImg.setAttribute("content", base.replace(/\/$/, "") + "/images/logo.svg");
    }
    var twImg = document.getElementById("tw-image");
    if (twImg && !twImg.getAttribute("content")) {
      twImg.setAttribute("content", base.replace(/\/$/, "") + "/images/logo.svg");
    }

    var localeMap = { en: "en_US", az: "az_AZ", tr: "tr_TR", ar: "ar_AE" };
    var ogLoc = document.getElementById("og-locale");
    if (ogLoc) ogLoc.setAttribute("content", localeMap[currentLang] || "en_US");
  }

  function applyToRoot(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var val = t(key);
      if (el.tagName === "IMG") {
        el.setAttribute("alt", val);
        return;
      }
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    scope.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (key) el.setAttribute("aria-label", t(key));
    });

    scope.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });

    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
  }

  function updateLangButtons() {
    document.querySelectorAll(".lang-btn[data-set-lang]").forEach(function (btn) {
      var l = btn.getAttribute("data-set-lang");
      var on = l === currentLang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("lang-btn-active", on);
    });
  }

  function applyAll() {
    applyToRoot(document);
    applyMeta();
    updateLangButtons();
    var hydrators = window.__i18nDomHydrators;
    if (Array.isArray(hydrators) && hydrators.length) {
      for (var hi = 0; hi < hydrators.length; hi++) {
        try {
          hydrators[hi]();
        } catch (e) {}
      }
    }
    window.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang: currentLang } }));
  }

  function loadBundle(lang) {
    var target = normalizeStoredLang(lang);
    if (SUPPORTED.indexOf(target) === -1) target = DEFAULT_LANG;

    function finish(enBase, overlay) {
      bundle = Object.assign({}, enBase || {}, overlay || {});
      setLang(target);
      applyAll();
    }

    return fetch("locales/en.json", { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("en");
        return r.json();
      })
      .then(function (enBase) {
        if (target === "en") {
          finish(enBase, {});
          return;
        }
        return fetch("locales/" + target + ".json", { credentials: "same-origin" })
          .then(function (r) {
            if (!r.ok) throw new Error(target);
            return r.json();
          })
          .then(function (loc) {
            finish(enBase, loc);
          })
          .catch(function () {
            finish(enBase, {});
          });
      })
      .catch(function () {
        bundle = {};
        setLang(DEFAULT_LANG);
        applyAll();
      });
  }

  function initLangSwitchers() {
    document.querySelectorAll(".lang-btn[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var l = btn.getAttribute("data-set-lang");
        if (!l) return;
        var next = normalizeStoredLang(l);
        if (next === currentLang) return;
        loadBundle(next);
      });
    });
  }

  window.I18N = {
    t: t,
    apply: function (root) {
      applyToRoot(root || document);
    },
    getLang: function () {
      return currentLang;
    },
    setLang: loadBundle,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitchers();
    loadBundle(getLang());
  });
})();
