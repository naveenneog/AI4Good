---
layout: videogen
title: "Made with Video Gen Studio: an Azure hosted-agents explainer, from one prompt to premiere"
hero_title: "We asked our studio to explain Azure hosted agents. It made this."
hero_subtitle: "A 41-second, fully narrated, brand-finished explainer — written, directed, rendered, voiced and cut by a team of AI agents on Azure, from a single sentence. And it was rendered by hosted agents on Azure AI Foundry. Agents explaining agents. Here's exactly how it was built."
date: 2026-07-10 20:40:00 +0530
categories: ai video
tags: [hosted-agents, azure-ai-foundry, sora-2, agent-framework, video-generation, made-with-video-gen-studio, copilot-cli]
excerpt: "A worked example: Video Gen Studio turned one sentence — 'explain how hosted agents work on Azure' — into a 41-second, narrated, brand-finished paper-craft explainer, in about 11 minutes, on the live studio. And the studio's own agents ran on Azure AI Foundry's hosted Agent Service, so it's agents explaining agents. This is the full making-of: the prompt, the six-agent pipeline, the storyboard it wrote, and the pacing engineering that keeps every scene moving."
image: /assets/img/2026-07-10-made-with-video-gen-studio/poster.jpg
trailer: /assets/img/2026-07-10-made-with-video-gen-studio/film.mp4
trailer_poster: /assets/img/2026-07-10-made-with-video-gen-studio/poster.jpg
trailer_badge: "▶ MADE WITH VIDEO GEN STUDIO · 0:41"
---

{% assign img = '/assets/img/2026-07-10-made-with-video-gen-studio' %}
{% assign launch = '/assets/img/2026-07-10-video-gen-studio' %}

> **TL;DR** — The film above wasn't edited by a human. I typed **one sentence** — *"explain how hosted agents work on Azure"* — and [**Video Gen Studio**]({{ '/2026/07/10/video-gen-studio/' | relative_url }}) wrote it, storyboarded it, rendered every scene with **Sora-2**, narrated it, and finished it with captions, a music bed and brand bumpers. **~11 minutes**, prompt to premiere, on the live studio. The nice twist: the studio's agents themselves ran on **Azure AI Foundry's hosted Agent Service** — so this is *hosted agents explaining hosted agents*.

<div class="vg-stats">
  <div class="vg-stat"><div class="n">1</div><div class="l">prompt in</div></div>
  <div class="vg-stat"><div class="n">6</div><div class="l">scenes out</div></div>
  <div class="vg-stat"><div class="n">~11m</div><div class="l">prompt → film</div></div>
  <div class="vg-stat"><div class="n">0:41</div><div class="l">finished runtime</div></div>
  <div class="vg-stat"><div class="n">0%</div><div class="l">frozen frames</div></div>
</div>

## The one line I typed

No shot list, no script, no assets. Just a sentence and a style (*Rugged Paper-Cut Stop-Motion*):

> *"Explain how hosted agents work on Azure AI Foundry's Agent Service: you define an agent's instructions, tools, and model, and Azure runs it server-side — hosting, scaling, and securing it with managed identity — so teams ship reliable agentic apps without operating the orchestration themselves."*

Everything below — the beats, the narration, the visuals, the voice, the cut — the agents decided.

## Six agents, one film

Video Gen Studio isn't a single model call. It's a **crew**, and each member is a Microsoft Agent Framework agent you can watch work in the telemetry panel:

1. **ScriptWriter** breaks the idea into beats (*hook → context → explain → turn → payoff*) and writes a tight narration line per scene.
2. **Director** plans the shots and **pauses for my approval** — the one human gate.
3. **Renderer** paints each scene with **Sora-2**, locked to a reference frame so the look stays consistent.
4. **Continuity/QA** checks the rendered frames with **gpt-4o vision**.
5. **DubbingArtist** casts a voice and narrates each scene (**Azure AI Speech**, `en-US-Andrew`).
6. **Distribution** finishes with a deterministic **ffmpeg** pass — rolling captions, a ducked music bed, and brand intro/outro bumpers.

