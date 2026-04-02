/**
 * Renders #apartments-grid from window.APARTMENTS_DATA + SITE_GALLERY_IMAGES (`/images/*` paths).
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

  function buildApartmentCards(grid, data) {
    if (!grid || !data || !data.length) return;
    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    grid.textContent = "";
    grid.setAttribute("role", "list");

    data.forEach(function (apt) {
      var urls = slideUrls(apt, pool);
      if (!urls.length) return;

      var art = el("article", "apt-card" + (apt.premium ? " apt-card--premium" : ""));
      art.setAttribute("role", "listitem");
      art.setAttribute("data-apt-id", apt.id);
      art.setAttribute("data-apt-gallery", urls.join("|"));

      if (apt.featured) {
        var badge = el("span", "apt-card-badge");
        badge.setAttribute("data-i18n", "apt_badge_featured");
        art.appendChild(badge);
      }

      var sliderRoot = el("div", "apt-card-slider");
      sliderRoot.setAttribute("data-apt-slider", "");
      sliderRoot.setAttribute("tabindex", "0");
      sliderRoot.setAttribute(
        "data-apt-detail-href",
        "apartment-detail.html?apt=" + encodeURIComponent(apt.id)
      );

      var viewport = el("div", "apt-slider-viewport");
      var track = el("div", "apt-slider-track");

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

      var prevBtn = el("button", "apt-slider-nav apt-slider-prev", {
        type: "button",
        "data-i18n-aria-label": "slider_prev",
      });
      var nextBtn = el("button", "apt-slider-nav apt-slider-next", {
        type: "button",
        "data-i18n-aria-label": "slider_next",
      });
      sliderRoot.appendChild(prevBtn);
      sliderRoot.appendChild(nextBtn);

      var dotsWrap = el("div", "apt-slider-dots");
      urls.forEach(function (_, di) {
        var dot = el("button", "apt-slider-dot" + (di === 0 ? " is-active" : ""), {
          type: "button",
        });
        if (window.I18N && typeof window.I18N.t === "function") {
          dot.setAttribute(
            "aria-label",
            window.I18N.t("tour_slider_goto", { n: di + 1, total: urls.length })
          );
        }
        dotsWrap.appendChild(dot);
      });
      sliderRoot.appendChild(dotsWrap);

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
          var dotList = sliderEl.querySelectorAll(".apt-slider-dot");
          for (var di = 0; di < dotList.length; di++) {
            if (dotList[di].classList.contains("is-active")) {
              startIdx = di;
              break;
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

      art.appendChild(sliderRoot);

      var body = el("div", "apt-card-body");

      var meta = el("div", "apt-card-meta");
      var guests = el("p", "apt-card-guests apt-card-meta-pill");
      guests.appendChild(el("span", "apt-guest-pill", { text: "👥" }));
      guests.appendChild(el("span", "", { "data-i18n": apt.guestsKey }));
      meta.appendChild(guests);

      var dist = el("p", "apt-card-distance apt-card-meta-pill");
      dist.appendChild(el("span", "apt-distance-pill", { text: "✈" }));
      var dspan = document.createElement("span");
      dspan.setAttribute("data-i18n", apt.cardDistanceKey || "apt_airport_dist_generic");
      dist.appendChild(dspan);
      meta.appendChild(dist);
      body.appendChild(meta);

      body.appendChild(el("h3", "", { "data-i18n": apt.titleKey }));

      body.appendChild(el("p", "apt-card-blurb", { "data-i18n": apt.blurbKey }));

      var price = el("p", "apt-card-price");
      if (apt.cardPriceOnRequest) {
        price.setAttribute("data-i18n", "price_on_request");
        price.classList.add("apt-card-price--on-request");
      } else {
        price.innerHTML =
          '<span class="apt-price-cur">' +
          t("price_from") +
          '</span> <span class="apt-price-num">' +
          apt.priceFrom +
          '</span> <span class="apt-price-cur">' +
          t("currency_azn") +
          '</span> <span class="apt-price-per">' +
          t("price_per_night") +
          "</span>";
      }
      body.appendChild(price);

      var ctaGrid = el("div", "apt-card-cta-grid");
      ctaGrid.setAttribute("data-i18n-aria-label", apt.otaAriaKey || "apt_card_cta_group_a11y");

      var bookingUrl = (apt.cardBookingUrl || "").trim();
      if (bookingUrl) {
        ctaGrid.appendChild(
          el("a", "apt-card-cta apt-card-cta--booking", {
            href: bookingUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-i18n": "apt_btn_book_booking",
          })
        );
      }

      var airbnbUrl = (apt.cardAirbnbUrl || "").trim();
      if (airbnbUrl) {
        ctaGrid.appendChild(
          el("a", "apt-card-cta apt-card-cta--airbnb", {
            href: airbnbUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-i18n": "apt_btn_book_airbnb",
          })
        );
      }

      ctaGrid.appendChild(
        el("a", "apt-card-cta apt-card-cta--whatsapp", {
          href: "#",
          target: "_blank",
          rel: "noopener noreferrer",
          "data-wa-prefill": "",
          "data-wa-suffix-key": apt.waSuffixKey,
          "data-i18n": "apt_btn_reserve_whatsapp",
        })
      );

      var tgUrl = (apt.cardTelegramUrl || "https://t.me/apartamentnearbaku").trim();
      ctaGrid.appendChild(
        el("a", "apt-card-cta apt-card-cta--telegram", {
          href: tgUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          "data-i18n": "apt_btn_reserve_telegram",
        })
      );

      body.appendChild(ctaGrid);

      var det = el("a", "apt-card-details-link", {
        href: "apartment-detail.html?apt=" + encodeURIComponent(apt.id),
        "data-i18n": "view_details",
      });
      body.appendChild(det);

      art.appendChild(body);
      grid.appendChild(art);
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
