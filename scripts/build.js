#!/usr/bin/env node
"use strict";

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const wwwDir = path.join(rootDir, "www");
const isDemo = process.argv.includes("--demo") || process.env.HPGB_DEMO === "true";
const cacheBust = process.env.HPGB_BUILD_TAG || Date.now().toString();

const copyDir = async (source, target) => {
  await fs.mkdir(target, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

const buildCssBundle = async () => {
  const cssFiles = [
    "vendor/material-icons.css",
    "styles/base.css",
    "styles/layout.css",
    "styles/components.css",
    "styles/pages.css",
  ];
  const cssChunks = await Promise.all(
    cssFiles.map((file) => fs.readFile(path.join(srcDir, file), "utf8"))
  );
  const outputPath = path.join(wwwDir, "app.css");
  await fs.writeFile(outputPath, `${cssChunks.join("\n")}\n`, "utf8");
};

const buildTemplateCache = async () => {
  const viewsDir = path.join(srcDir, "views");
  const viewFiles = (await fs.readdir(viewsDir))
    .filter((file) => file.endsWith(".html"))
    .sort();
  const lines = [];
  for (const file of viewFiles) {
    const raw = await fs.readFile(path.join(viewsDir, file), "utf8");
    const key = `views/${file}`;
    lines.push(`    $templateCache.put(${JSON.stringify(key)}, ${JSON.stringify(raw)});`);
  }
  const templateBundle = [
    "(() => {",
    '  "use strict";',
    '  angular.module("hpgbmbanking").run(["$templateCache", function ($templateCache) {',
    ...lines,
    "  }]);",
    "})();",
    "",
  ].join("\n");
  const outputPath = path.join(wwwDir, "templates.js");
  await fs.writeFile(outputPath, templateBundle, "utf8");
};

const copyFontAssets = async () => {
  const srcFonts = path.join(srcDir, "vendor", "fonts");
  const destFonts = path.join(wwwDir, "fonts");
  await copyDir(srcFonts, destFonts);
};

const buildJsBundle = async () => {
  const componentsDir = path.join(srcDir, "components");
  let componentFiles = [];
  try {
    componentFiles = (await fs.readdir(componentsDir))
      .filter((file) => file.endsWith(".js"))
      .sort()
      .map((file) => path.join("components", file));
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }

  const controllerDir = path.join(srcDir, "controllers");
  const controllerFiles = (await fs.readdir(controllerDir))
    .filter((file) => file.endsWith(".js"))
    .sort()
    .map((file) => path.join("controllers", file));

  const jsFiles = [
    "vendor/angular.min.js",
    "vendor/angular-route.min.js",
    "app-config.js",
    ...(isDemo ? ["mock-data.js", "mock-config.js"] : []),
    "app.constants.js",
    "app.module.js",
    ...componentFiles,
    "services/security.service.js",
    "services/account-context.service.js",
    "app.routes.js",
    "app.main.controller.js",
    ...controllerFiles,
    "app.run.js",
  ];

  const chunks = [];
  for (const file of jsFiles) {
    const filePath = path.join(srcDir, file);
    const content = await fs.readFile(filePath, "utf8");
    chunks.push(`\n/* ${file} */\n`);
    chunks.push(content);
  }
  const outputPath = path.join(wwwDir, "app.bundle.js");
  await fs.writeFile(outputPath, `${chunks.join("\n")}\n`, "utf8");
};

const computeSri = async (filePath) => {
  const data = await fs.readFile(filePath);
  const hash = crypto.createHash("sha384").update(data).digest("base64");
  return `sha384-${hash}`;
};

const updateIndexHtml = async () => {
  const indexPath = path.join(wwwDir, "index.html");
  let html = await fs.readFile(indexPath, "utf8");
  const cssSri = await computeSri(path.join(wwwDir, "app.css"));
  const bundleSri = await computeSri(path.join(wwwDir, "app.bundle.js"));
  const templatesSri = await computeSri(path.join(wwwDir, "templates.js"));
  html = html.replace(/<link\s+rel="stylesheet"[^>]*>\s*/g, "");
  html = html.replace(/<script\s+src="[^"]+"\s*><\/script>\s*/g, "");
  html = html.replace(
    "</head>",
    `  <link rel="stylesheet" href="app.css?v=${cacheBust}" integrity="${cssSri}" />\n</head>`
  );
  html = html.replace(
    "</body>",
    `  <script src="app.bundle.js?v=${cacheBust}" integrity="${bundleSri}"></script>\n` +
      `  <script src="templates.js?v=${cacheBust}" integrity="${templatesSri}"></script>\n</body>`
  );
  await fs.writeFile(indexPath, html, "utf8");
};

const run = async () => {
  await fs.rm(wwwDir, { recursive: true, force: true });
  await copyDir(srcDir, wwwDir);
  await copyFontAssets();
  await buildCssBundle();
  await buildTemplateCache();
  await buildJsBundle();
  await updateIndexHtml();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
