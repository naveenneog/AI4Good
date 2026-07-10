---
layout: post
title: "ActionCut: A Free, CapCut-Class Video Editor for Android"
date: 2026-06-23 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, android, kotlin, jetpack-compose, media3, video-editing]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-actioncut.png
excerpt: "Day one of #AI4Good: ActionCut — a blazing-fast, CapCut-inspired Android video editor with a multi-track timeline, real LUT filters, GPU effects, audio mixing, and one-tap platform export presets. Free, open, no watermark."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each free and built for good. This is where it started.

[![ActionCut — edit like a pro, export anywhere]({{ shot | append: '/shot-actioncut.png' | relative_url }})](https://naveenneog.github.io/ActionCut/)

An early build had to prove a thesis: **that a solo developer, with AI in the loop, could ship something people normally pay a subscription for — and give it away.** So I picked the hardest, most-paywalled category I could think of: the mobile video editor.

## What it is

[**ActionCut**](https://naveenneog.github.io/ActionCut/) is a **CapCut-class Android video editor**. Not a toy — a real one:

- a genuine **multi-track timeline** (video, audio, overlays)
- **LUT color filters** and **GPU-accelerated effects**
- **audio mixing** across tracks
- one-tap **export presets** for every platform (Reels, Shorts, TikTok, 4K)

Built natively in **Kotlin + Jetpack Compose**, with **Media3/ExoPlayer** doing the frame-accurate playback and export.

## The good

Editing is how people tell stories now — and the best tools have quietly slid behind subscriptions and watermarks. A student in Bengaluru on a ₹10,000 phone shouldn't be locked out of clean, multi-track editing. **ActionCut is free, open, and watermark-free.** Storytelling shouldn't require a credit card.

## Try it

- ▶️ **Live site:** [naveenneog.github.io/ActionCut](https://naveenneog.github.io/ActionCut/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/ActionCut/releases/latest)
- 💻 **Source:** [github.com/naveenneog/ActionCut](https://github.com/naveenneog/ActionCut)

*Built in a day with GitHub Copilot CLI autopilot. Previous → [PrimeBeats](/AI4Good/2026/06/22/primebeats-offline-local-music-player/) · Next → [KidKat](/AI4Good/2026/06/26/kidkat-safe-videos-for-kids/). #AI4Good*
