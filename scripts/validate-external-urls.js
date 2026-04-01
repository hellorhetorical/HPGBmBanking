const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "src", "app-config.js");
const content = fs.readFileSync(configPath, "utf8");

const allowlist = new Set([
  "hpgb.bank.in",
  "www.hpgb.bank.in",
  "hpgbmobile.in",
  "services.tdscpc.gov.in",
  "www.bharat-connect.com",
  "wa.me",
  "facebook.com",
  "x.com",
  "instagram.com",
  "youtube.com",
]);

const urlMatches = content.match(/https?:\/\/[^"'\s<>]+/g) || [];
const invalid = [];

urlMatches.forEach((rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") {
      invalid.push({ url: rawUrl, reason: "non-https protocol" });
      return;
    }

    if (!allowlist.has(parsed.hostname)) {
      invalid.push({ url: rawUrl, reason: `host not in allowlist (${parsed.hostname})` });
    }
  } catch (error) {
    invalid.push({ url: rawUrl, reason: "invalid URL" });
  }
});

if (invalid.length) {
  console.error("External URL allowlist violations found in src/app-config.js:");
  invalid.forEach((entry) => {
    console.error(`- ${entry.url} (${entry.reason})`);
  });
  process.exit(1);
}

console.log("External URL allowlist check passed.");
