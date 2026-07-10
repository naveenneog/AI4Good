---
layout: post
title: "cordless: Managing Remote Terminals & Coding Agents From My Phone, Like Browser Tabs"
date: 2026-07-10 20:00:00 +0530
categories: ai4good showcase
tags: [ai4good, terminal, nodejs, capacitor, xterm, tailscale, copilot-cli, gpt-5-6-sol]
image: /assets/img/2026-07-10-cordless-remote-terminals-in-your-pocket/hero.png
excerpt: "I built cordless — a phone app that manages many remote PTY / Claude Code / Codex sessions like browser tabs, with sessions that survive disconnects and replay on reconnect. Here's the honest build story: designing it in tandem with GPT-5.6 Sol, the 12 real bugs the review caught, security baked in, and the CORS bug that only a real Android emulator could surface."
---

{% assign img = '/assets/img/2026-07-10-cordless-remote-terminals-in-your-pocket' %}

> **TL;DR** — `cordless` is a tiny **Node daemon** on your dev box that owns real terminal sessions (a shell, or `claude` / `codex`), plus a **phone app** that attaches to them **like browser tabs**. Close the app, switch networks, come back later — your sessions are still running and **replay exactly where you left off**. I designed it in a running conversation with **GPT-5.6 Sol** on Azure, built it with **GitHub Copilot CLI**, and verified it in a **real browser _and_ a real Android emulator**. Live: **[naveenneog.github.io/cordless](https://naveenneog.github.io/cordless/)**.

[![cordless — remote terminals in your pocket]({{ img | append: '/hero.png' | relative_url }})](https://naveenneog.github.io/cordless/)

I keep leaving long-running coding-agent sessions on my dev box — a `claude` chewing through a refactor, a build, a shell mid-task — and then walking away from the keyboard. I wanted to **check on them and steer them from my phone**, the way I flip between browser tabs. Not SSH-in-a-box; something that treats each agent session as a first-class **tab** that keeps living when my phone sleeps. So I built **cordless**.

## What it is

- **Persistent sessions.** The PTYs live in the daemon. Your phone disconnecting, backgrounding, or hopping from Wi‑Fi to cellular doesn't kill anything. Reconnecting **replays from your last-seen byte** — or a full-screen snapshot if you were away a while.
- **Tabs for terminals.** Run several Claude Code / Codex / shell sessions at once and switch instantly, with an unread dot when a background session produces output.
- **Touch-first.** A real terminal is unusable with thumbs without help, so there's an on-screen **key bar**: Esc, Tab, Ctrl/Alt (one-shot latches), arrows, Ctrl‑C/D, pipes, and paste.
- **Reach it from anywhere.** Tailscale is the recommended path; same‑Wi‑Fi LAN also works. No ports exposed to the internet.
- **Web _or_ native.** Install the PWA straight from your phone browser, or grab the Android APK.

<p align="center">
  <img src="{{ img | append: '/pairing.png' | relative_url }}" width="31%" alt="pairing screen" />
  <img src="{{ img | append: '/terminal.png' | relative_url }}" width="31%" alt="connected terminal" />
  <img src="{{ img | append: '/keybar.png' | relative_url }}" width="31%" alt="touch key bar" />
</p>

## How it was built

### Designed in tandem with GPT‑5.6 Sol

The interesting part of this build is that I didn't architect it alone. I kept a **stateful conversation** with **GPT‑5.6 Sol** (deployed on my Azure AI Foundry) open the entire time — not one-off prompts, but a running transcript so it stayed consistent with every prior decision. Sol produced the initial architecture, and then, crucially, **reviewed my actual code**. That review earned its keep.

### The agent: node-pty, not tmux

Each session is a real pseudo-terminal spawned with **`node-pty`** (ConPTY on Windows — which, pleasingly, built on Node 26 first try; a Unix PTY on macOS/Linux). I deliberately **did not** use tmux: the daemon is *already* the multiplexer, and tmux adds nested-terminal state, sizing quirks, and a Windows install problem. Every session is a PTY **plus** a headless [`@xterm/headless`](https://www.npmjs.com/package/@xterm/headless) mirror (for snapshots) **plus** an 8 MiB **replay ring**.

The subtle bug Sol caught here: `@xterm/headless`'s `write()` is asynchronous, and `reset()` is **not** ordered behind queued writes. So I route every terminal write and every snapshot through **one per-session op queue**, and assign a batch's sequence number **inside the write callback** — which keeps the replay ring, the sequence counter, and `serialize()` perfectly consistent. Output is coalesced into ~16 ms / 32 KiB batches, one sequence number per batch.

```js
// one op queue per session; seq assigned only after the bytes are parsed
this._queueOp(() => new Promise((resolve) => {
  this.term.write(batch, () => {
    const seq = this._nextSeq++;
    this._pushRing(seq, batch);   // ring, counter and headless mirror advance together
    this._broadcast(seq, batch);
    resolve();
  });
}));
```

That consistency is what makes **reconnect-with-replay** honest: attach with your last `seq`, and the server either replays the ring from there or, if it's rolled past, serializes the headless terminal into a single reset snapshot. tmux-style survival, without tmux.

### The client, and the 12 bugs the review caught

The app is Vite + React + **[xterm.js](https://xtermjs.org/)**, served by the daemon itself so the PWA is same-origin. I wrote the connection layer, thought it was solid… and handed the whole file to Sol for review. It came back with **twelve real issues** — not style nits, actual races:

- stale-epoch writes **duplicating output** after a reconnect,
- the duplicate-frame check gating on the wrong counter (applied vs received seq),
- **duplicate-attach** and detach-during-attach races,
- an ack timer that **leaked across reconnects** and cleared a fresh ack,
- Ctrl/Alt latches that could get **stuck**,
- "close tab" silently **undone** by the next session-list poll.

The fix pattern throughout: give every socket a **connection epoch** that every handler, timer, and promise verifies; serialize each tab's writes through an **apply-chain**; and use **generation counters** for attach/detach and resize. Boring, correct, and exactly the kind of thing a fresh reviewer spots that the author's brain has already glossed over.

### Security, baked in from the start

Because a paired device gets **shell access to my machine**, security couldn't be an afterthought:

- **Per-device tokens**, only their SHA‑256 hashes stored on the box; revoke any device by id.
- **Single-use, rate-limited QR pairing** — and the pairing secret rides in the URL **fragment**, so it's never sent to (or logged by) the server.
- An **Origin allowlist** on the WebSocket and pairing endpoints (blocks malicious web pages / DNS-rebinding), a strict **CSP** (`script-src 'self'`, no inline JS), and `no-store` on every credential-bearing response.
- The daemon **warns if you run it as root/Administrator** and binds with a clear least-privilege note.

There's a small automated suite that asserts all of this (cross-origin pairing → 403, cross-origin WebSocket → rejected, headers present) so it can't quietly regress.

### The bug only a real emulator could find

Here's my favorite part. Everything worked perfectly as a **PWA** — because the browser served the app and the agent from the **same origin**. Then I packaged the Android APK with **Capacitor** and installed it on an emulator. Pairing failed instantly: **"Failed to fetch."**

The cause was genuinely educational. Inside a Capacitor WebView the app's origin is `http://localhost`, so talking to the agent is **cross-origin** — which triggers a **CORS preflight** my server had never needed to handle, because the same-origin PWA never sent one. The fix was to add CORS **scoped to the existing Origin allowlist** (echo `Access-Control-Allow-Origin` for allowed origins, answer the `OPTIONS` preflight, and — Sol's catch — answer the **Private Network Access** preflight that Chromium sends when reaching a LAN/Tailscale address). A bug that would have broken **every** native-app user, invisible until I drove the real APK.

After the fix, the emulator paired, connected over WebSocket, attached a session, rendered PowerShell output, and **replayed full session history on reconnect** — the whole loop, natively.

### Shipping it

The Android APK is built by **GitHub Actions on every `v*` tag** (debug-signed, `androidScheme: http` + cleartext so `ws://` to a Tailscale IP works) and attached straight to the release. The landing page is GitHub Pages. Networking is **Tailscale-first**: WireGuard encrypts the hop, you get a stable `*.ts.net` name, and port 7443 never touches the public internet.

## The good

Sessions that **outlive the client** turn a phone from a read-only status screen into a real remote control for long-running agents. Check a `claude` refactor from the sofa, unstick a build on the train, tap Ctrl‑C on a runaway process — then walk back to your desk and the exact same sessions are there in the browser. And because the whole thing is token-gated, Tailscale-scoped, and never exposed publicly, it stays *yours*.

The meta-lesson: **pairing a builder (me, via Copilot CLI) with a dedicated reviewer (GPT‑5.6 Sol) in a persistent conversation** produced noticeably better engineering than either alone — the 12-bug review and the CORS catch are things I'd have shipped without. And testing on a **real emulator, not just a browser** is what turned "looks done" into "actually works."

## Try it

- ▶️ **Live / install the PWA:** [naveenneog.github.io/cordless](https://naveenneog.github.io/cordless/)
- 📦 **Android APK:** [github.com/naveenneog/cordless/releases/latest](https://github.com/naveenneog/cordless/releases/latest)
- 💻 **Source:** [github.com/naveenneog/cordless](https://github.com/naveenneog/cordless)

*Part of the [#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/) series. Built one day at a time. — [@naveenneog](https://github.com/naveenneog)*
