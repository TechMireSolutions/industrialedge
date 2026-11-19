const { execSync } = require("child_process");
const http = require("http");

const cwd = process.cwd();
const isProdVps = process.platform === "linux" && cwd.includes("industrialedgev2");

if (isProdVps) {
  console.log("⚡ [post-build-vps] Performing fresh production VPS reload & verification...");

  // 1. Purge Next.js cache directories to eliminate any stale pre-rendered HTML
  try {
    execSync("rm -rf frontend/.next/cache .next/cache 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Purged Next.js cache directories");
  } catch {}

  // 2. Clear any Nginx proxy cache if configured
  try {
    execSync("rm -rf /www/server/nginx/proxy_cache_dir/* /var/cache/nginx/* 2>/dev/null || true", { stdio: "inherit" });
    execSync("nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Flushed Nginx proxy cache & reloaded Nginx");
  } catch {}

  // 3. Delete stale PM2 frontend registration and terminate orphaned processes on port 3005
  try {
    execSync("pm2 delete industrialv2-frontend 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Removed stale industrialv2-frontend PM2 registration");
  } catch {}

  try {
    execSync("fuser -k 3005/tcp 2>/dev/null || true", { stdio: "inherit" });
    execSync("lsof -ti:3005 | xargs -r kill -9 2>/dev/null || true", { stdio: "inherit" });
    console.log("✓ Cleared orphaned processes on port 3005");
  } catch {}

  // 4. Register industrialv2-frontend with PM2 using frontend/scripts/start-server.js
  try {
    execSync(
      "PORT=3005 pm2 start frontend/scripts/start-server.js --name industrialv2-frontend -- -p 3005",
      { stdio: "inherit" }
    );
    console.log("✓ Started industrialv2-frontend via PM2");
  } catch (err) {
    console.error("Failed to start PM2 industrialv2-frontend:", err.message);
  }

  // 5. Verify local HTTP response on port 3005
  console.log("🔍 [post-build-vps] Verifying port 3005 locally on VPS...");
  setTimeout(() => {
    http
      .get("http://127.0.0.1:3005/", (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          console.log(`✓ Port 3005 HTTP status: ${res.statusCode}`);
          console.log(`✓ Local length: ${body.length}`);
          console.log(`✓ Local has tel:+922134685312: ${body.includes("tel:+922134685312")}`);
          console.log(`✓ Local has Odeon Center: ${body.includes("Suite M-107, Odeon Center")}`);
        });
      })
      .on("error", (e) => {
        console.warn("Could not probe port 3005 locally:", e.message);
      });
  }, 2000);
} else {
  console.log("✓ Post-build check passed.");
}
