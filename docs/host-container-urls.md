# Host, container, and browser URLs

The workshop has more than one "local" machine in play, even when everything is on one box.

## Default rule

Make the UI reachable on the Docker host first.

```txt
Docker container serves the app
  -> Docker publishes ports on the host machine
    -> browser opens a host URL
      -> optional SSH, Tailnet, or public tunnel points at that host URL
```

The container should not create Tailnet, public, or browser-facing URLs. It serves ports. The host owns reachable URLs.

## What localhost means

`localhost` is not one place:

| Where the command/browser runs | `localhost` means |
| --- | --- |
| inside the workshop container | the container |
| in an SSH shell on the Docker host | the Docker host |
| in your laptop browser while SSH'd into another host | your laptop |
| on a phone | the phone |

So a URL can be correct from the host shell and still fail from your laptop browser.

## Workshop ports

`pnpm run workshop` starts the container with `docker compose run --service-ports`. Compose publishes the workshop ports onto the host loopback interface by default:

```txt
http://localhost:3000   # Lakebed UI on the Docker host
http://localhost:8787   # loop bridge on the Docker host
```

The default bind is host-only for safety. If you intentionally want LAN-visible ports, set `LOOPCRAFT_HOST_BIND=0.0.0.0` before starting the workshop.

## If you are SSH'd into the host

Your terminal is on the host. Your laptop browser is not.

Use one of these:

```sh
# host shell: print local host URLs and bridge health
bash scripts/workshop-ui-url.sh

# from your laptop: forward host ports through SSH
ssh -L 3000:localhost:3000 -L 8787:localhost:8787 USER@HOST

# host shell: create Tailnet HTTPS URLs
bash scripts/workshop-ui-url.sh --serve
```

## Tailnet and public URLs

Run Tailscale Serve or Funnel from the host machine, not inside Docker:

```sh
bash scripts/workshop-ui-url.sh --serve
LOOPCRAFT_PUBLIC=1 bash scripts/workshop-ui-url.sh --serve
```

The helper publishes two host-side services:

```txt
Tailnet UI URL     -> host localhost:3000
Tailnet bridge URL -> host localhost:8787
```

The UI URL includes a `?bridge=...` query string because the UI and bridge live on different origins once they are served through HTTPS ports.

## Agent debugging rule

If the UI is blank or unreachable, check the host/container URL path before editing product code:

1. Is the workshop command using `--service-ports`?
2. Does `bash scripts/workshop-ui-url.sh` pass on the host?
3. Does `curl http://localhost:8787/health` work on the host?
4. If opening from another machine, are you using SSH forwarding, Tailnet Serve, Funnel, or another host-side tunnel?
5. Is the Lakebed URL carrying the correct `?bridge=<encoded bridge URL>` value?
