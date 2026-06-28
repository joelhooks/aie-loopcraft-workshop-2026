import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const lessonOnePrompt = `/skill:grill-with-docs

Tour this prepared Loopcraft repo with me before we build product behavior.

Inspect README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, .pi/extensions/loop-workshop.ts, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time to define the product vision, operator boundaries, stop rules, and first repo setup choices. Write the decisions into VISION.md. Update AGENTS.md or README.md only when a repo rule or command is clear. Create only the minimal repo setup needed for the next lesson. Do not build the loop yet.`;

const widgetLines = [
  "Loopcraft 07 · ready for Lesson 01",
  "1. Tour the rig + define vision",
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
    description: "Prefill the Lesson 01 tour, vision, and repo setup prompt.",
    handler: async (_args, ctx) => {
      ctx.ui.setEditorText(lessonOnePrompt);
      ctx.ui.notify("Lesson 01 prompt loaded. Review, then send it.", "info");
    },
  });
}
