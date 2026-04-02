#!/usr/bin/env node
/**
 * Ensure every /images/<file> referenced in site source exists under images/.
 * Run from repo root: node scripts/verify-site-images.js
 *
 * With js/apartment-image-sources.js STRATEGY "remote", listing JPGs may resolve to remote URLs;
 * gallery files under /images/apartments/ are always local — run sync-public-images after adding them.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "images");
const re = /["']\/images\/([^"']+)["']/g;

const skipDir = new Set(["node_modules", ".git", "images", "public"]);

function walk(dir, out) {
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    if (skipDir.has(name)) continue;
    const p = path.join(dir, name);
    let st;
    try {
      st = fs.statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(p, out);
    } else if (/\.(html|js|css)$/i.test(name)) {
      out.push(p);
    }
  }
}

const files = [];
walk(root, files);

const needed = new Set();

for (const filePath of files) {
  const text = fs.readFileSync(filePath, "utf8");
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) {
    needed.add(m[1]);
  }
}

const missing = [];
for (const rel of needed) {
  const full = path.join(imagesDir, rel);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    missing.push("/images/" + rel);
  }
}

if (missing.length) {
  console.error("verify-site-images: missing files under images/:");
  missing.sort().forEach((p) => console.error(" ", p));
  process.exit(1);
}

console.log(
  "verify-site-images: OK —",
  needed.size,
  "unique /images/* path(s) present in",
  path.relative(root, imagesDir) + "/"
);
