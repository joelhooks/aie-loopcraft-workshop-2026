# Lesson 04: Control the loop from Pi and Herdr

## Challenge

Make the loop visible and controllable from the operator harness.

## Starter prompt

```txt
Add the smallest local control plane for the issue loop: a bridge/status process, machine-readable check output, and Pi controls to inspect or trigger a check. Keep Herdr visible with an operator pane and a daemon/status pane.
```

## Build / operate

Expected work:

- bridge/status process with health, status, and check-now behavior
- Pi command/tool/extension path that can inspect or trigger the check
- Herdr two-pane workflow: Pi operator pane plus loop/status pane
- status output that says whether the bridge is fresh, stale, running, or stopped

## Observe

Run a check from Pi and watch the daemon/status pane. Confirm the latest receipt and status update agree.

## Discuss

Pi is not only the chat box. It can become the harness around the machine. Herdr makes process state visible instead of hidden in “the agent is thinking.”

## Checkpoint

You can start/inspect/check the loop from Pi and see matching status in the side pane.

## Small drill

Diagnose a stale loop by checking: bridge status, last receipt, wake/check state, and pane output.

## Fade for next lesson

Next lesson uses the control plane to progress one ready work item safely.

## Run-06 scar

The repeated “poke it / kick it / it died again” turns are why freshness, heartbeat, and visible controls are part of the product, not polish.
