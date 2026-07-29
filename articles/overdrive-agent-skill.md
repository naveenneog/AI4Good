---
title: 'Overdrive: An Open-Source Skill That Makes Your Coding Agent Stop Settling for Correct'
published: true
description: Five frontier-model 'absolute ceiling' evaluation prompts across five unrelated domains turned out to share one identical skeleton. I extracted it into an agent skill. One npx command installs it into GitHub Copilot CLI and Claude Code.
tags: 'ai, opensource, productivity, devtools'
cover_image: 'https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-29-overdrive-agent-skill/card.png'
canonical_url: 'https://naveenneog.github.io/AI4Good/2026/07/29/overdrive-agent-skill/'
id: 4260839
date: '2026-07-29T08:51:47Z'
---
[![Overdrive — a capability amplifier for coding agents, installed with a single npx command](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-29-overdrive-agent-skill/card.png)](https://github.com/naveenneog/overdrive)

> Most of the gap between a mediocre answer and an exceptional one from the same model isn't capability. It's **standards**. Overdrive is the standards, written down and installed.

```bash
npx github:naveenneog/overdrive
```

I'm **[Naveen Gopalakrishna](https://naveenneog.github.io/AI4Good/about/)** — an AI Global Black Belt at Microsoft, a compulsive builder after hours. This #AI4Good release is a tool rather than an app: an open-source **agent skill** that changes how hard your coding agent works.

- 💻 **Source (MIT):** [github.com/naveenneog/overdrive](https://github.com/naveenneog/overdrive)
- ⚡ **Install:** `npx github:naveenneog/overdrive`
- 🤖 **Works with:** GitHub Copilot CLI · Claude Code

---

## Where it came from

I'd collected a handful of those "show me the absolute ceiling of what you can do" prompts that get used to evaluate frontier models against each other. Five of them, in five completely unrelated domains:

1. Advanced web design
2. Real-time 3D
3. Motion graphics
4. A playable game
5. A private-wealth investment deck

A deck and a shader have nothing in common. But reading the five side by side, the *shape* of them was *identical*. Every one of them:

- framed **the ceiling**, not the requirement — "the best thing you can produce", explicitly compared against other models, explicitly credited to you by name
- told the model **to decide and commit** rather than ask which direction you'd prefer, and said the ambition of that choice was itself part of the score
- named the **boring, obvious, median answer** up front so it could be ruled out
- demanded **research**, not memory
- offered a **non-exhaustive buffet** of advanced techniques and asked for several, integrated
- held **one dominant success criterion** above everything else — fun in thirty seconds; timing; 60fps; taste; defensibility
- required **original assets** rather than borrowed ones
- ended with *"QA it by actually using it"*

That's not five prompts. That's one prompt wearing five costumes. So I extracted the skeleton and made it a skill.

---

## What it actually is

**Overdrive is a judgement layer, not a domain skill.** It doesn't know how to build a game or write a deck. It changes *how hard and how well* the agent attacks whatever it was already going to do.

Ten rules override the agent's normal defaults when it's on. The two that change the most behaviour:

> **Decide and commit — never ask.** Where the task leaves a choice open — concept, subject, genre, stack, angle — *you choose*. The ambition of that choice is part of the score. Asking "which would you like?" is a wasted turn.

> **QA by actually using it.** Run it, play it, scroll it, watch it, read it end to end, stress it. An unrun deliverable is an unfinished deliverable.

The rest: frame the ceiling, name the median answer and refuse it, research instead of recalling, stack techniques rather than bolting one on, hold one dominant criterion, generate rather than borrow, survive inspection past the first screen, and red-team your own work then *fix what the attack found*.

### Seven phases

The skill runs the work through: **set the bar** (write `DOMAIN / CEILING / DOMINANT` in three lines) → **commit to a concept** in one sentence → **research** → **choose amplifiers** → **build with the dominant criterion in front** → **red-team** → **QA for real**.

### A rubric it has to report

Before declaring done, the agent scores itself 1–5 and **shows you the scores**:

| Dimension | 5 = |
|---|---|
| Ambition of the choice | The concept is impressive before a line is written |
| Dominant criterion | The one thing that matters is genuinely nailed |
| Technical depth | Multiple advanced techniques, composed — not bolted on |
| Craft / finish | Nothing default; deliberate typography, timing, naming, structure |
| Coherence | One clear point of view carried through every part |
| Originality | Assets, analysis and structure are yours, not borrowed |
| Robustness | Runs clean: no errors, no stutter, no overflow, no dead link |
| Honesty | Claims are sourced; estimates are labelled; limits are stated |

Anything scoring ≤3 gets another pass. Scoring in the open is a forcing function — it's uncomfortable to hand someone a 3 you've written down yourself.

---

## What's in the box

| File | What it does |
|---|---|
| `SKILL.md` | The contract, the seven phases, the rubric, the failure modes, and when *not* to use it |
| `references/amplifiers.md` | Nine domain packs — web, real-time 3D, motion graphics, games, audio, research & decks, systems, data viz, writing. Each with its dominant criterion, technique buffet, library shortlist and QA moves |
| `references/red-team.md` | Five questions, an inversion pass, a contrast pass, how to delegate the red team to a sub-agent, and the bar for what must get fixed |
| `references/qa-protocol.md` | Per-domain "actually use it" QA, a browser harness, and the ship checklist |
| `references/research-protocol.md` | What always needs looking up, sourcing rules, and how to label an estimate as an estimate |
| `references/prompt-templates.md` | Paste-ready Overdrive prompts for when *you* are the one prompting a model |
| `scripts/qa_web.mjs` | Playwright harness — console/page errors, failed requests, horizontal overflow per viewport, FPS sampling, screenshots |

---

## Installing it

One command, zero runtime dependencies — the installer is plain Node and copies seven files:

```bash
# everywhere it finds an agent
npx github:naveenneog/overdrive

# or pick one
npx github:naveenneog/overdrive --claude
npx github:naveenneog/overdrive --copilot

# per-repo instead of your home directory
npx github:naveenneog/overdrive --project

# what's detected, what's already installed
npx github:naveenneog/overdrive --list
```

It lands in `~/.copilot/skills/overdrive` and `~/.claude/skills/overdrive`. There's `--force`, `--dry-run`, `--dir <path>` and `--uninstall` too.

Then start a **new** agent session and say **"overdrive"** — or *"go all out"*, *"show me the ceiling"*, *"don't hold back"*, *"make it a portfolio piece"*, *"this is going public"*.

---

## Does it actually do anything?

Fair question, and the honest answer is that a prompt-shaped tool is easy to fool yourself about. So here's the concrete case.

The [**ANTIKYTHERA**](https://naveenneog.github.io/Antikythera/) title sequence — [written up here](https://naveenneog.github.io/AI4Good/2026/07/26/antikythera-generative-title-sequence/) — was built under Overdrive from a single prompt. A 29-second documentary title sequence in one self-contained HTML file: procedural bronze gear geometry at authentic Antikythera tooth counts, a hand-written post-processing chain, a fully synthesised Web Audio score, no assets of any kind.

But the output isn't the interesting part. **Phase 7 is.**

*QA by actually using it* is trivial for a human and structurally impossible for an agent — it can't watch a film. So it built itself an eye: installed Playwright, exposed a transport API from the piece, captured 90 frames across the runtime, assembled them into a contact sheet, and looked at the whole edit as one image.

That caught seven defects that reading the code never would have:

- a wrapper `div`'s `z-index` created a stacking context that **isolated `mix-blend-mode` from the canvas** — film grain rendered as raw grey static over everything
- GSAP read a CSS `translateY(112%)` back as resolved *pixels* into its `y` cache, so the later `yPercent` tween animated a different axis and **the title never appeared** — while the tween reported `progress: 1`
- the eclipsing moon's circles sat at SVG origin instead of the orrery centre, so **totality never happened**
- the title wrapped onto two lines mid-animation
- flash frames held 0.35s and read as an error rather than a cut
- the corona quad's square edge was visible against the starfield
- point-light intensities were in physical units on a renderer defaulting to legacy lighting, blowing an entire act to white

Every one of those is invisible in source and obvious in a screenshot. Without the "actually use it" clause, that piece ships broken and *looks* finished in the diff.

That's the mechanism. Not better code generation — **better standards, and a refusal to declare done without evidence.**

---

## When not to use it

The skill says this itself, which I think matters more than the feature list. Overdrive costs time and tokens, and it explicitly tells the agent **not** to apply it to:

- trivial mechanical edits — renames, version bumps, typos
- anything you've said you want quick, minimal or throwaway
- hotfixes under time pressure, where correctness and reversibility beat ambition
- work with a hard external spec — an API contract, a compliance form — where invention is the enemy

A capability amplifier that fires on everything is just an expensive way to over-engineer a typo fix.

---

## The good

Skills are the most underrated part of the current agent tooling, and they're just **markdown in a folder**. No SDK, no plugin API, no build. Which means the thing that separates a good agent session from a great one is largely *writing down what "great" means* — and that's a skill anyone can author, read, disagree with, and fork.

Overdrive is MIT. If your standards differ from mine, rewrite the rubric — that's the point. The interesting artifact isn't my eight dimensions. It's that eight dimensions written down at all beats infinite capability with no bar.

---

## Try it

- ⚡ **Install:** `npx github:naveenneog/overdrive`
- 💻 **Source (MIT):** [github.com/naveenneog/overdrive](https://github.com/naveenneog/overdrive)
- 🎬 **Built with it:** [ANTIKYTHERA](https://naveenneog.github.io/Antikythera/) · [the write-up](https://naveenneog.github.io/AI4Good/2026/07/26/antikythera-generative-title-sequence/)
