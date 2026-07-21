---
layout: post
title: "Cast in Bidri Metal: Four Ancient Karnataka Board Games, Reborn in 3D"
date: 2026-07-21 09:00:00 +0530
categories: ai4good showcase
tags: [ai4good, games, karnataka, bidri, threejs, capacitor, azure, gpt-image, kannada, heritage]
image: /assets/img/2026-07-21-karnataka-bidri-board-games/hero.png
excerpt: "Four traditional Karnataka board games — Saalu Mane Ata, Aadu Huli, Chowka Bara and Alaguli Mane — rebuilt as free, offline, Kannada-first 3D games, each dressed in a hand-designed Bidri metalwork world modelled on the blackened-silver craft of Bidar. Here's the history, the artisan-matching art pipeline, and the whole build story."
---

{% assign img = '/assets/img/2026-07-21-karnataka-bidri-board-games' %}

[![Four Karnataka board games rendered as Bidri metalwork app icons]({{ img | append: '/hero.png' | relative_url }})](https://naveenneog.github.io/SaaluManeAta/)

> Before Ludo, before Snakes & Ladders left the subcontinent and came back Anglicised, our grandmothers drew boards in rice-flour on the courtyard floor and played games older than most kingdoms. This is an attempt to give four of Karnataka's own games a home that honours where they came from — **and** looks good enough to keep on your phone.

I'm **[Naveen Gopalakrishna](/AI4Good/about/)** — an AI Global Black Belt at Microsoft, a compulsive builder after hours. This #AI4Good build is four games shipped together, each its own free web app and Android APK:

| Game | What it is | Play | Get the APK |
|---|---|---|---|
| **ಸಾಲು ಮನೆ ಆಟ · Saalu Mane Ata** | Nine Men's Morris — align three, break one | [play ▶](https://naveenneog.github.io/SaaluManeAta/) | [APK](https://github.com/naveenneog/SaaluManeAta/releases/latest) |
| **ಆಡು ಹುಲಿ · Aadu Huli** | Goats & Tigers — the asymmetric hunt | [play ▶](https://naveenneog.github.io/AaduHuli/) | [APK](https://github.com/naveenneog/AaduHuli/releases/latest) |
| **ಚೌಕಾ ಬಾರಾ · Chowka Bara** | The cowrie-and-tokens race | [play ▶](https://naveenneog.github.io/ChowkaBara/) | [APK](https://github.com/naveenneog/ChowkaBara/releases/latest) |
| **ಅಳಗುಳಿ ಮನೆ · Alaguli Mane** | Pallanguzhi — the sowing & counting game | [play ▶](https://naveenneog.github.io/AlaguliMane/) | [APK](https://github.com/naveenneog/AlaguliMane/releases/latest) |

---

## The games, and where they come from

None of these are inventions. They're games with centuries — sometimes millennia — of continuous play across South India.

- **Saalu Mane Ata** (ನವಕಂಕರಿ / Nine Men's Morris) is a *mill* game — three nested squares, nine seeds a side. Form a connected line of three ("a mill") and you break one of your rival's seeds. It's pure strategy, no dice: the same family of game whose boards are scratched into the stone floors of temples at **Aihole** and into the plinths of countless *choultries*. A game of foresight.
- **Aadu Huli** (Goats & Tigers) is an *asymmetric hunt* on a triangular board — a few tigers try to leap and capture the goats, while a herd of goats tries to hem the tigers in until they cannot move. Two players, wildly different jobs. It's the South Indian cousin of *Bagh-Chal*.
- **Chowka Bara** (ಚೌಕಾಬಾರಾ / Ashta Chamma) is a **race** game played with **cowrie shells** for dice on a cross-and-circle board, with safe squares where you cannot be cut. The ancestor Ludo forgot.
- **Alaguli Mane** (Pallanguzhi) is a **mancala** — two rows of pits, seeds sown counter-clockwise, pits of four captured. No dice, no luck: just counting far enough ahead. The carved wooden *alaguli mane* board is a genuine heirloom object in Kannada and Tamil homes.

Each game ships with **multiple "worlds"** — a *Realistic* heritage board (carved teak, real seeds), an *Original* glowing-3D reading, a *Modern* interpretation, sometimes a *Fable* world — and the one this post is really about.

![Saalu Mane Ata — the Kannada-first setup screen: pick a world, an opponent, a difficulty]({{ img | append: '/app-sma.png' | relative_url }})

---

## The Bidri world — the reason this build exists

The spark for the whole project was a single question: *what would these games look like if a master craftsman of Bidar made them?*

**Bidriware** (ಬಿದರಿ) is a 14th-century metal craft from **Bidar, Karnataka**. A zinc-and-copper alloy is cast, engraved with floral and geometric *tarkashi* patterns, inlaid with **pure silver** wire, and then — the signature move — the whole surface is blackened with a special soil from the Bidar fort, a soil that darkens the alloy to a deep matte black but leaves the silver untouched and brilliant. The result is unmistakable: **jet-black metal, glowing silver inlay.** A [GI-tagged](https://en.wikipedia.org/wiki/Bidriware) craft, and one of the most striking in the world.

So every game got a **bespoke Bidri board** — not a generic skin, but a mat whose inlay is designed around *that game's* geometry:

![The four hand-designed Bidri boards — Saalu Mane Ata, Aadu Huli, Chowka Bara, Alaguli Mane]({{ img | append: '/hero.png' | relative_url }})

| | The board, cast in Bidri |
|---|---|
| **Saalu Mane Ata** | Three concentric silver-inlaid squares, floral rosette nodes at every point. |
| **Aadu Huli** | A triangular hunt-lattice with cast brass tigers and silver goats on the points. |
| **Chowka Bara** | A cross-and-circle race board, corner rosettes, cowries resting in the field. |
| **Alaguli Mane** | A two-row sowing tray, each pit ringed in silver *tarkashi*, seeds nested inside. |

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
<img src="{{ img | append: '/world-sma.jpg' | relative_url }}" alt="Bidri Saalu Mane Ata board" />
<img src="{{ img | append: '/world-ah.jpg' | relative_url }}" alt="Bidri Aadu Huli board" />
<img src="{{ img | append: '/world-cb.jpg' | relative_url }}" alt="Bidri Chowka Bara board" />
<img src="{{ img | append: '/world-am.jpg' | relative_url }}" alt="Bidri Alaguli Mane board" />
</div>

### How we matched real artisan work

Getting AI-generated art to actually *read as Bidri* — and not as "generic ornate black-and-gold" — took a tight loop:

1. **Study first.** Real Bidri is **matte black, not glossy**, the inlay is **silver, not gold**, the motifs are **floral tarkashi and geometric bands**, and the craft lives in the *contrast* — bright metal against dead-black ground. Those became hard constraints, not suggestions.
2. **Prompt to the constraints.** Every render was pushed toward *"near-black blackened-brass ground, brilliant pure-silver inlay, delicate floral tarkashi engraving, museum-quality metalwork, soft studio light with rich reflections"* using **Azure `gpt-image-2`**. Gold was allowed only as a thin rim highlight — the way a real piece catches light on its edge.
3. **Align the board to the mat.** The generated ornament had to sit *around* the playable geometry, not fight it — the central design centred on the board, the surrounding *tarkashi* filling the field, the way a craftsman composes a real tray. The mat and a **seamless table tile** were rendered as a set so the world extends past the board.
4. **Iterate on light & reflection.** Several passes were spent purely on how the silver catches light and how the black holds shadow, until each board looked like a photographed object rather than a texture.

The same pipeline produced each game's **app icon** — this game's *own* board, cast in Bidri, as the launcher art:

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
<img src="{{ img | append: '/icon-sma.png' | relative_url }}" alt="Saalu Mane Ata icon" />
<img src="{{ img | append: '/icon-ah.png' | relative_url }}" alt="Aadu Huli icon" />
<img src="{{ img | append: '/icon-cb.png' | relative_url }}" alt="Chowka Bara icon" />
<img src="{{ img | append: '/icon-am.png' | relative_url }}" alt="Alaguli Mane icon" />
</div>

The Bidri work was distilled into a reusable **"Bidri style" skill** so the look can be reproduced consistently across future builds.

---

## How it was built

The whole suite is deliberately **boring where it counts** so it can live forever for free:

- **Pure static, mobile-first, Kannada-first.** No backend, no accounts, no tracking. Every game is a folder of HTML/JS/assets served from **GitHub Pages**. The first language is **Kannada**, English second — not the other way around.
- **3D in the browser.** A shared **Three.js** game core (`game3d`) renders the boards, pieces and worlds, tuned to run on a mid-range phone. Each game is a thin ruleset on top of that shared engine.
- **Four games, one drift-locked core.** The games share ~36 modules that must stay **byte-identical** across all four. A custom **`rc-gate`** guards this: it fails the build on any drift, and also runs the full **unit-test matrix (668 tests today: Aadu Huli 206 · Alaguli Mane 161 · Chowka Bara 152 · Saalu Mane Ata 149)**, i18n coverage, JSON-schema contracts, language/voice-pack freshness, and an **asset budget**.
- **Six languages, packaged.** Kannada + English are the core; four more languages ship as **downloadable text & voice packs** so the base download stays lean (an "asset diet" with a *default-core* build that fetches optional packs from the Pages origin on demand).
- **Narration** was generated with **Azure Speech** neural voices; the loose per-clip audio was later replaced with packed narration to cut size.
- **APKs, from the same web build.** **Capacitor** wraps each game's `web/` folder; a **GitHub Actions** workflow builds a debug APK on every release (JDK 21, `cap add android`, `gradlew assembleDebug`) and attaches it to the GitHub release automatically. Push to `main` → Pages redeploys; publish a release → the APK builds itself.
- **Art & icons:** Azure `gpt-image-2`. **Everything is open source.**

![Alaguli Mane — the world picker, including the Bidri "Bidari Guli — blackened silver pits" world]({{ img | append: '/app-am.png' | relative_url }})

---

## What I learned

- **Constraints make AI art authentic.** "Ornate Indian" gets you tourist-shop clip-art. *"Matte-black blackened alloy, pure-silver tarkashi, no gold except a rim highlight"* gets you something a Bidar artisan would recognise. Research the craft, then encode it as non-negotiables.
- **A drift gate is worth more than a test suite alone** when you're shipping four near-identical apps. The single most valuable script in the repo is the one that refuses to let the four codebases diverge silently.
- **Ship the culture first, the translation second.** Building Kannada-first (not "English with a language toggle bolted on") changed how the whole UI reads. The default *is* the mother tongue.
- **Static + Capacitor is a superpower for heritage software.** One `web/` folder becomes a free website *and* an installable app, with zero servers to keep alive — exactly what you want for something meant to outlast any hosting bill.
- **A tiny asset budget forces good decisions.** Packing optional languages/voices and fetching on demand kept the base app small without cutting features.

---

## Try it

Free, offline, no account, open source. Pick a game, pick a world, and if your phone's set to Kannada — it'll greet you in Kannada.

- ▶️ **Saalu Mane Ata** — [play](https://naveenneog.github.io/SaaluManeAta/) · [APK](https://github.com/naveenneog/SaaluManeAta/releases/latest) · [source](https://github.com/naveenneog/SaaluManeAta)
- ▶️ **Aadu Huli** — [play](https://naveenneog.github.io/AaduHuli/) · [APK](https://github.com/naveenneog/AaduHuli/releases/latest) · [source](https://github.com/naveenneog/AaduHuli)
- ▶️ **Chowka Bara** — [play](https://naveenneog.github.io/ChowkaBara/) · [APK](https://github.com/naveenneog/ChowkaBara/releases/latest) · [source](https://github.com/naveenneog/ChowkaBara)
- ▶️ **Alaguli Mane** — [play](https://naveenneog.github.io/AlaguliMane/) · [APK](https://github.com/naveenneog/AlaguliMane/releases/latest) · [source](https://github.com/naveenneog/AlaguliMane)

If you have grandparents who played these on a courtyard floor, show them the Bidri board. That reaction is the whole point.
