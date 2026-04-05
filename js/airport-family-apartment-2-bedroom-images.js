/**
 * Family Apartment Near Baku Airport (GYD) — listing `airport-family-apartment-2-bedroom` only.
 * First image: primary interior (WhatsApp). Remaining URLs preserve full gallery for cards + detail.
 */
(function () {
  "use strict";

  var COVER_FIRST =
    "https://i.postimg.cc/pVYJxtrz/Whats-App-Image-2025-09-05-at-09-08-23-5b1ceb90.jpg";

  var REST = [
    "https://i.postimg.cc/c1MBZNCq/555f64cc-0f41-4e14-a943-9a9a5aa5b569.jpg",
    "https://i.postimg.cc/9Mytr6pH/072fd3ac-528d-40ac-9d0a-c259be5d5e80.jpg",
    "https://i.postimg.cc/wxcQHdMY/c1dc9d24-e192-44e8-932f-41bb707ae16c.jpg",
    "https://i.postimg.cc/Xq8fg9mD/ca0770f9-33c1-4039-8a8a-14db83748bc9.jpg",
    "https://i.postimg.cc/CMHsYV5T/ca5dc021-bb2b-45ad-a3d1-dc171c9a7051.jpg",
    "https://i.postimg.cc/mZNyRGkk/Chat-GPT-Image-Mar-28-2026-01-39-54-PM.png",
    "https://i.postimg.cc/c1MBZNC7/Chat-GPT-Image-Mar-28-2026-01-44-12-PM.png",
    "https://i.postimg.cc/66LfwNqr/Chat-GPT-Image-Mar-28-2026-01-45-43-PM.png",
    "https://i.postimg.cc/yY1X8r3S/Whats-App-Image-2025-09-05-at-09-08-23-b9cad2fe.jpg",
    "https://i.postimg.cc/J4rczdHk/Whats-App-Image-2025-09-05-at-09-08-23-e0db3e5a.jpg",
    "https://i.postimg.cc/sDj9g0Gp/Whats-App-Image-2025-09-05-at-09-08-24-44cdb765.jpg",
    "https://i.postimg.cc/L69B80gt/Whats-App-Image-2025-09-05-at-09-08-24-a0feaf1d.jpg",
    "https://i.postimg.cc/jdxQSkn6/Whats-App-Image-2025-09-05-at-09-08-24-ace2b816.jpg",
    "https://i.postimg.cc/SNS7xtYf/Whats-App-Image-2025-09-05-at-09-08-24-e86066ea.jpg",
    "https://i.postimg.cc/zXzSGPH7/Whats-App-Image-2025-09-05-at-09-08-25-3a47c1e5.jpg",
    "https://i.postimg.cc/15mc3YVK/Whats-App-Image-2025-09-05-at-09-08-25-8012de7d.jpg",
  ];

  var out = [COVER_FIRST];
  for (var i = 0; i < REST.length; i++) {
    if (REST[i] !== COVER_FIRST) out.push(REST[i]);
  }

  window.AIRPORT_FAMILY_APARTMENT_2_BEDROOM_IMAGE_URLS = out;
})();
