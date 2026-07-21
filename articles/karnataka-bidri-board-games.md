---
title: 'Cast in Bidri Metal: Four Ancient Karnataka Board Games, Reborn in 3D'
published: true
description: 'Four traditional Karnataka board games rebuilt as free, offline, Kannada-first 3D games, each dressed in a hand-designed Bidri metalwork world modelled on the blackened-silver craft of Bidar. The history, the artisan-matching art pipeline, and the whole build story.'
tags: 'ai4good, gamedev, threejs, opensource'
cover_image: 'https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/hero.png'
canonical_url: 'https://naveenneog.github.io/AI4Good/2026/07/21/karnataka-bidri-board-games/'
id: 4199079
date: '2026-07-21T17:27:06Z'
---

![Four Karnataka board games rendered as Bidri metalwork app icons](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/hero.png)

> Before Ludo, before Snakes & Ladders left the subcontinent and came back Anglicised, our grandmothers drew boards in rice-flour on the courtyard floor and played games older than most kingdoms. This is an attempt to give four of Karnataka's own games a home that honours where they came from — **and** looks good enough to keep on your phone.

I'm **Naveen Gopalakrishna** — an AI Global Black Belt at Microsoft, a compulsive builder after hours. This #AI4Good build is four games shipped together, each its own free web app and Android APK:

