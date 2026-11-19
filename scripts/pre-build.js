const fs = require("fs");
const path = require("path");

console.log("⚡ [pre-build] Preparing clean Next.js build...");

// Clean up stale pre-rendered HTML and fetch caches while preserving build tokens and retries
const targets = [
  path.join(__dirname, "..", "frontend", ".next", "server", "app", "(store)", "page.html"),
  path.join(__dirname, "..", "frontend", ".next", "server", "app", "(store)", "page.rsc"),
  path.join(__dirname, "..", "frontend", ".next", "server", "app", "(store)", "page.meta"),
  path.join(__dirname, "..", "frontend", ".next", "cache", "fetch-cache"),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    try {
      console.log(`🧹 [pre-build] Removing ${path.relative(process.cwd(), target)}...`);
      fs.rmSync(target, { recursive: true, force: true });
    } catch (err) {
      console.warn(`[pre-build] Notice: could not remove ${target}:`, err.message);
    }
  }
}

console.log("✓ [pre-build] Ready for build.");
