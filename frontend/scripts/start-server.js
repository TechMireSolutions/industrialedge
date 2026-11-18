const { spawn, execSync } = require("child_process");
const path = require("path");

// Parse -p / --port from CLI arguments
const args = process.argv.slice(2);
let port = process.env.PORT || "";
for (let i = 0; i < args.length; i++) {
  if ((args[i] === "-p" || args[i] === "--port") && args[i + 1]) {
    port = args[i + 1];
    break;
  }
  if (args[i].startsWith("--port=")) {
    port = args[i].split("=")[1];
    break;
  }
}

const cwd = process.cwd();
const isProdVps = process.platform === "linux" && cwd.includes("industrialedgev2");
if (!port) {
  port = isProdVps ? "3005" : "3000";
}

// On the Linux production VPS, release any orphaned old next-server still holding the target port
if (isProdVps) {
  const selfPid = process.pid;
  const parentPid = process.ppid;
  const pidsToKill = new Set();

  const tryCollect = (cmd) => {
    try {
      const out = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      const matches = out.match(/\b\d+\b/g) || [];
      for (const m of matches) {
        const pid = Number(m);
        if (pid > 1 && pid !== selfPid && pid !== parentPid) {
          pidsToKill.add(pid);
        }
      }
    } catch {}
  };

  tryCollect(`lsof -ti:${port}`);
  tryCollect(`fuser ${port}/tcp 2>/dev/null`);
  try {
    const ssOut = execSync(`ss -tlnp "sport = :${port}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const re = /pid=(\d+)/g;
    let match;
    while ((match = re.exec(ssOut)) !== null) {
      const pid = Number(match[1]);
      if (pid > 1 && pid !== selfPid && pid !== parentPid) {
        pidsToKill.add(pid);
      }
    }
  } catch {}

  for (const pid of pidsToKill) {
    try {
      console.log(`[start-server] Stopping stale process PID ${pid} on port ${port}...`);
      process.kill(pid, "SIGKILL");
    } catch {}
  }

  if (pidsToKill.size > 0) {
    // Brief synchronous pause to let the kernel release the socket
    const end = Date.now() + 800;
    while (Date.now() < end) {}
  }
}

const nextBin = require.resolve("next/dist/bin/next");
const nextArgs = [nextBin, "start", "-p", String(port)];

console.log(`[start-server] Launching Next.js on port ${port} from ${cwd}...`);
const child = spawn(process.execPath, nextArgs, {
  cwd,
  stdio: "inherit",
  env: { ...process.env, PORT: String(port) },
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGTERM", () => forwardSignal("SIGTERM"));
process.on("SIGINT", () => forwardSignal("SIGINT"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

