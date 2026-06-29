# Pi local config

This folder is intentionally tiny at the start. The learner guidance lives in the local Loopcraft TA skill under `agents/skills/loopcraft-ta` and is exposed to Pi through `.agents/skills`.

Do not auto-install project Pi packages from here. A host machine may already have the same extensions installed globally, and duplicate tool names make `pi` fail before the session opens. If a learner needs extra Pi packages, install them in that machine's global Pi config or load them explicitly for that run.
