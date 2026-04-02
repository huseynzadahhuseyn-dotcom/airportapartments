#!/usr/bin/env node
/**
 * Download the same Unsplash URLs used in remote mode into public/images/
 * (filenames: cozy-01.jpg, haven-01.jpg, …). Then:
 *   1. Set STRATEGY to "local" in js/apartment-image-sources.js (or SITE_APARTMENT_IMAGE_STRATEGY_INIT in HTML).
 *   2. Run: node scripts/sync-public-images.js
 *
 * Keep POOL / LISTING_SEED in sync with js/apartment-image-sources.js.
 */
const fs = require("fs");
const https = require("https");
const path = require("path");
const { URL } = require("url");

const PARAMS = "?auto=format&fit=crop&w=1600&q=82";
const POOL = [
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

const LISTING_SEED = { cozy: 0, haven: 4, premium: 9, horizon: 2, express: 6, family: 11 };

function poolIndexForFilename(name) {
  const m = name.match(/^([a-z]+)-(\d+)\./i);
  const listing = m ? m[1].toLowerCase() : "";
  const n = m ? parseInt(m[2], 10) : 0;
  const seed = Object.prototype.hasOwnProperty.call(LISTING_SEED, listing) ? LISTING_SEED[listing] : 0;
  const slot = seed * 17 + (n || 0) * 3 + name.length;
  return POOL.length ? slot % POOL.length : 0;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function allFilenames() {
  const out = [];
  for (let i = 1; i <= 26; i++) out.push(`cozy-${pad(i)}.jpg`);
  for (let i = 1; i <= 18; i++) out.push(`haven-${pad(i)}.jpg`);
  for (let i = 1; i <= 14; i++) out.push(`premium-${pad(i)}.jpg`);
  for (let i = 1; i <= 13; i++) out.push(`horizon-${pad(i)}.jpg`);
  for (let i = 1; i <= 12; i++) out.push(`express-${pad(i)}.png`);
  const familyExt = ["jpg", "png", "jpg", "jpg", "jpg", "jpg", "png", "png", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg"];
  for (let i = 0; i < 16; i++) out.push(`family-${pad(i + 1)}.${familyExt[i]}`);
  return out;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = (u) => {
      https
        .get(
          u,
          {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; ApartmentSiteFetcher/1.0)" },
          },
          (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              file.close();
              try {
                fs.unlinkSync(dest);
              } catch (e) {}
              const next = new URL(res.headers.location, u).href;
              req(next);
              return;
            }
            if (res.statusCode !== 200) {
              file.close();
              try {
                fs.unlinkSync(dest);
              } catch (e) {}
              reject(new Error("HTTP " + res.statusCode + " " + u));
              return;
            }
            res.pipe(file);
            file.on("finish", () => file.close(() => resolve()));
          }
        )
        .on("error", (err) => {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch (e) {}
          reject(err);
        });
    };
    req(url);
  });
}

async function main() {
  const root = path.join(__dirname, "..");
  const dir = path.join(root, "public", "images");
  fs.mkdirSync(dir, { recursive: true });

  const names = allFilenames();
  let ok = 0;
  for (const name of names) {
    const url = POOL[poolIndexForFilename(name)];
    const dest = path.join(dir, name);
    process.stdout.write(name + " … ");
    try {
      await download(url, dest);
      console.log("ok");
      ok++;
    } catch (e) {
      console.log("FAIL", e.message);
    }
  }
  console.log("download-apartment-photos:", ok, "/", names.length, "written to public/images/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
