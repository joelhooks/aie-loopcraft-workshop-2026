# Full setup without Docker

Use this appendix when the person running the workshop explicitly wants to run the Loopcraft repo on their own machine instead of inside the Docker workshop computer.

Docker is still the normal path because it pins the toolchain and keeps auth/state away from the host. The local path is for people who already have, or are willing to install, the tools themselves.

## Agent contract

If you are the coding agent helping with this setup:

1. Stay inside the cloned `aie-loopcraft-workshop-2026` folder.
2. Install or verify host tools only after the person running the machine agrees.
3. Do not paste secrets into files, shell history, docs, or chat. If auth is needed, ask the person to sign in through the tool's normal login flow.
4. Do not create lesson artifacts early. Lesson 01 creates `VISION.md`; Lesson 02 creates the first issue-event file and checks.
5. Leave a short setup receipt: OS, tool versions, commands run, what passed, what still needs auth.

## Copy/paste prompt for a setup agent

Use this when you want a coding agent to run the local setup with you:

```txt
You are helping me run the AI Engineer Loopcraft Workshop 2026 on this machine without Docker.

Stay inside the cloned aie-loopcraft-workshop-2026 repo once it exists. Do not create lesson artifacts yet. Do not edit product files to work around missing host tools. Do not handle secrets or paste tokens anywhere; if auth is needed, stop and ask me to sign in through the normal tool flow.

Goal: get the local machine ready to start Lesson 01. Verify Git, Node 22+, pnpm 11.9.0, Bun, Pi, and Herdr. Install only the missing tools I approve. Run herdr integration install pi, or choose plain terminal mode if Herdr is the blocker. Run pnpm run web:install, pnpm run web:check, and pnpm run web:build. Start or smoke-test node scripts/loop-daemon-stub.mjs. Open Pi from the repo root and confirm it can start or asks me to log in.

Before changing anything, show me the current tool/version audit and the exact install commands you plan to run. When done, report a setup receipt: OS, repo path, git status before lesson work, tool versions, Herdr mode or terminal mode, site checks, daemon test, Pi auth status, and blockers. Stop before Lesson 01 edits unless I explicitly say to continue.
```

## Done means

A local setup is ready when all of these are true:

- `git`, `node`, `pnpm`, `bun`, `pi`, and `herdr` are on `PATH`.
- The repo is cloned and `git status --short` is clean before lesson work starts.
- `herdr integration install pi` has run successfully, or the person has chosen plain terminal mode.
- `pnpm run web:check` and `pnpm run web:build` pass after `pnpm run web:install`.
- `node scripts/loop-daemon-stub.mjs` starts and prints a status server message.
- Pi can open from the repo root and either logs in or clearly asks the person to log in.
- The person can open Lesson 01 and use `/loop-lesson-01` or paste the fallback prompt.

## 1. Install host prerequisites

Recommended local host: macOS or Linux. On Windows, use WSL2 or the Docker path unless you already know how you want to run Herdr and shell tooling.

Required:

- Git
- Node 22+
- pnpm 11.9.0 through Corepack
- Bun, for the SvelteKit workshop site
- Pi
- Herdr

Optional comparison shells:

- Claude Code
- Codex
- OpenCode

The Docker image currently pins these versions as a known-good baseline:

```txt
Pi: 0.80.2
Claude Code: 2.1.195
Codex: 0.142.3
OpenCode: 1.17.11
Herdr: 0.7.1
pnpm: 11.9.0
Node: 22
```

Use exact versions when possible; newer versions are okay only when the smoke checks below still pass.

### macOS quick install

```sh
# Git and Node can come from Homebrew, mise, fnm, asdf, or your normal setup.
# This is one plain path, not the only path.
brew install git node@22 bun herdr

corepack enable
corepack prepare pnpm@11.9.0 --activate

npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.80.2
npm install -g @anthropic-ai/claude-code@2.1.195 @openai/codex@0.142.3 opencode-ai@1.17.11
```

If `node@22` is keg-only on your machine, use your Node version manager instead of fighting Homebrew path setup.

### Linux quick install

Install Git, curl, build basics, and Node 22 using your distro or Node version manager. Then:

```sh
corepack enable
corepack prepare pnpm@11.9.0 --activate

# Pi
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.80.2

# Herdr. This follows the public Herdr installer.
curl -fsSL https://herdr.dev/install.sh | sh

# Optional comparison shells.
npm install -g @anthropic-ai/claude-code@2.1.195 @openai/codex@0.142.3 opencode-ai@1.17.11
```

Pi also has an installer alternative:

```sh
curl -fsSL https://pi.dev/install.sh | sh
```

## 2. Verify the tools

