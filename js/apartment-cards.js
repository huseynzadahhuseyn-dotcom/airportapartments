/**
 * Renders #apartments-grid from window.APARTMENTS_DATA — premium listing cards (large gallery + thumbs, specs, OTA CTAs).
 */
(function () {
  "use strict";

  function normImgUrl(u) {
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function t(key) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key) || "";
    }
    return key;
  }

  function altKeyFor(apt, slideIndex) {
    if (typeof window.getApartmentSlideAltKey === "function") {
      return window.getApartmentSlideAltKey(apt, slideIndex);
    }
    return "apt_slide_alt_generic_1";
  }

  function slideUrls(apt, pool) {
    if (apt.images && Array.isArray(apt.images) && apt.images.length) {
      return apt.images.slice();
    }
    var out = [];
    var len = pool.length;
    if (!len) return out;
    var count = apt.imgCount || 4;
    var start = apt.imgStart || 0;
    for (var s = 0; s < count; s++) {
      out.push(pool[(start + s) % len]);
    }
    return out;
  }

  function el(tag, cls, attrs) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function wireThumbStrip(art) {
    var sr = art.querySelector("[data-apt-slider]");
    var strip = art.querySelector(".apt-card-thumb-strip");
    if (!sr || !strip) return;
    sr.addEventListener("apt-slider-changed", function (ev) {
      var idx = ev.detail && ev.detail.index;
      if (typeof idx !== "number") return;
      strip.querySelectorAll(".apt-card-thumb").forEach(function (b, bi) {
        var on = bi === idx;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
    strip.querySelectorAll(".apt-card-thumb").forEach(function (btn, ti) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        sr.dispatchEvent(new CustomEvent("apt-slider-goto", { detail: { index: ti } }));
      });
    });
  }

  function buildApartmentCards(grid, data) {
    if (!grid || !data || !data.length) return;
    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    grid.textContent = "";
    grid.setAttribute("role", "list");

    data.forEach(function (apt) {
      var urls = slideUrls(apt, pool);
      if (!urls.length) return;

      var art = el(
        "article",
        "apt-card apt-card--listing" + (apt.premium ? " apt-card--listing-premium" : "")
      );
      art.setAttribute("role", "listitem");
      art.setAttribute("data-apt-id", apt.id);
      art.setAttribute("data-apt-gallery", urls.join("|"));

      var badge = el("span", "apt-card-badge" + (apt.premium ? " apt-card-badge--gold" : ""));
      badge.setAttribute("data-i18n", apt.premium ? "apt_badge_featured" : "apt_badge_popular");
      art.appendChild(badge);

      var mediaShell = el("div", "apt-card-media-shell");

      var sliderRoot = el(
        "div",
        "apt-card-slider" + (urls.length < 2 ? " apt-card-slider--single" : "")
      );
      sliderRoot.setAttribute("data-apt-slider", "");
      sliderRoot.setAttribute("tabindex", "0");
      sliderRoot.setAttribute(
        "data-apt-detail-href",
        "apartment-detail.html?apt=" + encodeURIComponent(apt.id)
      );

      var viewport = el("div", "apt-slider-viewport");
      var track = el("div", "apt-slider-track apt-slider-track--smooth");

      urls.forEach(function (url, si) {
        var slide = el("div", "apt-slider-slide");
        var img = el("img", "apt-slider-img", {
          src: normImgUrl(url),
          alt: t(altKeyFor(apt, si)),
          loading: si === 0 ? "eager" : "lazy",
          decoding: "async",
        });
        if (si === 0) img.setAttribute("fetchpriority", "high");
        slide.appendChild(img);
        track.appendChild(slide);
      });

      viewport.appendChild(track);
      sliderRoot.appendChild(viewport);

      if (urls.length > 1) {
        sliderRoot.appendChild(
          el("button", "apt-slider-nav apt-slider-prev", {
            type: "button",
            "data-i18n-aria-label": "slider_prev",
          })
        );
        sliderRoot.appendChild(
          el("button", "apt-slider-nav apt-slider-next", {
            type: "button",
            "data-i18n-aria-label": "slider_next",
          })
        );
      }

      var viewPhotos = el("button", "apt-card-view-photos", {
        type: "button",
        "data-i18n": "apt_card_view_photos",
      });
      viewPhotos.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var raw = art.getAttribute("data-apt-gallery") || "";
        var galleryUrls = raw.split("|").filter(Boolean);
        if (!galleryUrls.length || typeof window.openComfortImageLightbox !== "function") return;
        var aptRef = apt;
        var sliderEl = art.querySelector("[data-apt-slider]");
        var startIdx = 0;
        if (sliderEl) {
          var thumbs = sliderEl.parentElement && sliderEl.parentElement.querySelector(".apt-card-thumb-strip");
          if (thumbs) {
            var tb = thumbs.querySelectorAll(".apt-card-thumb");
            for (var di = 0; di < tb.length; di++) {
              if (tb[di].classList.contains("is-active")) {
                startIdx = di;
                break;
              }
            }
          }
        }
        var elements = galleryUrls.map(function (url, si) {
          return {
            href: normImgUrl(url),
            type: "image",
            alt: t(altKeyFor(aptRef, si)),
          };
        });
        window.openComfortImageLightbox(elements, startIdx);
      });
      sliderRoot.appendChild(viewPhotos);

      mediaShell.appendChild(sliderRoot);

      if (urls.length > 1) {
        var strip = el("div", "apt-card-thumb-strip");
        strip.setAttribute("role", "tablist");
        strip.setAttribute("aria-label", t("apt_card_thumbs_a11y"));
        urls.forEach(function (url, ti) {
          var tb = el("button", "apt-card-thumb" + (ti === 0 ? " is-active" : ""), {
            type: "button",
          });
          tb.setAttribute("role", "tab");
          tb.setAttribute("aria-selected", ti === 0 ? "true" : "false");
          tb.setAttribute(
            "aria-label",
            t("tour_slider_goto", { n: ti + 1, total: urls.length })
          );
          var tim = el("img", "apt-card-thumb-img", {
            src: normImgUrl(url),
            alt: "",
            loading: "lazy",
            decoding: "async",
          });
          tb.appendChild(tim);
          strip.appendChild(tb);
        });
        mediaShell.appendChild(strip);
      }

      art.appendChild(mediaShell);

      var body = el("div", "apt-card-body apt-card-body--listing");

      body.appendChild(el("h3", "apt-card-title apt-card-title--listing", { "data-i18n": apt.titleKey }));

      body.appendChild(el("p", "apt-card-desc apt-card-desc--listing", { "data-i18n": apt.blurbKey }));

      var specs = el("div", "apt-card-specs");

      var specGuests = el("span", "apt-card-spec");
      specGuests.appendChild(el("span", "apt-card-spec-ic", { "aria-hidden": "true", text: "👥" }));
      var gEl = el("span", "apt-card-spec-text");
      gEl.setAttribute("data-i18n", apt.guestsKey);
      specGuests.appendChild(gEl);
      specs.appendChild(specGuests);

      var specDist = el("span", "apt-card-spec");
      specDist.appendChild(el("span", "apt-card-spec-ic", { "aria-hidden": "true", text: "✈️" }));
      var dEl = el("span", "apt-card-spec-text");
      dEl.setAttribute("data-i18n", apt.cardDistanceKey || "apt_airport_dist_generic");
      specDist.appendChild(dEl);
      specs.appendChild(specDist);

      var specType = el("span", "apt-card-spec");
      specType.appendChild(el("span", "apt-card-spec-ic", { "aria-hidden": "true", text: "🏠" }));
      var tEl = el("span", "apt-card-spec-text");
      tEl.setAttribute("data-i18n", apt.typeKey || "apt_card_type_generic");
      specType.appendChild(tEl);
      specs.appendChild(specType);

      var specPrice = el("span", "apt-card-spec apt-card-spec--price");
      specPrice.appendChild(el("span", "apt-card-spec-ic", { "aria-hidden": "true", text: "💰" }));
      if (apt.cardPriceOnRequest) {
        var pr = el("span", "apt-card-spec-text");
        pr.setAttribute("data-i18n", "price_on_request");
        specPrice.appendChild(pr);
      } else {
        var pv = el("span", "apt-card-spec-price-inner");
        pv.innerHTML =
          '<span class="apt-price-cur" data-i18n="price_from"></span> <span class="apt-price-num">' +
          apt.priceFrom +
          '</span> <span class="apt-price-cur" data-i18n="currency_azn"></span> <span class="apt-price-per apt-card-spec-per" data-i18n="price_per_night"></span>';
        specPrice.appendChild(pv);
      }
      specs.appendChild(specPrice);

      body.appendChild(specs);

      var bookingUrl = (apt.cardBookingUrl || "").trim();
      var airbnbUrl = (apt.cardAirbnbUrl || "").trim();
      var tgUrl = (apt.cardTelegramUrl || "https://t.me/apartamentnearbaku").trim();

      var ctaPanel = el("div", "apt-card-cta-panel");
      ctaPanel.setAttribute("data-i18n-aria-label", apt.otaAriaKey || "apt_card_cta_group_a11y");

      if (bookingUrl) {
        ctaPanel.appendChild(
          el("a", "apt-card-cta apt-card-cta--block apt-card-cta--booking", {
            href: bookingUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-i18n": "apt_btn_book_booking",
          })
        );
      } else {
        var sb = el("span", "apt-card-cta apt-card-cta--block apt-card-cta--disabled", {
          "aria-disabled": "true",
          "data-i18n": "apt_cta_unavailable",
        });
        ctaPanel.appendChild(sb);
      }

      if (airbnbUrl) {
        ctaPanel.appendChild(
          el("a", "apt-card-cta apt-card-cta--block apt-card-cta--airbnb", {
            href: airbnbUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-i18n": "apt_btn_book_airbnb",
          })
        );
      } else {
        ctaPanel.appendChild(
          el("span", "apt-card-cta apt-card-cta--block apt-card-cta--disabled", {
            "aria-disabled": "true",
            "data-i18n": "apt_cta_unavailable",
          })
        );
      }

      ctaPanel.appendChild(
        el("a", "apt-card-cta apt-card-cta--block apt-card-cta--whatsapp", {
          href: "#",
          target: "_blank",
          rel: "noopener noreferrer",
          "data-wa-prefill": "",
          "data-wa-suffix-key": apt.waSuffixKey,
          "data-i18n": "apt_btn_reserve_whatsapp",
        })
      );

      ctaPanel.appendChild(
        el("a", "apt-card-cta apt-card-cta--block apt-card-cta--telegram", {
          href: tgUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          "data-i18n": "apt_btn_reserve_telegram",
        })
      );

      body.appendChild(ctaPanel);

      body.appendChild(
        el("p", "apt-card-footnote", { "data-i18n": "apt_wa_reply_hint" })
      );

      body.appendChild(
        el("a", "apt-card-details-link apt-card-details-link--listing", {
          href: "apartment-detail.html?apt=" + encodeURIComponent(apt.id),
          "data-i18n": "view_details",
        })
      );

      art.appendChild(body);
      grid.appendChild(art);
      wireThumbStrip(art);
    });

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(grid);
    }

    if (typeof window.initApartmentSliders === "function") {
      window.initApartmentSliders();
    }
  }

  function renderFallback(grid) {
    if (grid.children.length) return;
    var p = document.createElement("p");
    p.className = "apartments-fallback";
    p.style.cssText = "text-align:center;margin:1rem 0;";
    var a = document.createElement("a");
    a.href = "index.html#apartments";
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
    if (data && Array.isArray(data) && data.length) {
      buildApartmentCards(grid, data);
      return;
    }
    renderFallback(grid);
  }

  window.buildApartmentCards = buildApartmentCards;

  window.addEventListener("i18n:applied", tryRender);
})();
