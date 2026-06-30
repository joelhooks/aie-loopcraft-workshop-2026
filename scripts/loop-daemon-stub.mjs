#!/usr/bin/env node
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const port = Number(process.env.LOOP_BRIDGE_PORT ?? 8787);
const cwd = process.cwd();
const startedAt = new Date().toISOString();
const clients = new Set();
const corsHeaders = {
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-origin": "*",
};
let lastCheckAt;
let lastCommand = "pnpm run loop:check";
let lastReceipt = "receipts/loop-check-latest.json";
let lastEvent = "boot";

function parseIssueEvents() {
  const candidates = ["data/issue-events.jsonl", "issues.jsonl"];
  for (const candidate of candidates) {
    const path = resolve(cwd, candidate);
    if (!existsSync(path)) {
      continue;
    }

    const events = [];
    const errors = [];
    const lines = readFileSync(path, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const [index, line] of lines.entries()) {
      try {
        events.push(JSON.parse(line));
      } catch (error) {
        errors.push({
          line: index + 1,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { path: candidate, events, errors };
  }
  return { path: undefined, events: [], errors: [] };
}

function readIssueEvents() {
  const issueEvents = parseIssueEvents();
  return {
    path: issueEvents.path,
    count: issueEvents.events.length,
    parseErrors: issueEvents.errors,
  };
}

function classifyIssue(event) {
  if (event.status === "ready") {
    return {
      nextAllowedAction:
        "Run the local check again or prepare a human-reviewed next step.",
      refusedAction:
        "Do not change product code, call external trackers, schedule work, or dispatch agents yet.",
      stopReason: null,
    };
  }

  if (event.status === "approval-required") {
    return {
      nextAllowedAction:
        "Ask the human to approve, reject, or narrow the work.",
      refusedAction: "Do not treat this issue as ready or change files for it.",
      stopReason: "Human approval is required before this issue can move.",
    };
  }

  return {
    nextAllowedAction: "Ask for missing acceptance criteria or clearer scope.",
    refusedAction:
      "Do not guess the missing requirements or start implementation.",
    stopReason: "More input is required before this issue can move.",
  };
}

function issueCards() {
  const issueEvents = parseIssueEvents();
  const loopStatus = currentLoopStatus();
  return {
    fileRead: issueEvents.path,
    checkedAt: loopStatus.checkedAt,
    lastReceipt: loopStatus.lastReceipt,
    latestCheck: loopStatus.latestCheck,
    parseErrors: issueEvents.errors,
    cards: issueEvents.events.map((event) => {
      const classification = classifyIssue(event);
      return {
        issueId: event.issueId,
        title: event.title,
        status:
          event.status === "approval-required"
            ? "approval_required"
            : event.status === "input-required"
              ? "needs_input"
              : "ready",
        reason: event.summary,
        stopReason: classification.stopReason,
        nextAllowedAction: classification.nextAllowedAction,
        refusedAction: classification.refusedAction,
        eventCount: 1,
        events: [
          { eventId: event.id, type: event.type, summary: event.summary },
        ],
      };
    }),
  };
}

function readReceipt() {
  const path = resolve(cwd, lastReceipt);
  if (!existsSync(path)) {
    return undefined;
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

function currentLoopStatus() {
  const receipt = readReceipt();
  if (!receipt) {
    return {
      state: "waiting_for_first_check",
      checkedAt: "never",
      lastCommand,
      lastReceipt,
      waitingReason:
        "Run pnpm run loop:check before trusting local issue state.",
      latestCheck: null,
    };
  }

  const ready = receipt.classifications.find((item) => item.status === "ready");
  const waiting = receipt.classifications.find((item) => item.stopReason);
  const latest = ready ?? receipt.classifications[0] ?? null;

  return {
    state: ready ? "ready_with_local_guardrails" : "waiting_for_human_input",
    checkedAt: receipt.checkedAt,
    lastCommand: receipt.lastCommand ?? lastCommand,
    lastReceipt,
    waitingReason: waiting
      ? `${waiting.issueId}: ${waiting.stopReason}`
      : "No waiting issue in the latest local check.",
    latestCheck: latest
      ? { issueId: latest.issueId, status: latest.status, title: latest.title }
      : null,
  };
}

function status() {
  const issueEvents = readIssueEvents();
  const loopStatus = currentLoopStatus();
  return {
    ok: true,
    scaffold: true,
    message: issueEvents.path
      ? "Issue event file found. Local status is available."
      : "Create the first issue-event queue, then run check-now.",
    startedAt,
    lastCheckAt:
      loopStatus.checkedAt === "never" ? lastCheckAt : loopStatus.checkedAt,
    lastEvent,
    connectedClients: clients.size,
    issueEvents,
    ...loopStatus,
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

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
    return;
  }

  if (request.url === "/status") {
    response.writeHead(200, {
      ...corsHeaders,
      "content-type": "application/json",
    });
    response.end(JSON.stringify(status(), null, 2));
    return;
  }

  if (request.url === "/issue-cards") {
    response.writeHead(200, {
      ...corsHeaders,
      "content-type": "application/json",
    });
    response.end(JSON.stringify(issueCards(), null, 2));
    return;
  }

  if (request.url === "/check-now" && request.method === "POST") {
    const result = spawnSync("pnpm", ["run", "-s", "loop:check"], {
      cwd,
      encoding: "utf8",
    });
    lastCheckAt = new Date().toISOString();

    if (result.status !== 0) {
      response.writeHead(500, {
        ...corsHeaders,
        "content-type": "application/json",
      });
      response.end(
        JSON.stringify(
          {
            ok: false,
            command: lastCommand,
            stderr: result.stderr,
            stdout: result.stdout,
          },
          null,
          2,
        ),
      );
      return;
    }

    sendEvent("check.completed");
    response.writeHead(200, {
      ...corsHeaders,
      "content-type": "application/json",
    });
    response.end(
      JSON.stringify({ ...status(), checkOutput: result.stdout }, null, 2),
    );
    return;
  }

  if (request.url === "/events") {
    response.writeHead(200, {
      ...corsHeaders,
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
  console.log(
    `Loopcraft scaffold daemon listening on 0.0.0.0:${port} inside this runtime.`,
  );
  console.log(
    "Browser bridge URLs belong to the Docker host. Run `bash scripts/workshop-ui-url.sh` from a host shell before debugging Lakebed.",
  );
  console.log("This is a scaffold status process, not the finished loop.");
  console.log(
    "Create issue events in Lesson 02, then POST /check-now to see status update.",
  );
});

setInterval(() => {
  const snapshot = status();
  console.log(
    `[${new Date().toISOString()}] heartbeat state=${snapshot.state} checkedAt=${snapshot.checkedAt} lastCommand=${snapshot.lastCommand} lastReceipt=${snapshot.lastReceipt} waitingReason=${snapshot.waitingReason} latest=${snapshot.latestCheck?.issueId ?? "none"} events=${snapshot.issueEvents.count} file=${snapshot.issueEvents.path ?? "none"}`,
  );
  sendEvent("heartbeat");
}, 5_000).unref();
