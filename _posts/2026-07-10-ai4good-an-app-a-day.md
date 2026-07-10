---
layout: post
title: "AI4Good: I Shipped an AI-for-Good App Every Few Days — Here's the Build Story"
date: 2026-07-10 12:00:00 +0530
categories: ai4good showcase
tags: [ai4good, ai, azure, android, opensource, gpt-image, huggingface, indie-dev]
image: /assets/img/2026-07-10-ai4good-app-a-day/hero.png
excerpt: "Eight apps in eighteen days — a local music player, a video editor, a kids' education app, an Indian-language health app, a GPS camera, an AI shadow-puppet film studio, and two heritage games — each built from a laptop with AI in the loop and shipped free. This is the #AI4Good build story, chapter by chapter."
---

{% assign img = '/assets/img/2026-07-10-ai4good-app-a-day' %}

![AI4Good — eight apps, eighteen days, AI for good]({{ img | append: '/hero.png' | relative_url }})

> **#AI4Good** started as a dare to myself: *can I use AI to build and ship something genuinely useful — for kids, for health, for our culture — one build at a time?* Eighteen days later there were **eight live apps**, each free, each on GitHub Pages. This is the story of how they came to be, in the order they were born — and **each one now has its own deep-dive post** (linked by date in the recap table below).

I'm **[Naveen Gopalakrishna](/AI4Good/about/)** — an AI Global Black Belt at Microsoft by day, a compulsive builder by night. The tooling that made this pace possible was **GitHub Copilot CLI in autopilot mode** (the agent researches, writes code, runs builds, and renders assets autonomously) sitting on top of **Azure AI** — `gpt-image-2` for art, Azure Speech for narration, and open models from Hugging Face for the heavy lifting. But tools are just tools. The thread that ties these eight together is a question I kept asking: **who does this help?**

Let's walk the timeline.

---

## Jun 22 — PrimeBeats: your music, beautifully local

![PrimeBeats landing page — your music, beautifully local]({{ img | append: '/shot-primebeats.png' | relative_url }})

