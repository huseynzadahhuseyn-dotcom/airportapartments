#!/usr/bin/env node
/**
 * Copy public/images/** → images/ (recursive) so static hosts serve assets at /images/* (site root).
 * Run from repo root: node scripts/sync-public-images.js
 *
 * Optional: node scripts/download-apartment-photos.cjs fills public/images/ with stand-ins, then sync.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const srcDir = path.join(root, "public", "images");
const destDir = path.join(root, "images");

if (!fs.existsSync(srcDir)) {
  console.error("sync-public-images: missing directory", srcDir);
  process.exit(1);
}

let n = 0;

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true });
  const names = fs.readdirSync(from);
  for (const name of names) {
    const srcPath = path.join(from, name);
    const destPath = path.join(to, name);
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      n += 1;
    }
  }
}

copyRecursive(srcDir, destDir);

console.log("sync-public-images: copied", n, "file(s) recursively to", path.relative(root, destDir) + "/");