Run this before cloning or changing repo files:

```sh
git --version
node --version
corepack --version
pnpm --version
bun --version
pi --version
herdr --version
```

Expected shape:

- Node prints `v22...` or newer.
- pnpm prints `11.9.0` unless you deliberately chose a newer compatible version.
- Pi and Herdr print versions instead of `command not found`.

Optional shell checks:

```sh
claude --version
codex --version
opencode --version
```

If a command is missing, stop and fix that one tool. Do not edit the workshop repo to work around a missing host dependency.

## 3. Clone the workshop repo

```sh
git clone https://github.com/joelhooks/aie-loopcraft-workshop-2026.git
cd aie-loopcraft-workshop-2026

git status --short
git log --oneline --max-count=5
```

`git status --short` should be empty before lesson work starts.

## 4. Install the Herdr Pi integration

Run this once on the host account that will use Herdr:

```sh
herdr integration install pi
```

Then start Herdr from the repo root:

```sh
herdr --session aie-loopcraft-workshop-2026
```

Inside Herdr:

1. Open a pane in the repo root.
2. Run `pi`.
3. If Pi asks for auth, the person running the machine signs in with `/login` or the provider flow Pi shows.
4. Split another pane only when the lesson asks for status/runtime output.

If Herdr is the blocker, use plain terminal mode instead of debugging the whole day away.

## 5. Plain terminal mode

Use two terminals from the repo root.

Terminal 1:

```sh
pi
```

Terminal 2, when a lesson asks for status/runtime output:

```sh
node scripts/loop-daemon-stub.mjs
```

This gives the same working shape without Herdr: one agent terminal, one runtime/status terminal.

## 6. Install and check the workshop site

The public site source lives under `web/`. It is separate from the lesson work, but checking it proves the local JavaScript toolchain is sane.

```sh
pnpm run web:install
pnpm run web:check
pnpm run web:build
```

If you want to preview the site locally:

```sh
pnpm run web:dev
```

That serves the local UI on `http://localhost:3000` for the machine running the command. If you are SSH'd into that machine, your laptop browser still needs SSH port forwarding, Tailnet Serve, Funnel, or another host-side tunnel. The same host/browser rule is explained in `docs/host-container-urls.md`.

To expose the local UI over your tailnet, run this from the host machine:

```sh
bash scripts/workshop-ui-url.sh --serve
```

Open the local URL printed by Vite, then open Lesson 01:

```txt
/lessons/01-tour-vision-repo/
```

The published site is still available here:

```txt
https://aie-loopcraft-workshop-2026.wzrrd.sh/lessons/01-tour-vision-repo/
```

## 7. Start Lesson 01

From Pi in the repo root:

```txt
/loop-lesson-01
```

If that command is unavailable, paste this fallback prompt:

```txt
/skill:grill-with-docs

Help me define a small local issue-progress loop before we write code.

Read README.md, AGENTS.md, WORKSHOP_RIG.md, lessons/, agents/skills/loopcraft-ta, agents/skills/grill-with-docs, and surface/lakebed.

Ask one question at a time. Capture what the loop should do, what it may change, what needs human approval, and what we are not building yet. Write the answers into VISION.md. Update AGENTS.md or README.md only if we agree on a clear repo rule. Do not create issue events, checks, Lakebed code, dispatch, or product code yet.
```

## 8. Save a setup receipt

Ask the agent to write a short receipt in chat, not necessarily a file:

```txt
Local setup receipt
- OS:
- Repo path:
- git status before lesson work:
- Tool versions:
- Herdr mode or terminal mode:
- Site checks run:
- Runtime/status command tested:
- Pi auth status:
- Blockers:
```

Commit only useful project changes. Do not commit host auth, shell config, raw transcripts, `node_modules`, `.svelte-kit`, `build`, or private machine paths.

## Common failures

### `pi` opens but no model is available

Use Pi's normal login flow:

```txt
/login
```

The person running the machine completes auth. The agent does not handle tokens.

### `herdr integration install pi` fails

Use plain terminal mode for the lesson, then debug Herdr separately. The workshop does not require Herdr to build the loop.

### `pnpm run web:check` fails before lesson work

Fix the local toolchain first. The site check should pass before you trust this host setup.

### `node scripts/loop-daemon-stub.mjs` starts but shows empty events

That is normal before Lesson 02. The daemon watches for `data/issue-events.jsonl` or `issues.jsonl`, which Lesson 02 creates.

### The agent wants to jump to GitHub, Linear, schedulers, or product code

Stop. The local path changes how tools run, not the lesson order. Lesson 01 is still vision and boundaries only. Lesson 02 is still local issue events and checks only.
