/**
 * apartment-detail.html?apt=<id> — slider + thumb grid + GLightbox (same image sets as listing cards).
 */
(function () {
  "use strict";

  function normImgUrl(u) {
    if (window.AptImageUtils && typeof window.AptImageUtils.normalizeSiteImageUrl === "function") {
      return window.AptImageUtils.normalizeSiteImageUrl(u);
    }
    return u;
  }

  function t(key, vars) {
    if (window.I18N && typeof window.I18N.t === "function") {
      return window.I18N.t(key, vars) || "";
    }
    return key;
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

  function resolveBookingUrl(apt) {
    return (apt.bookingLink || (apt.ota && apt.ota.booking) || "").trim();
  }

  function findApt(id) {
    var data = []
      .concat(window.APARTMENTS_DATA || [])
      .concat(window.APARTMENTS_BOOKING_EXTRA || []);
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i];
    }
    var simple = window.APARTMENT_CARDS_DATA;
    if (Array.isArray(simple) && typeof window.normalizeApartmentCardEntry === "function") {
      for (var j = 0; j < simple.length; j++) {
        if (String(simple[j].id) === id) {
          return window.normalizeApartmentCardEntry(simple[j]);
        }
      }
    }
    return null;
  }

  function buildSliderMarkup(urls, apt) {
    var wrap = document.createElement("div");
    wrap.className = "apt-card-slider apt-detail-slider apt-detail-slider--hero";
    wrap.setAttribute("data-apt-slider", "");
    wrap.setAttribute("tabindex", "0");

    var viewport = document.createElement("div");
    viewport.className = "apt-slider-viewport";

    var track = document.createElement("div");
    track.className = "apt-slider-track";

    urls.forEach(function (url, si) {
      var slide = document.createElement("div");
      slide.className = "apt-slider-slide";
      var img = document.createElement("img");
      img.className = "apt-slider-img";
      img.src = normImgUrl(url);
      img.alt = apt._plain
        ? (apt.plainTitle ? apt.plainTitle + " — " + (si + 1) : "")
        : typeof window.getApartmentSlideAltKey === "function"
          ? t(window.getApartmentSlideAltKey(apt, si))
          : "";
      img.loading = si === 0 ? "eager" : "lazy";
      img.decoding = "async";
      if (si === 0) img.setAttribute("fetchpriority", "high");
      slide.appendChild(img);
      track.appendChild(slide);
    });

    viewport.appendChild(track);
    wrap.appendChild(viewport);

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "apt-slider-nav apt-slider-prev";
    prevBtn.setAttribute("data-i18n-aria-label", "slider_prev");

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "apt-slider-nav apt-slider-next";
    nextBtn.setAttribute("data-i18n-aria-label", "slider_next");

    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);

    var dotsWrap = document.createElement("div");
    dotsWrap.className = "apt-slider-dots";
    urls.forEach(function (_, di) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "apt-slider-dot" + (di === 0 ? " is-active" : "");
      dot.setAttribute(
        "aria-label",
        t("tour_slider_goto", { n: di + 1, total: urls.length })
      );
      dotsWrap.appendChild(dot);
    });
    wrap.appendChild(dotsWrap);

    return wrap;
  }

  function openLightbox(urls, apt, startAt) {
    if (typeof window.openComfortImageLightbox !== "function") return;
    var elements = urls.map(function (url, i) {
      var alt = apt._plain
        ? (apt.plainTitle ? apt.plainTitle + " — " + (i + 1) : "")
        : typeof window.getApartmentSlideAltKey === "function"
          ? t(window.getApartmentSlideAltKey(apt, i))
          : "";
      return {
        href: normImgUrl(url),
        type: "image",
        alt: alt,
      };
    });
    window.openComfortImageLightbox(
      elements,
      Math.max(0, Math.min(startAt || 0, elements.length - 1))
    );
  }

  function buildThumbs(urls, apt, sliderHost) {
    var grid = document.createElement("div");
    grid.className = "apt-detail-thumb-grid";
    urls.forEach(function (url, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "apt-detail-thumb" + (i === 0 ? " is-active" : "");
      var alt = apt._plain
        ? (apt.plainTitle ? apt.plainTitle + " — " + (i + 1) : "")
        : typeof window.getApartmentSlideAltKey === "function"
          ? t(window.getApartmentSlideAltKey(apt, i))
          : "";
      btn.setAttribute(
        "aria-label",
        alt + " — " + t("gallery_open_full_set_a11y")
      );
      var img = document.createElement("img");
      img.src = normImgUrl(url);
      img.alt = alt;
      img.loading = i < 4 ? "eager" : "lazy";
      img.decoding = "async";
      img.className = "apt-detail-thumb-img";
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        var slider = sliderHost && sliderHost.querySelector("[data-apt-slider]");
        if (slider) {
          slider.dispatchEvent(
            new CustomEvent("apt-slider-goto", { detail: { index: i } })
          );
        }
        openLightbox(urls, apt, i);
      });
      grid.appendChild(btn);
    });
    return grid;
  }

  function wireThumbSliderSync(sliderHost, thumbsHost) {
    if (!sliderHost || !thumbsHost) return;
    var slider = sliderHost.querySelector("[data-apt-slider]");
    var thumbs = thumbsHost.querySelectorAll(".apt-detail-thumb");
    if (!slider || !thumbs.length) return;
    function setThumbActive(idx) {
      thumbs.forEach(function (tb, ti) {
        tb.classList.toggle("is-active", ti === idx);
      });
    }
    slider.addEventListener("apt-slider-changed", function (ev) {
      var idx = ev.detail && ev.detail.index;
      if (typeof idx !== "number") return;
      setThumbActive(idx);
    });
    var dots = slider.querySelectorAll(".apt-slider-dot");
    var initial = 0;
    dots.forEach(function (d, di) {
      if (d.classList.contains("is-active")) initial = di;
    });
    setThumbActive(initial);
  }

  function render() {
    var params = new URLSearchParams(window.location.search);
    var id = (params.get("apt") || "").trim();
    var errEl = document.getElementById("apt-detail-error");
    var contentEl = document.getElementById("apt-detail-content");
    var titleEl = document.getElementById("apt-detail-title");
    var descEl = document.getElementById("apt-detail-desc");
    var priceEl = document.getElementById("apt-detail-price");
    var sliderHost = document.getElementById("apt-detail-slider-host");
    var thumbsHost = document.getElementById("apt-detail-thumbs-host");
    var otaHost = document.getElementById("apt-detail-ota-host");
    var waBtn = document.getElementById("apt-detail-wa");

    if (!contentEl || !errEl) return;

    var apt = id ? findApt(id) : null;
    if (!apt) {
      errEl.hidden = false;
      contentEl.hidden = true;
      if (window.I18N && typeof window.I18N.apply === "function") {
        window.I18N.apply(errEl);
      }
      return;
    }

    var pool = window.SITE_GALLERY_IMAGES || window.POSTIMG_GALLERY_IMAGES || [];
    var urls = slideUrls(apt, pool);
    if (!urls.length) {
      errEl.hidden = false;
      contentEl.hidden = true;
      if (window.I18N && typeof window.I18N.apply === "function") {
        window.I18N.apply(errEl);
      }
      return;
    }

    errEl.hidden = true;
    contentEl.hidden = false;

    if (apt._plain) {
      if (titleEl) {
        titleEl.removeAttribute("data-i18n");
        titleEl.textContent = apt.plainTitle;
      }
      if (descEl) {
        descEl.removeAttribute("data-i18n");
        descEl.textContent = apt.plainDesc;
      }
      if (priceEl) {
        priceEl.textContent = apt.plainPrice;
      }
    } else {
      if (titleEl) {
        titleEl.setAttribute("data-i18n", apt.titleKey);
      }
      if (descEl) {
        descEl.setAttribute("data-i18n", "apt_detail_desc_" + apt.id);
      }
      if (priceEl) {
        priceEl.innerHTML =
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
    }

    if (sliderHost) {
      sliderHost.textContent = "";
      sliderHost.appendChild(buildSliderMarkup(urls, apt));
    }

    if (thumbsHost) {
      thumbsHost.textContent = "";
      thumbsHost.appendChild(buildThumbs(urls, apt, sliderHost));
    }

    if (otaHost) {
      otaHost.textContent = "";
      var hasBooking = apt._plain ? !!apt.cardBookingUrl : !!resolveBookingUrl(apt);
      var hasAirbnb = apt._plain ? !!apt.cardAirbnbUrl : !!(apt.ota && apt.ota.airbnb);
      if (hasBooking || hasAirbnb) {
        var ota = document.createElement("div");
        ota.className =
          "apt-detail-ota apt-card-actions--ota" +
          (hasBooking !== hasAirbnb ? " apt-card-actions--ota--single" : "");
        if (apt.otaAriaKey) ota.setAttribute("data-i18n-aria-label", apt.otaAriaKey);
        if (hasBooking) {
          var bk = document.createElement("a");
          bk.className = "btn btn-ota btn-booking";
          bk.href = apt._plain ? apt.cardBookingUrl : resolveBookingUrl(apt);
          bk.target = "_blank";
          bk.rel = "noopener noreferrer";
          bk.setAttribute("data-i18n", "book_on_booking_com");
          ota.appendChild(bk);
        }
        if (hasAirbnb) {
          var ab = document.createElement("a");
          ab.className = "btn btn-ota btn-airbnb-ota";
          ab.href = apt._plain ? apt.cardAirbnbUrl : apt.ota.airbnb;
          ab.target = "_blank";
          ab.rel = "noopener noreferrer";
          ab.setAttribute("data-i18n", "brand_airbnb");
          ota.appendChild(ab);
        }
        otaHost.appendChild(ota);
      }
    }

    if (waBtn) {
      waBtn.removeAttribute("data-wa-suffix-key");
      waBtn.removeAttribute("data-wa-body");
      if (apt._plain) {
        if (apt.whatsappIsUrl) {
          waBtn.setAttribute("href", apt.whatsappRaw);
          waBtn.removeAttribute("data-wa-prefill");
        } else {
          waBtn.setAttribute("href", "#");
          waBtn.setAttribute("data-wa-prefill", "");
          if (apt.waMessage) waBtn.setAttribute("data-wa-body", apt.waMessage);
          if (apt.waSuffixKey) waBtn.setAttribute("data-wa-suffix-key", apt.waSuffixKey);
        }
      } else {
        waBtn.setAttribute("href", "#");
        waBtn.setAttribute("data-wa-prefill", "");
        if (apt.waSuffixKey) waBtn.setAttribute("data-wa-suffix-key", apt.waSuffixKey);
      }
    }

    var pt = document.getElementById("page-title");
    if (apt._plain) {
      document.title = apt.plainTitle || id;
      if (pt) pt.textContent = document.title;
    } else {
      var docTitle = t("apartment_page_title", { name: t(apt.titleKey) });
      document.title = docTitle;
      if (pt) pt.textContent = docTitle;
    }

    if (window.I18N && typeof window.I18N.apply === "function") {
      window.I18N.apply(contentEl);
    }

    if (typeof window.initApartmentSliders === "function") {
      window.initApartmentSliders();
    }
    wireThumbSliderSync(sliderHost, thumbsHost);
  }

  window.addEventListener("i18n:applied", render);
})();
