"use strict";

const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "@capacitor",
  "cli",
  "dist",
  "util",
  "template.js"
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const text = fs.readFileSync(target, "utf8");
const needle = "tar_1.default.extract";
const replacement = "(tar_1.default || tar_1).extract";

if (!text.includes(needle)) {
  process.exit(0);
}

const updated = text.replace(needle, replacement);
fs.writeFileSync(target, updated);
