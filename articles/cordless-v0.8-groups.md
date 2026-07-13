---
title: 'cordless v0.8: Tab Groups, Custom Launchers & Bring-Your-Own Copilot'
published: true
description: 'Running so many agent sessions they overflow the screen? cordless v0.8 gives them Chrome-style tab groups, lets you define your own launchers (and ships a built-in GitHub Copilot CLI profile), renames tabs, and keeps each session''s scrollback across a reboot — plus the story of a graceful-shutdown bug that only failed on Linux.'
tags: 'ai4good, cli, terminal, productivity'
cover_image: 'https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-13-cordless-v0.8-groups/card.png'
canonical_url: 'https://naveenneog.github.io/AI4Good/2026/07/13/cordless-v0.8-groups/'
---

> **TL;DR** — [cordless](https://naveenneog.github.io/cordless/) is a CLI-first tool that manages your remote terminal / coding-agent sessions and puts them on your phone. **v0.8** is about *organising* the swarm: **Chrome-mobile-style tab groups**, **custom launchers** (bring any command as a profile), a built-in **GitHub Copilot CLI** profile, **renameable tabs**, and **persisted scrollback history** so a reopened session after a reboot shows what it was doing. There's also a proper **`cordless setup`** installer. Six features, each on its own branch — designed with **GPT-5.6 Sol**, built with **GitHub Copilot CLI**.

[![cordless v0.8 — tab groups, custom launchers, Copilot](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-13-cordless-v0.8-groups/card.png)](https://naveenneog.github.io/cordless/)

v0.7 taught cordless to tell me *which* of my eight agent sessions needs me. v0.8 is the next problem: once you're running that many, they stop fitting on the screen. You need to **organise** them — like browser tabs, because that was the whole metaphor from day one. So this release is six features that make a big session swarm manageable.

## Tab groups

The headline. Sessions can now live in **named, colored groups** — think "API migration", "Website", "Flaky tests" — exactly like Chrome mobile's tab groups.

In the terminal dashboard, groups render as **collapsible headers** with a live per-group waiting/session count:

```text
── Sessions (6) ──
▼ API migration          2 waiting · 3 sessions
  ! claude   build pipeline            waiting
  ● codex    api tests                 working
  ○ shell    api ~/src/api             idle
▶ Website                              2 sessions
▼ Ungrouped                            1 session
    ○ copilot scratch                  idle
```

Press `g` for the group menu (new / assign / ungroup / collapse / rename / delete), and `f` to cycle a **smart-view filter** — `All · Attention · Claude · Codex · Copilot · Shell`. Those filters are *views*, not groups; collapse state is per-device. On the **phone** you get the same idea as a chip strip above the tabs (All · Unread · one chip per group, with counts and color dots) plus rename/move in the details sheet.

The design decision I kept going back and forth on — and where Sol was firm — was **manual groups over continuous auto-grouping**. Auto-sorting your tabs by directory sounds clever until a session changes cwd and silently jumps groups. So groups are something you *choose*; deleting one never kills its sessions, it just ungroups them.

## Custom launchers (and a built-in Copilot)

Until now cordless had three profiles: `shell`, `claude`, `codex`. v0.8 makes profiles **yours**. Drop this in `~/.cordless/config.json`:

```json
"profiles": {
  "api": { "command": "pwsh", "args": ["-NoLogo"], "cwd": "C:/src/api" },
  "notes": { "command": "nvim", "args": ["~/notes.md"] }
}
```

…and `cordless new api` spawns it directly (resolved against the daemon's `PATH`, not a shell string — no `sh -c` injection surface). A missing executable doesn't crash anything; it shows as **unavailable** with a reason, and `cordless profiles` lists every launcher with its source and availability.

And because the agent world moved, v0.8 ships a built-in **`copilot`** profile — the standalone **GitHub Copilot CLI** — right next to `claude` and `codex`. The nice part: attention detection is now **preset-driven**, so `copilot` (and any custom profile you tag `attentionPreset: "agent"`) gets the same *waiting / finished* heuristics the other agents get, for free.

## Rename tabs

Small feature, big daily quality-of-life. `cordless rename <id> "API migration"`, or the dashboard `e` key, or a long-press on the phone. Titles are Unicode-normalized, control-stripped and length-capped, an empty title restores the generated default, and the change **broadcasts live** to every connected client (with a monotonic revision so a stale update can't clobber a newer one).

## Persisted history — survive the reboot

This is the one that turned into a proper engineering story. A cordless session already survives a *daemon restart* (it reopens the same shell in the same directory). But it came back **blank** — you lost the scrollback. v0.8 fixes that: the daemon persists a **capped, plain-text** copy of each session's scrollback (2000 lines / 512 KB, gzipped, user-only) and, on restore, shows it as **frozen context above** the reopened session with a `── session reopened after system restart ──` banner.

A couple of decisions worth calling out:

- **Normalized text, not raw bytes.** Sol talked me out of persisting a truncated ANSI stream (it can start mid-escape-sequence and depends on terminal state you've discarded). We store logical lines from the headless terminal buffer instead.
- **Don't write it into the fresh terminal.** My first version injected the old scrollback *into* the reopened shell — which promptly wiped it, because a shell like PowerShell clears its own screen on startup. So restored history is kept *beside* the live session and rendered above it.
- **Save periodically, not just on shutdown.** A reboot doesn't send you a polite shutdown signal, so history is flushed every few seconds while the session runs.

## The bug that only failed on Linux

Here's the part I'm glad CI caught. My persisted-history tests were **green on Windows** and I shipped v0.8.0. The **Linux and macOS** CLI builds went red on the exact same test.

The cause is a lovely cross-platform trap. On a graceful stop, the daemon catches `SIGTERM` and runs `shutdown()`: it saves each session's history, then kills the PTYs. Killing a PTY fires its exit handler — and *that* handler deleted the just-saved history **and** rewrote the "reopen these on restart" manifest without the now-exited session. So on Linux the session came back with no history; on macOS it didn't come back at all.

Why did Windows pass? Because on Windows `SIGTERM` from another process is an **uncatchable hard-kill** — `shutdown()` never runs, the exit handler never fires, and the periodically-flushed history file just… survives. The platform that "worked" only worked by accident.

The fix is a `_shuttingDown` flag so the exit handler preserves history and the manifest during a graceful stop. What I like about it: I reproduced the Linux-only failure **on Windows** by driving `shutdown()` directly in a unit test (the harness's `SIGTERM` can't), so the regression is now locked shut on every platform. Re-tagged, rebuilt, and v0.8.0 went out clean with the full asset set.

## How it was built

Same loop, tightened further: **me on GitHub Copilot CLI, GPT-5.6 Sol as the design partner** — and this time with a rule I'm keeping for good: **every feature on its own branch, merged `--no-ff`, with clean well-documented code**. The v0.8 program was six branches (`feature/persisted-history`, `feature/custom-profiles`, `feature/copilot-profile`, `feature/session-rename`, `feature/session-groups`, `feature/group-ui-phone`) plus a `fix/history-shutdown`. The daemon's test harness grew to **24 suites** — the pure profile/attention/render checks, live rename + groups over the WebSocket, the dashboard-driven resume regression, and persisted-history across a real restart — and CI runs all of it on Windows, Linux and macOS before building and smoke-testing the self-contained binary.

## The good

The feeling I was chasing: open cordless with a dozen agents running and not feel underwater. The waiting ones surface (v0.7); the rest are **filed into groups** you named, launched from **profiles** you defined, titled how *you* think about them — and if the box reboots overnight, each one comes back **with its history intact**. It's the browser-tabs promise, finally delivered for a swarm of terminals.

## Try it

- ▶️ **Live / docs:** [naveenneog.github.io/cordless](https://naveenneog.github.io/cordless/)
- 💻 **cordless CLI (Windows / Linux, no Node needed):** [github.com/naveenneog/cordless/releases/latest](https://github.com/naveenneog/cordless/releases/latest) — then `cordless setup`
- 📦 **Android APK:** [github.com/naveenneog/cordless/releases/latest](https://github.com/naveenneog/cordless/releases/latest)
- 🧑‍💻 **Source:** [github.com/naveenneog/cordless](https://github.com/naveenneog/cordless)

*Part of the [#AI4Good](https://naveenneog.github.io/AI4Good/2026/07/10/ai4good-an-app-a-day/) series. Built one day at a time. — [@naveenneog](https://github.com/naveenneog)*