| Game | What it is | Play | Get the APK |
|---|---|---|---|
| **ಸಾಲು ಮನೆ ಆಟ · Saalu Mane Ata** | Nine Men's Morris — align three, break one | [play](https://naveenneog.github.io/SaaluManeAta/) | [APK](https://github.com/naveenneog/SaaluManeAta/releases/latest) |
| **ಆಡು ಹುಲಿ · Aadu Huli** | Goats & Tigers — the asymmetric hunt | [play](https://naveenneog.github.io/AaduHuli/) | [APK](https://github.com/naveenneog/AaduHuli/releases/latest) |
| **ಚೌಕಾ ಬಾರಾ · Chowka Bara** | The cowrie-and-tokens race | [play](https://naveenneog.github.io/ChowkaBara/) | [APK](https://github.com/naveenneog/ChowkaBara/releases/latest) |
| **ಅಳಗುಳಿ ಮನೆ · Alaguli Mane** | Pallanguzhi — the sowing & counting game | [play](https://naveenneog.github.io/AlaguliMane/) | [APK](https://github.com/naveenneog/AlaguliMane/releases/latest) |

## The games, and where they come from

None of these are inventions. They're games with centuries — sometimes millennia — of continuous play across South India.

- **Saalu Mane Ata** (Nine Men's Morris) is a *mill* game — three nested squares, nine seeds a side. Form a connected line of three ("a mill") and you break a rival seed. Pure strategy, no dice: the same family of game scratched into the stone floors of temples at **Aihole**. A game of foresight.
- **Aadu Huli** (Goats & Tigers) is an *asymmetric hunt* on a triangular board — a few tigers leap to capture goats, while a herd of goats tries to hem the tigers in until they cannot move. The South Indian cousin of *Bagh-Chal*.
- **Chowka Bara** (Ashta Chamma) is a **race** game played with **cowrie shells** for dice on a cross-and-circle board, with safe squares. The ancestor Ludo forgot.
- **Alaguli Mane** (Pallanguzhi) is a **mancala** — two rows of pits, seeds sown counter-clockwise, pits of four captured. No luck, just counting ahead. The carved wooden board is a genuine heirloom in Kannada and Tamil homes.

Each game ships with **multiple "worlds"** — a *Realistic* heritage board, an *Original* glowing-3D reading, a *Modern* interpretation, sometimes a *Fable* world — and the one this post is really about.

![The Kannada-first setup screen: pick a world, an opponent, a difficulty](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/app-sma.png)

## The Bidri world — the reason this build exists

The spark for the whole project was a single question: *what would these games look like if a master craftsman of Bidar made them?*

**Bidriware** is a 14th-century metal craft from **Bidar, Karnataka**. A zinc-and-copper alloy is cast, engraved with floral and geometric *tarkashi* patterns, inlaid with **pure silver** wire, then blackened with a special soil from the Bidar fort — a soil that darkens the alloy to deep matte black but leaves the silver brilliant. The result is unmistakable: **jet-black metal, glowing silver inlay.** A GI-tagged craft, and one of the most striking in the world.

So every game got a **bespoke Bidri board** — not a generic skin, but a mat whose inlay is designed around *that game's* geometry:

![Bidri Saalu Mane Ata board](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/world-sma.jpg)
![Bidri Aadu Huli board](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/world-ah.jpg)
![Bidri Chowka Bara board](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/world-cb.jpg)
![Bidri Alaguli Mane board](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/world-am.jpg)

### How we matched real artisan work

Getting AI-generated art to actually *read as Bidri* — and not as "generic ornate black-and-gold" — took a tight loop:

1. **Study first.** Real Bidri is **matte black, not glossy**, the inlay is **silver, not gold**, the motifs are **floral tarkashi and geometric bands**, and the craft lives in the *contrast*. Those became hard constraints.
2. **Prompt to the constraints.** Every render was pushed toward *"near-black blackened-brass ground, brilliant pure-silver inlay, delicate floral tarkashi engraving, museum-quality metalwork, soft studio light with rich reflections"* using **Azure `gpt-image-2`**. Gold only as a thin rim highlight.
3. **Align the board to the mat.** The generated ornament had to sit *around* the playable geometry — central design centred on the board, surrounding *tarkashi* filling the field, the way a craftsman composes a real tray. The mat and a **seamless table tile** were rendered as a set.
4. **Iterate on light & reflection.** Several passes went purely into how the silver catches light and how the black holds shadow, until each board looked photographed, not textured.

The same pipeline produced each game's **app icon** — this game's own board, cast in Bidri. The Bidri work was distilled into a reusable **"Bidri style" skill** so the look stays consistent across future builds.

## How it was built

The whole suite is deliberately **boring where it counts** so it can live forever for free:

- **Pure static, mobile-first, Kannada-first.** No backend, no accounts, no tracking. Each game is a folder of HTML/JS/assets on **GitHub Pages**. Kannada is the first language, English second.
- **3D in the browser.** A shared **Three.js** core (`game3d`) renders boards, pieces and worlds, tuned for a mid-range phone. Each game is a thin ruleset on top.
- **Four games, one drift-locked core.** ~36 shared modules stay **byte-identical** across all four, enforced by a custom **`rc-gate`** that fails the build on any drift and runs the full **unit-test matrix (668 tests: AH 206 · AM 161 · CB 152 · SMA 149)**, i18n coverage, JSON-schema contracts, language/voice-pack freshness, and an **asset budget**.
- **Six languages, packaged.** Kannada + English core; four more ship as **downloadable text & voice packs** (an "asset diet" with a default-core build that fetches optional packs on demand).
- **Narration** via **Azure Speech** neural voices, later repacked to cut size.
- **APKs from the same web build.** **Capacitor** wraps each `web/` folder; **GitHub Actions** builds a debug APK on every release (JDK 21, `cap add android`, `gradlew assembleDebug`) and attaches it automatically. Push to `main` → Pages redeploys; publish a release → the APK builds itself.
- Art & icons: Azure `gpt-image-2`. **Everything is open source.**

![The world picker, including the Bidri "blackened silver pits" world](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-21-karnataka-bidri-board-games/app-am.png)

## What I learned

- **Constraints make AI art authentic.** "Ornate Indian" gets you tourist-shop clip-art. *"Matte-black blackened alloy, pure-silver tarkashi, no gold except a rim highlight"* gets you something a Bidar artisan would recognise. Research the craft, then encode it as non-negotiables.
- **A drift gate is worth more than a test suite alone** when shipping four near-identical apps. The most valuable script in the repo is the one that refuses to let the four codebases diverge silently.
- **Ship the culture first, the translation second.** Kannada-first (not "English with a toggle") changed how the whole UI reads.
- **Static + Capacitor is a superpower for heritage software.** One `web/` folder becomes a free website *and* an installable app, zero servers — exactly right for something meant to outlast any hosting bill.
- **A tiny asset budget forces good decisions.** Packing optional languages/voices and fetching on demand kept the base app small without cutting features.

## Try it

Free, offline, no account, open source:

- **Saalu Mane Ata** — [play](https://naveenneog.github.io/SaaluManeAta/) · [APK](https://github.com/naveenneog/SaaluManeAta/releases/latest) · [source](https://github.com/naveenneog/SaaluManeAta)
- **Aadu Huli** — [play](https://naveenneog.github.io/AaduHuli/) · [APK](https://github.com/naveenneog/AaduHuli/releases/latest) · [source](https://github.com/naveenneog/AaduHuli)
- **Chowka Bara** — [play](https://naveenneog.github.io/ChowkaBara/) · [APK](https://github.com/naveenneog/ChowkaBara/releases/latest) · [source](https://github.com/naveenneog/ChowkaBara)
- **Alaguli Mane** — [play](https://naveenneog.github.io/AlaguliMane/) · [APK](https://github.com/naveenneog/AlaguliMane/releases/latest) · [source](https://github.com/naveenneog/AlaguliMane)

If you have grandparents who played these on a courtyard floor, show them the Bidri board. That reaction is the whole point.
