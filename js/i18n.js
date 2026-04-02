/**
 * Loads locales/*.json, applies data-i18n / data-i18n-html / aria / title / img alt,
 * updates document title & meta, dispatches i18n:applied for dependent modules.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site_lang";
  var SUPPORTED = ["en", "ru", "az"];
  var DEFAULT_LANG = "en";

  var bundle = null;
  var currentLang = DEFAULT_LANG;

  function getLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED.indexOf(s) !== -1) return s;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    document.documentElement.lang = lang;
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

    var localeMap = { en: "en_US", ru: "ru_RU", az: "az_AZ" };
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
    });
  }

  function applyAll() {
    applyToRoot(document);
    applyMeta();
    updateLangButtons();
    document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang: currentLang } }));
  }

  function loadBundle(lang) {
    var url = "locales/" + lang + ".json";
    return fetch(url, { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("locale " + lang);
        return r.json();
      })
      .then(function (json) {
        bundle = json;
        setLang(lang);
        applyAll();
      })
      .catch(function () {
        if (lang !== DEFAULT_LANG) return loadBundle(DEFAULT_LANG);
        bundle = {};
        applyAll();
      });
  }

  function initLangSwitchers() {
    document.querySelectorAll(".lang-btn[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var l = btn.getAttribute("data-set-lang");
        if (!l || l === currentLang) return;
        loadBundle(l);
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
