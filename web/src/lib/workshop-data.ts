export const site = {
  slug: "aie-loopcraft-workshop-2026",
  title: "AI Engineer Loopcraft Workshop 2026",
  url: "https://aie-loopcraft-workshop-2026.wzrrd.sh/",
  repo: "https://github.com/joelhooks/aie-loopcraft-workshop-2026",
  version: "0.8.3",
};

export type Lesson = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  href: string;
  challenge: string;
  starterPrompt: string;
  buildOperate: string;
  observe: string;
  discuss: string;
  checkpoint: string;
  drill: string;
  next: string;
  receipt: string;
};

export const lessons: Lesson[] = [
  {
    id: "tour-vision-repo",
    number: "01",
    title: "Tour the rig and set the course",
    shortTitle: "Tour + vision",
    href: "/lessons/01-tour-vision-repo/",
    challenge: "Use Pi plus grill-with-docs to tour the prepared surfaces, define the product vision, and create only the minimal repo baseline.",
    starterPrompt:
      "/skill:grill-with-docs — Tour README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, the Pi helper, local skills, and Lakebed. Ask one question at a time, write VISION.md, and update repo rules only when clear.",
    buildOperate: "Create VISION.md, inspect the Docker Compose / workshop scripts, and capture any clear AGENTS.md/README.md rule. Do not build product behavior yet.",
    observe: "Inspect VISION.md for intent, safety boundary, non-goal, and next setup need; confirm issue events are still deliberately deferred.",
    discuss: "The first move is orientation plus decision capture. The agent should not improvise a product from vibes.",
    checkpoint: "The repo can explain what it is building, what must stop for a human, what setup exists, and what setup waits for Lesson 02.",
    drill: "Read one VISION.md sentence and classify it as intent, boundary, non-goal, or setup need.",
    next: "Turn the vision into a first issue-event queue and typed loop check.",
    receipt: "Run 06 grill turns named approvals/gates before implementation; run 07 starts with a guided tour and durable vision capture.",
  },
  {
    id: "reliability-floor",
    number: "02",
    title: "Build the reliability floor",
    shortTitle: "Reliability floor",
    href: "/lessons/02-reliability-floor/",
    challenge: "Turn the vision into the first issue-event queue and make it typed, testable, and receipt-backed.",
    starterPrompt:
      "Use VISION.md from Lesson 01. Create the first issue-event queue, then build the smallest reliability floor: package scripts, strict TypeScript, Effect schemas, an explicit loop-check classifier, tests, and a receipt for one check run.",
    buildOperate: "Add issue events, package scripts, strict config, src/issue-events.ts, src/loop-check.ts, tests, run-log and receipt output.",
    observe: "Run the checks that exist, then run the loop check and inspect the receipt.",
    discuss: "This is the down-for-reliability move: fast strict guardrails, typed boundaries, explicit state, and evidence.",
    checkpoint: "The loop classifies ready / approval / input without external trackers or hidden edits.",
    drill: "For one receipt, name inputs read, stop reason, and next allowed action.",
    next: "Project the same facts into Lakebed without changing the core model.",
    receipt: "Run 06 ISS-001..004 added tooling, Effect schemas, XState loop check, receipts, run log, and memory.",
  },
  {
    id: "lakebed-projection",
    number: "03",
    title: "Project issue state into Lakebed",
    shortTitle: "Lakebed projection",
    href: "/lessons/03-lakebed-projection/",
    challenge: "Make Lakebed the operator projection while keeping local files testable.",
    starterPrompt:
      "Add a Lakebed provider/projection path: the core should read issue events through an adapter, and Lakebed should show list, board, and event views. Keep JSONL/local files testable.",
    buildOperate: "Add an IssueStore-style adapter, Lakebed /api/issue-events seam, and list/Kanban/event viewer projection.",
    observe: "Compare the local event file to the Lakebed event view and board lane.",
    discuss: "Lakebed is the projection, not the domain model. Useful UI explains movement from append-only facts.",
    checkpoint: "One issue appears in the correct Lakebed lane and the event viewer explains why.",
    drill: "Pick one card and trace it back to the event that put it there.",
    next: "Control the loop from Pi and Herdr instead of only reading files/UI.",
    receipt: "Run 06 chose Lakebed endpoint first, kept JSON adapter for tests, and made list/board/event state visible.",
  },
  {
    id: "pi-herdr-control",
    number: "04",
    title: "Control the loop from Pi and Herdr",
    shortTitle: "Pi/Herdr control",
    href: "/lessons/04-pi-herdr-control/",
    challenge: "Make the loop visible and controllable from the operator harness.",
    starterPrompt:
      "Add the smallest local control plane: a bridge/status process, machine-readable check output, and Pi controls to inspect or trigger a check. Keep Herdr visible with an operator pane and a daemon/status pane.",
    buildOperate: "Use the scaffold daemon side pane, then replace it with bridge health/status/check-now/SSE and Pi status/check controls.",
    observe: "Run a check from Pi and watch the side pane, latest status, and latest receipt agree.",
    discuss: "Pi is the harness around the machine. Herdr turns hidden process state into operator-visible runtime state.",
    checkpoint: "The operator can start/inspect/check the loop from Pi and see matching status in Herdr.",
    drill: "Diagnose stale state by checking bridge status, last receipt, wake/check state, and pane output.",
    next: "Use the control plane to progress one ready item safely.",
    receipt: "Run 06’s poke/kick/dead-again loop is the scar that made heartbeat, freshness, and controls essential.",
  },
  {
    id: "safe-dispatch",
    number: "05",
    title: "Make dispatch safe",
    shortTitle: "Safe dispatch",
    href: "/lessons/05-safe-dispatch/",
    challenge: "Progress one ready issue through policy, claim, dry-run dispatch, and receipt before implementation edits.",
    starterPrompt:
      "Use the ready issue from the loop check. Add the smallest safe dispatch seam: policy decides eligibility, the loop claims the issue first, dispatch runs in dry-run or memory mode, and the result writes a receipt.",
    buildOperate: "Add policy classification, claim event, runtime adapter seam, dry-run/memory runtime, and dispatch receipt.",
    observe: "Inspect the event stream before/after claim and then inspect the dispatch receipt.",
    discuss: "Just run an agent is the trap. Ownership and policy come first.",
    checkpoint: "One ready issue has a claim and dispatch receipt, with no hidden mutation.",
    drill: "For a candidate issue, say whether it is claimable and why.",
    next: "Let a bounded maintenance helper write issue events.",
    receipt: "Run 06 ISS-011..015 added dispatch policy, Herdr runtime dry-run, claims, and memory dispatch receipts.",
  },
  {
    id: "bounded-gardener",
    number: "06",
    title: "Add a bounded gardener",
    shortTitle: "Bounded gardener",
    href: "/lessons/06-bounded-gardener/",
    challenge: "Let the loop propose or apply maintenance events, then prove it stops visibly when it should.",
    starterPrompt:
      "Add a bounded gardener pass. It may propose or apply fully formed issue events, but it must stop for ready work, approval-required work, input-required work, active runtime, duplicate follow-up, or dirty state.",
    buildOperate: "Add gardener dry-run/apply, stop reasons, duplicate prevention, and maintenance receipt/snapshot.",
    observe: "Run dry-run and one allowed happy path; inspect the event it would write or did write.",
    discuss: "Maintenance is agentic behavior. It is safe only when it writes explicit events and stops visibly.",
    checkpoint: "The gardener can create/propose one useful event and can explain why it stopped.",
    drill: "Read a gardener stop reason and name the operator’s next action.",
    next: "Ask a specialist for read-only help instead of expanding the gardener.",
    receipt: "Run 06 hit dirty-worktree and duplicate-gardener scars; those became stop reasons and duplicate checks.",
  },
  {
    id: "specialist-review",
    number: "07",
    title: "Add specialist review carefully",
    shortTitle: "Specialist review",
    href: "/lessons/07-specialist-review/",
    challenge: "Ask a small specialist agent for help without giving a generic agent swarm the keys.",
    starterPrompt:
      "Add a loop-owned specialist review seam. Define one non-mutating scout/reviewer role, produce a work packet from issue state, run or simulate the specialist, and save the artifact.",
    buildOperate: "Define role contract, packet shape, read-only artifact, runtime seam, and receipt linking issue/packet/artifact.",
    observe: "Inspect the specialist artifact and compare it to issue acceptance criteria.",
    discuss: "Multi-agent review is leverage only when the loop owns roles, artifacts, and stop rules.",
    checkpoint: "One specialist artifact exists and did not mutate product state.",
    drill: "Classify a specialist request as scout, reviewer, implementer, or do-not-run.",
    next: "Move decision ownership into an explicit supervisor runtime.",
    receipt: "Run 06 installed loop-owned scout/reviewer roles and avoided unbounded default agent swarms.",
  },
  {
    id: "supervisor-runtime",
    number: "08",
    title: "Shadow the supervisor runtime",
    shortTitle: "Supervisor runtime",
    href: "/lessons/08-supervisor-runtime/",
    challenge: "Move decision ownership from bridge glue toward an explicit supervisor/actor runtime in shadow mode.",
    starterPrompt:
      "Add the smallest supervisor runtime shadow. The bridge should still drive the visible loop, but a supervisor actor should make the same decision in parallel and write a comparison receipt. Include one recovery drill.",
    buildOperate: "Add off/shadow/on mode, supervisor decision/actor, per-issue lifecycle shape, comparison receipt, and one recovery drill test.",
    observe: "Run the same input through bridge and supervisor paths; inspect whether decisions agree.",
    discuss: "The top of the leverage arrow is not magic. It is the same facts, guards, events, and receipts with better lifecycle ownership.",
    checkpoint: "A shadow receipt proves the supervisor agrees on one happy-path decision and a recovery drill passes.",
    drill: "For one issue, name which actor should own the next decision.",
    next: "After the hour: deepen worktrees, launchd scheduling, provider adapters, and real specialist dispatch.",
    receipt: "Run 06 ISS-059..068 migrated toward dynamic execution runtime and recovery drills one ready issue at a time.",
  },
];

export const stats = [
  { label: "Lessons", value: "8" },
  { label: "Repo", value: "public" },
  { label: "Runtime", value: "Pi + Herdr" },
  { label: "Surface", value: "Lakebed" },
];

export function getAdjacentLesson(id: string) {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return {
    index,
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}
