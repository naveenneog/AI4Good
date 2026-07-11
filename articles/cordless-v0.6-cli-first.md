---
title: "cordless v0.6: Going CLI-First — Run It, Scan the QR, You're Paired"
published: true
description: "A course-correction reshaped cordless: the CLI is the product now. Run `cordless`, and it opens a full-screen terminal dashboard whose starting screen is a live pairing QR. It ships as one self-contained binary — its own Node runtime and node-pty inside — so there's nothing to install first."
tags: ai4good, cli, terminal, nodejs
cover_image: https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-11-cordless-v0.6-cli-first/card.png
canonical_url: https://naveenneog.github.io/AI4Good/2026/07/11/cordless-v0.6-cli-first/
---

> **TL;DR** — [cordless](https://naveenneog.github.io/cordless/) manages your remote terminal / coding-agent (Claude Code, Codex) sessions and puts them on your phone. **v0.6** makes it **CLI-first**: run `cordless` and it opens a full-screen terminal **dashboard** whose starting screen shows a **live pairing QR** — scan it, done. No separate `cordless pair`, no GUI to babysit. And it now ships as **one self-contained binary** (its own Node runtime **and** `node-pty` baked in), so there's nothing to install first. Designed in a running debate with **GPT-5.6 Sol**, built with **GitHub Copilot CLI**.

[![cordless v0.6 — the CLI-first dashboard](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-11-cordless-v0.6-cli-first/card.png)](https://naveenneog.github.io/cordless/)

Every version so far treated cordless as "a daemon plus a phone app." Then the owner said something that reframed the whole thing:

> *"cordless should be a **CLI first**. Look at the design of a terminal app and get the features from that. I want an installer that starts cordless as a proper terminal with a QR to pair on its starting screen — right now I run `cordless pair` separately and pair the desktop and mobile apps independently, which defeats the purpose."*

That's a redesign, not a tweak. So I opened a long debate with Sol and rebuilt the front door.

## cordless *is* the terminal now

Run `cordless` with no arguments and you get the screen on that card: a brand banner, daemon + Tailscale status, your session list, and — front and center — a **single-use pairing QR with a countdown**. Scan it with the phone app and you're paired. Press `p` for a fresh code. No second command, no separate terminal.

Borrowing from modern terminal apps (Warp, Windows Terminal, iTerm2) — but deliberately *not* rebuilding one — the dashboard is a focused TUI: `↑/↓` selects a session, `Enter` attaches, `n` starts a shell / Claude / Codex, `x` kills, `d` manages paired devices, `q` leaves. It's a **thin client of a persistent daemon**: quitting the dashboard (or closing the terminal) never stops your sessions or the phone connection — the daemon keeps owning the PTYs. Sol was firm on that boundary, and it's the right one.

## Attach right there in your terminal

`Enter` (or `cordless attach <id>`) streams a session **straight into your host terminal** — no xterm.js, no second renderer. Raw keystrokes go to the PTY, resize events forward, and the detach chord is `Ctrl-] d`. It's a tiny tmux-like attach that reuses the exact replay/snapshot protocol the phone uses. The host terminal *is* the renderer; cordless just pipes bytes.

## Pairing is daemon-owned now

The old `cordless pair` minted a secret by writing a file directly. Sol flagged that: two processes minting into the same store invites races and inconsistent limits. So in v0.6 there's **one** authenticated `pairing.create` over the WebSocket, and it can only be called by a **loopback-scoped credential from a real loopback socket** — the local machine's owner, never a remote phone. It's single-use, 256-bit, five-minute TTL, rate-limited, and capped. Both the dashboard and `cordless pair` call the same path. A stolen phone token can't enroll new devices; only *you*, at the machine, can.

## One binary, no Node required

The biggest ask hiding in "an installer that just works" is: **don't make me install Node first.** So v0.6 ships a self-contained executable built with **Node's Single Executable Application** support:

1. `esbuild` bundles the whole CLI into one file (with `node-pty` marked external).
2. Node generates a SEA blob from that bundle.
3. The blob is injected into a copy of the Node runtime → `cordless.exe`.
4. `node-pty` and the built web client ship **beside** the exe under `resources/`, and a small loader resolves the native module from there.

The trick that made it painless: `node-pty` ships **node-api prebuilds**, which are ABI-stable across Node versions — so there's no fragile per-version native rebuild. The result is a ~45 MB download that runs the dashboard, spawns real PTYs, and serves the web client for your phone, all with **zero prerequisites**. CI builds and **smoke-tests** it (start → spawn a PTY → stop) on Windows and Linux; macOS is built the same way but still has a runner-specific `node-pty` spawn quirk I'm chasing, so it's flagged as pending for now.

## How it was built

The same loop as the whole project — me on **GitHub Copilot CLI**, **Sol** as the design partner — but this time the pivot leaned hard on Sol's judgment: run the daemon in-process or as a persistent service? (service). How interactive should the TUI be for v0.6? (dashboard + minimal attach, not a pane framework). `pkg` or Node SEA? (SEA, with node-pty external). Keeping the conversation **stateful** meant Sol weighed each answer against every prior decision instead of re-litigating them. Ten test suites — protocol E2E, security headers, loopback-scope enforcement, daemon-owned pairing, the CLI client, dashboard rendering, and restore-across-restart — stay green on every push.

## The good

The onboarding is finally one motion: **install cordless, run it, scan the QR.** No Node, no `npm install -g`, no separate pairing step, no GUI to keep open. It reads like a real terminal tool because it *is* one — and the phone still gets the same live sessions. Turning a "daemon + app" into "a command you run" is exactly the kind of course-correction that only lands when you actually live with the thing.

## Try it

- ▶️ **Live / docs:** [naveenneog.github.io/cordless](https://naveenneog.github.io/cordless/)
- 💻 **cordless CLI (Windows / Linux, no Node needed):** [github.com/naveenneog/cordless/releases/latest](https://github.com/naveenneog/cordless/releases/latest)
- 📦 **Android APK:** [github.com/naveenneog/cordless/releases/latest](https://github.com/naveenneog/cordless/releases/latest)
- 🧑‍💻 **Source:** [github.com/naveenneog/cordless](https://github.com/naveenneog/cordless)

*Part of the #AI4Good series. Built one day at a time. — [@naveenneog](https://github.com/naveenneog)*
