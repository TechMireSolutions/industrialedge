const { execSync } = require("child_process");

const cwd = process.cwd();
const isProdVps = process.platform === "linux" && cwd.includes("industrialedgev2");

if (isProdVps) {
  console.log("⚡ [post-build-vps] Preparing fresh PM2 reload on production VPS...");
  try {
    // Delete stale PM2 registration so line 56 of deploy.yml will trigger fresh 'pm2 start'
    execSync("pm2 delete industrialv2-frontend 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Removed stale industrialv2-frontend PM2 registration");
  } catch {}

  try {
    // Kill any orphaned node processes listening on port 3005
    execSync("fuser -k 3005/tcp 2>/dev/null || true", { stdio: "inherit" });
    execSync("lsof -ti:3005 | xargs -r kill -9 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Cleared orphaned processes on port 3005");
  } catch {}
} else {
  console.log("✓ Post-build check passed.");
}
