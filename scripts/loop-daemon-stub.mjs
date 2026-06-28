#!/usr/bin/env node
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const port = Number(process.env.LOOP_BRIDGE_PORT ?? 8787);
const cwd = process.cwd();
const startedAt = new Date().toISOString();
const clients = new Set();
let lastCheckAt;
let lastEvent = "boot";

function readIssueEvents() {
  const candidates = ["data/issue-events.jsonl", "issues.jsonl"];
  for (const candidate of candidates) {
    const path = resolve(cwd, candidate);
    if (!existsSync(path)) {
      continue;
    }
    const lines = readFileSync(path, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return { path: candidate, count: lines.length };
  }
  return { path: undefined, count: 0 };
}

function status() {
  const issueEvents = readIssueEvents();
  return {
    ok: true,
    scaffold: true,
    message: issueEvents.path
      ? "Issue event file found. Lesson 01 is underway."
      : "Ready for Lesson 01. Create the first issue-event queue.",
    startedAt,
    lastCheckAt,
    lastEvent,
    issueEvents,
  };
}

function sendEvent(event = "heartbeat") {
  lastEvent = event;
  const body = `event: ${event}\ndata: ${JSON.stringify(status())}\n\n`;
  for (const response of clients) {
    response.write(body);
  }
}

const server = createServer((request, response) => {
  if (!request.url) {
    response.writeHead(404).end();
    return;
  }

  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
    return;
  }

  if (request.url === "/status") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(status(), null, 2));
    return;
  }

  if (request.url === "/check-now" && request.method === "POST") {
    lastCheckAt = new Date().toISOString();
    sendEvent("check.completed");
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(status(), null, 2));
    return;
  }

  if (request.url === "/events") {
    response.writeHead(200, {
      "cache-control": "no-cache",
      connection: "keep-alive",
      "content-type": "text/event-stream",
    });
    clients.add(response);
    response.write(`event: connected\ndata: ${JSON.stringify(status())}\n\n`);
    request.on("close", () => clients.delete(response));
    return;
  }

  response.writeHead(404).end();
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Loopcraft scaffold daemon listening on http://127.0.0.1:${port}`);
  console.log("This is a scaffold status process, not the finished loop.");
  console.log("Create issue events in Lesson 01, then POST /check-now to see status update.");
});

setInterval(() => {
  const snapshot = status();
  console.log(
    `[${new Date().toISOString()}] heartbeat events=${snapshot.issueEvents.count} file=${snapshot.issueEvents.path ?? "none"}`
  );
  sendEvent("heartbeat");
}, 5_000).unref();
