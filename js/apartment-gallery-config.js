/**
 * Homepage #gallery: `/images/apartments/<folder>/1.jpg`, `2.jpg`, …
 * Edit counts or `images` arrays when you add files. `titleKey` → locales `gallery_group_*`.
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

  window.SITE_GALLERY_GROUPS = [
    {
      titleKey: "gallery_group_premium",
      images: seq("premium", 24).concat(seq("bina", 24)),
    },
    {
      titleKey: "gallery_group_cozy",
      images: seq("cozy", 24),
    },
    {
      titleKey: "gallery_group_haven",
      images: seq("haven", 24),
    },
    {
      titleKey: "gallery_group_horizon",
      images: seq("horizon", 24),
    },
    {
      titleKey: "gallery_group_express",
      images: seq("express", 16, ".jpg"),
    },
    {
      titleKey: "gallery_group_family",
      images: seq("family", 24),
    },
  ];
})();
