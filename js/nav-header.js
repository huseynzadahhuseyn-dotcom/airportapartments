/**
 * Mobile nav: Additional Services dropdown toggle; close drawer after following a link.
 * Desktop dropdown uses CSS :hover / :focus-within; mobile uses .is-open on the <li>.
 */
(function () {
  "use strict";

  var MQ_MOBILE_NAV = "(max-width: 860px)";

  function init() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    var dropdownBtn = document.getElementById("nav-additional-btn");
    var dropdownLi = dropdownBtn ? dropdownBtn.closest(".nav-item-has-dropdown") : null;

    function closeMobileDrawer() {
      if (toggle) toggle.checked = false;
    }

    function closeDropdown() {
      if (dropdownLi) {
        dropdownLi.classList.remove("is-open");
        if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
      }
    }

    if (dropdownBtn && dropdownLi) {
      dropdownBtn.addEventListener("click", function (e) {
        if (!window.matchMedia(MQ_MOBILE_NAV).matches) return;
        e.stopPropagation();
        var opening = !dropdownLi.classList.contains("is-open");
        document.querySelectorAll(".nav-item-has-dropdown.is-open").forEach(function (li) {
          if (li !== dropdownLi) {
            li.classList.remove("is-open");
            var b = li.querySelector(".nav-dropdown__btn");
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });
        dropdownLi.classList.toggle("is-open", opening);
        dropdownBtn.setAttribute("aria-expanded", opening ? "true" : "false");
      });
    }

    document.addEventListener("click", function (e) {
      if (dropdownLi && !dropdownLi.contains(e.target)) {
        closeDropdown();
      }
    });

    if (nav && toggle) {
      nav.addEventListener("click", function (e) {
        var a = e.target.closest("a[href]");
        if (!a) return;
        var href = (a.getAttribute("href") || "").trim();
        if (!href || href === "#" || href.indexOf("javascript:") === 0) return;
        closeDropdown();
        if (window.matchMedia(MQ_MOBILE_NAV).matches) {
          closeMobileDrawer();
        }
      });
    }

    window.addEventListener("resize", function () {
      if (!window.matchMedia(MQ_MOBILE_NAV).matches) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      closeDropdown();
      if (toggle && toggle.checked) toggle.checked = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