<figure>
  <img src="{{ launch | append: '/studio.png' | relative_url }}" alt="The Video Gen Studio editor — scene timeline, telemetry panel and preview">
  <figcaption>The studio you actually watch it happen in — scenes stream in live, with a real timeline to recut.</figcaption>
</figure>

## The storyboard it wrote

From that one sentence, ScriptWriter produced this — six beats, one crisp spoken line each (12–17 words, tuned so the voice fits the shot):

| # | Beat | Narration it wrote |
|---|------|--------------------|
| 1 | hook | *Instead of babysitting brittle servers, imagine your AI agent lives in the cloud and just works.* |
| 2 | context | *Building agentic apps is hard because wiring models, tools, scaling, and security quickly turns into spaghetti.* |
| 3 | explain | *With hosted agents, you define the agent's instructions, tools, and model like dropping modules into place.* |
| 4 | turn | *Then Azure hosts that agent server-side, lifting it into the cloud so infrastructure disappears from your plate.* |
| 5 | context | *Azure handles scaling, monitoring, and secure resource access with managed identity, wrapping your agent in guardrails.* |
| 6 | payoff | *Your team ships reliable agentic apps that just call a hosted agent, without running any orchestration yourselves.* |

And then Sora-2 rendered each line as its own hand-made paper-craft shot:

<figure>
  <img src="{{ img | append: '/still-spaghetti.jpg' | relative_url }}" alt="Three paper-craft developers puzzling over a tangle of string connecting a model, a brain, a gear and a robot">
  <figcaption>Scene 2 — <em>"…wiring models, tools, scaling, and security quickly turns into spaghetti."</em> The studio drew the spaghetti.</figcaption>
</figure>

<figure>
  <img src="{{ img | append: '/still-modules.jpg' | relative_url }}" alt="A paper-craft hand stacking labelled cardboard modules into place">
  <figcaption>Scene 3 — <em>"…you define the agent's instructions, tools, and model like dropping modules into place."</em></figcaption>
</figure>

## Every scene *moves* — the pacing engineering

This is the part I'm proud of, and it's why the film feels finished rather than generated.

Early cuts had a subtle disease: Sora renders a fixed-length clip, but a narration line is a *different* length. When the voice ran long, the studio froze the last frame and held it while the narrator kept talking. On an earlier six-scene film, **26% of the runtime was frozen** — a third of every scene was a still image with a voice-over.

So the render pipeline now **fits the clip to the voice**: it estimates each line's spoken length, picks the shortest Sora length that covers it, and **trims the scene to end exactly when the narrator does**. Same six scenes, measured with `ffmpeg freezedetect`:

| | Earlier cut | This film |
|---|---|---|
| Runtime | 71.9s | **41.0s** |
| Per scene | 12.0s | **6.8s** |
| **Frozen held-frames** | ~19s (**26%**) | **0.0s (0%)** |

Shorter, snappier, and the picture moves the whole way through. No held frames, no dead air.

## Made on Azure — by agents, hosted by Azure

The whole crew runs keyless on Azure with a single managed identity: **Microsoft Agent Framework** for the agents, **Sora-2** for motion, **gpt-image-2** for keyframes and reference locking, **Azure AI Speech** for the voice, **gpt-4o vision** for QA, and **Azure Container Apps** (VNet-integrated, deployed with `azd`) for the studio itself.

And the agents in this run executed on **Azure AI Foundry's hosted Agent Service** — so the film about hosted agents was, fittingly, *directed by* hosted agents.

The best part: I never opened a video editor. I typed a sentence, approved a storyboard, and watched six scenes stream in. That's the whole pitch — you direct; the crew builds.

<p style="text-align:center; margin-top:2rem;">
  <a class="btn" href="{{ '/2026/07/10/video-gen-studio/' | relative_url }}">Read how Video Gen Studio works →</a>
</p>
