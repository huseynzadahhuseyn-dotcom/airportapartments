#!/usr/bin/env node
/**
 * Copy public/images/* → images/ so static hosts serve assets at /images/* (site root).
 * Run from repo root: node scripts/sync-public-images.js
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

fs.mkdirSync(destDir, { recursive: true });

const names = fs.readdirSync(srcDir);
let n = 0;
for (const name of names) {
  const from = path.join(srcDir, name);
  if (!fs.statSync(from).isFile()) continue;
  fs.copyFileSync(from, path.join(destDir, name));
  n += 1;
}

console.log("sync-public-images: copied", n, "file(s) to", path.relative(root, destDir) + "/");
