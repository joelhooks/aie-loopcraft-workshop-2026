import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const lessonOnePrompt = `We are building a local issue-progress loop.

Lesson 01: prompt the loop contract into existence.

Do the next small pass only: clarify the loop, write the first product intent, and create the first local issue-event queue with ready / approval-required / input-required gates. Keep it local, leave receipts, and explain the evidence before moving on.`;

const widgetLines = [
  "Loopcraft 07 · ready for Lesson 01",
  "1. Prompt the loop contract into existence",
  "2. Build the reliability floor",
  "3. Project events into Lakebed",
  "4. Control the loop from Pi + Herdr",
  "Side pane: node scripts/loop-daemon-stub.mjs",
  "Use /loop-lesson-01 to prefill the starter prompt.",
];

export default function loopWorkshop(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.setStatus("loopcraft-07", "lesson 01 ready");
    ctx.ui.setWidget("loopcraft-07", widgetLines);
  });

  pi.registerCommand("loop-workshop-status", {
    description: "Show the Loopcraft 07 learner rig status.",
    handler: async (_args, ctx) => {
      ctx.ui.setStatus("loopcraft-07", "lesson 01 ready");
      ctx.ui.setWidget("loopcraft-07", widgetLines);
      ctx.ui.notify("Loopcraft 07 scaffold is ready for Lesson 01.", "info");
    },
  });

  pi.registerCommand("loop-lesson-01", {
    description: "Prefill the Lesson 01 starter prompt.",
    handler: async (_args, ctx) => {
      ctx.ui.setEditorText(lessonOnePrompt);
      ctx.ui.notify("Lesson 01 prompt loaded. Review, then send it.", "info");
    },
  });
}
