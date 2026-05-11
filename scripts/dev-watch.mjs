#!/usr/bin/env node
/**
 * Restarts `next dev` if it exits unexpectedly or hits known broken `.next`
 * states (e.g. missing routes-manifest.json while the process keeps running).
 * Ctrl+C stops the child and exits cleanly.
 *
 * On every restart after the first launch, the `.next` cache is removed so each
 * rerun starts from a clean Next dev build output.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", ".bin", "next");

let child = null;
let shuttingDown = false;
/** We SIGTERM the child to force a restart after a fatal log line. */
let intentionalChildRestart = false;
/** 0 = first `run()`, >0 means every subsequent spawn clears `.next` first. */
let spawnCount = 0;
let outputBuf = "";
let outputRestartPending = false;

const RESTART_MS = 2000;
const RESTART_AFTER_OUTPUT_MS = 500;

function wipeNextDir() {
  const nextDir = path.join(root, ".next");
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.error("[dev-watch] removed .next for a clean dev rebuild.\n");
  } catch (e) {
    console.error("[dev-watch] could not remove .next:", e.message, "\n");
  }
}

function stop(sig) {
  shuttingDown = true;
  if (child && !child.killed) {
    child.kill(sig);
  } else {
    process.exit(0);
  }
}

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => stop(sig));
}

function outputLooksCorrupt(text) {
  if (text.includes("routes-manifest.json")) return true;
  if (text.includes("app-paths-manifest.json")) return true;
  if (text.includes("build-manifest.json") && text.includes("ENOENT")) return true;
  if (text.includes("ENOENT") && text.includes(".next")) return true;
  return false;
}

function onFatalOutput(reason) {
  if (shuttingDown || !child || child.killed || outputRestartPending) return;
  outputRestartPending = true;
  intentionalChildRestart = true;
  console.error(`\n[dev-watch] ${reason} — restarting dev server…\n`);
  child.kill("SIGTERM");
}

function attachOutputWatch() {
  outputBuf = "";
  const feed = (chunk, stream) => {
    const s = chunk.toString();
    if (stream === "stdout") process.stdout.write(chunk);
    else process.stderr.write(chunk);
    outputBuf = (outputBuf + s).slice(-16384);
    if (outputLooksCorrupt(outputBuf)) {
      onFatalOutput("stale or missing .next artifacts (ENOENT / manifest)");
    }
  };
  child.stdout?.on("data", (c) => feed(c, "stdout"));
  child.stderr?.on("data", (c) => feed(c, "stderr"));
}

function run() {
  if (shuttingDown) return;

  if (spawnCount > 0) {
    wipeNextDir();
  }
  spawnCount += 1;

  child = spawn(nextBin, ["dev"], {
    stdio: ["inherit", "pipe", "pipe"],
    cwd: root,
    env: process.env,
  });

  attachOutputWatch();

  child.on("exit", (code, signal) => {
    child = null;
    outputRestartPending = false;

    if (shuttingDown) {
      process.exit(code === null && signal ? 1 : (code ?? 0));
      return;
    }

    if (intentionalChildRestart) {
      intentionalChildRestart = false;
      setTimeout(run, RESTART_AFTER_OUTPUT_MS);
      return;
    }

    if (signal === "SIGINT" || signal === "SIGTERM") {
      process.exit(0);
    }

    const reason =
      signal != null ? `signal ${signal}` : `code ${code ?? "null"}`;
    console.error(
      `\n[dev-watch] dev server stopped (${reason}). Restarting in ${RESTART_MS / 1000}s…\n`,
    );
    setTimeout(run, RESTART_MS);
  });

  child.on("error", (err) => {
    if (shuttingDown) return;
    console.error("[dev-watch] failed to spawn next:", err.message);
    setTimeout(run, RESTART_MS);
  });
}

run();