Where it started. [**PrimeBeats**](https://naveenneog.github.io/PrimeBeats/) is an Amazon-Prime-Music-style player for the songs already on your phone — **background playback**, **lock-screen controls**, playlists, an on-device **Smart Radio**, and a real **equalizer**. No account, no ads, **100% offline**. Built with React Native + Expo. → [read the full story](/AI4Good/2026/06/22/primebeats-offline-local-music-player/)

**The good:** ownership and privacy — your music, zero data, zero tracking, zero cost.

---

## Jun 23 — ActionCut: put a pro video studio in everyone's pocket

![ActionCut landing page]({{ img | append: '/shot-actioncut.png' | relative_url }})

The next build set the tone: take something normally locked behind subscriptions and make it **free and open**. [**ActionCut**](https://naveenneog.github.io/ActionCut/) is a CapCut-class Android video editor — a real **multi-track timeline**, **LUT color filters**, GPU effects, audio mixing, and one-tap **export presets** for every platform. Built in **Kotlin + Jetpack Compose + Media3**.

**The good:** creators on entry-level Android phones get studio-grade editing without a paywall or a watermark. Storytelling shouldn't require a subscription.

---

## Jun 26 — KidKat: only the good stuff, for curious kids

![KidKat landing page]({{ img | append: '/shot-kidkat.png' | relative_url }})

This is the app that named the whole campaign. [**KidKat**](https://naveenneog.github.io/KidKat/) plays a **finite, parent-approved stream** of short educational videos — inside the official YouTube player, using the official Data API, fully **ToS-compliant**. No infinite feed. No algorithmic rabbit holes. No doomscroll. A parent allowlist decides what's on the menu. Built with **Flutter** for Android and iOS. → [read the full story](/AI4Good/2026/06/26/kidkat-safe-videos-for-kids/)

**The good:** it turns the most anxiety-inducing part of modern parenting — handing a child a screen — into something calm and intentional. **AI for good starts with protecting the youngest users.**

---

## Jun 27 — NeoFit: health that speaks your language

![NeoFit landing page — Sehat, simple banayi]({{ img | append: '/shot-neofit.png' | relative_url }})

*"Sehat, simple banayi."* [**NeoFit**](https://naveenneog.github.io/NeoFit/) is a science-informed **Indian** health and fitness app in **22 Indian languages** — calorie tracking that actually knows *dosa, biryani, and gulab jamun*, **on-device food recognition**, AI-generated food photos, AI exercise videos, and Health Connect sync. Offline-first, **powered by Azure AI**, Kotlin/Compose. → [read the full story](/AI4Good/2026/06/27/neofit-indian-health-22-languages/)

**The good:** most fitness apps assume you eat like the West and read English fluently. NeoFit meets 1.4 billion people where they are — in their language, with their food. **Inclusion is a health outcome.**

---

## Jul 04 — GpsCamera: proof you can trust

![GpsCamera landing page — geotag every photo, exactly]({{ img | append: '/shot-gpscamera.png' | relative_url }})

[**GpsCamera**](https://naveenneog.github.io/GpsCamera/) is a fast, native Android camera that **burns your exact location and a live mini-map onto every photo**, writes standards-compliant **GPS EXIF**, and files each shot into its own album. Kotlin, Compose, CameraX. → [read the full story](/AI4Good/2026/07/04/gpscamera-geotag-every-photo/)

**The good:** field engineers, insurance surveyors, community reporters, and site inspectors need **verifiable, tamper-evident documentation**. A trustworthy timestamped-and-geotagged photo is a small tool that quietly protects people.

---

## Jul 05 — The Lamp & the Machine: shadow-puppet theatre as an AI film studio

![The Lamp & the Machine — Togalu Gombeyaata meets generative AI]({{ img | append: '/shot-sora.png' | relative_url }})

[**The Lamp & the Machine**](https://naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing/) turns Karnataka's 500-year-old leather shadow-puppet theatre, **Togalu Gombeyaata**, into an AI film studio — cinematic scenes from **Sora 2**, narration from **Azure AI**, finished with Demucs + FFmpeg, retelling the story of **Kempegowda**, the founder of Bengaluru. → [read the full story](/AI4Good/2026/07/05/lamp-and-the-machine-shadow-puppet-ai-studio/)

**The good:** generative AI as a **preservation tool** — putting a fading folk art in front of a new generation.

---

## Jul 06 — Sopāna: a Snakes & Ladders that teaches

![Sopana landing page — Moksha Patam]({{ img | append: '/shot-sopana.png' | relative_url }})

[**Sopāna**](https://naveenneog.github.io/Sopana/) reclaims the game the West calls *Snakes & Ladders* and restores its origin — the ancient Indian **Moksha Patam**, where **every snake is a vice and every ladder a virtue**. Land on one and the game **animates and reads its meaning aloud**. Play three ways (a 2D board, a 2.5D cinematic mode, and a 3D camera), across four worlds, with up to four players on one screen. A web PWA plus an Android APK. → [read the full story](/AI4Good/2026/07/06/sopana-snakes-and-ladders-that-teaches/)

**The good:** it turns a children's game back into what it was designed to be — a gentle lesson in ethics and consequence, wrapped in cultural heritage. **AI narration and art make an 800-year-old teaching tool feel alive again.**

---

## Jul 09 — Chaturanga: ancient chess, reborn in glowing 3D

![Chaturanga landing page — the four-army game of dharma]({{ img | append: '/shot-chaturanga.png' | relative_url }})

[**Chaturanga**](https://naveenneog.github.io/Chaturanga/) is the ancient Indian "game of the four divisions," played with modern chess rules but **authentic piece identities** — Raja, Mantri, Gaja, Ashva, Ratha, Padati — carved in **real-time glowing 3D**. It ships with a **teaching AI** (five levels), a **coach** that reviews your blunders, an **openings trainer**, a rotating piece inspector, and a *Warrior's Eye* camera. Four worlds, each teaching a moral lesson. → [read the full story](/AI4Good/2026/07/09/chaturanga-ancient-chess-in-3d/)

The pieces themselves are an AI-for-good story: I generated each one from a single concept image using a **free Hugging Face Space** and headless Blender — [the full image-to-3D pipeline is its own post here]({{ '/2026/07/10/image-to-3d-huggingface-blender-copilot/' | relative_url }}).

**The good:** a free, offline, no-sign-in chess tutor that also carries culture — learning and heritage in one board.

---

## What #AI4Good actually means

Look at all eight together and a pattern appears — not "AI apps," but **apps that use AI to do something good**:

| Day | App | Who it serves | The good |
|-----|-----|---------------|----------|
| [Jun 22](/AI4Good/2026/06/22/primebeats-offline-local-music-player/) | [PrimeBeats](https://naveenneog.github.io/PrimeBeats/) | Listeners | Own your music — offline, ad-free |
| [Jun 23](/AI4Good/2026/06/23/actioncut-free-pro-video-editor/) | [ActionCut](https://naveenneog.github.io/ActionCut/) | Creators | Studio-grade editing, free |
| [Jun 26](/AI4Good/2026/06/26/kidkat-safe-videos-for-kids/) | [KidKat](https://naveenneog.github.io/KidKat/) | Kids & parents | Safe, finite, educational screen time |
| [Jun 27](/AI4Good/2026/06/27/neofit-indian-health-22-languages/) | [NeoFit](https://naveenneog.github.io/NeoFit/) | 1.4B Indians | Health in 22 languages |
| [Jul 04](/AI4Good/2026/07/04/gpscamera-geotag-every-photo/) | [GpsCamera](https://naveenneog.github.io/GpsCamera/) | Field workers | Verifiable documentation |
| [Jul 05](/AI4Good/2026/07/05/lamp-and-the-machine-shadow-puppet-ai-studio/) | [The Lamp & the Machine](https://naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing/) | Culture | Preserving a folk art with AI |
| [Jul 06](/AI4Good/2026/07/06/sopana-snakes-and-ladders-that-teaches/) | [Sopāna](https://naveenneog.github.io/Sopana/) | Families | Values + heritage, playfully |
| [Jul 09](/AI4Good/2026/07/09/chaturanga-ancient-chess-in-3d/) | [Chaturanga](https://naveenneog.github.io/Chaturanga/) | Learners | Free chess tutor + culture |

**The method:** one build at a time, from a single laptop, with **Copilot CLI autopilot** doing the heavy lifting and **Azure AI** + **Hugging Face** models supplying the intelligence. **The mission:** put that capability toward education, health, culture, and trust — and give it away.

This is just the beginning of the campaign. Next up the runway: **Indian Tales**, a multilingual Togalu Gombe (shadow-puppet) storytelling app to keep a fading folk art alive.

If you build things, I'd gently challenge you to the same dare: **pick the "who does this help?" first, then let AI help you ship it.** That's **#AI4Good**.

*Follow the journey — [GitHub](https://github.com/naveenneog) · [LinkedIn](https://www.linkedin.com/in/naveen-gopalakrishna-99863040/). Built one day at a time.*
