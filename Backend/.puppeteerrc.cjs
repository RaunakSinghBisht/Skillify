const { join } = require("path");

// On Render, keep the downloaded Chrome inside the project so it survives from the build step to runtime.
// Locally (RENDER is not set) Puppeteer keeps using its default cache (~/.cache/puppeteer).
module.exports = process.env.RENDER
  ? { cacheDirectory: join(__dirname, ".cache", "puppeteer") }
  : {};
