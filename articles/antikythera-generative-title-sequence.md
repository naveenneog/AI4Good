---
title: 'ANTIKYTHERA: A 29-Second Title Sequence in One HTML File — No Assets, No Build Step'
published: true
description: 'Given one prompt — ''demonstrate the absolute ceiling of your motion design capability, you pick the subject'' — Copilot CLI produced a 29-second documentary title sequence about the world''s first computer. Every gear, texture, shader and note is generated in the browser at runtime. Here''s the prompt, the full build, and exactly how the graphics and the audio were made.'
tags: 'ai4good, threejs, javascript, creativecoding'
cover_image: 'https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/card.png'
canonical_url: 'https://naveenneog.github.io/AI4Good/2026/07/26/antikythera-generative-title-sequence/'
id: 4237358
date: '2026-07-26T14:56:43Z'
---

[![ANTIKYTHERA — four frames from the title sequence: the bronze gear train, the X-ray scan, the total eclipse, and the title card](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/card.png)](https://naveenneog.github.io/Antikythera/)

> One prompt. No assets. No build step. No server. One `index.html` you can open by double-clicking it — and 29 seconds of motion design comes out.

I'm **[Naveen Gopalakrishna](https://naveenneog.github.io/AI4Good/about/)** — an AI Global Black Belt at Microsoft, a compulsive builder after hours. This #AI4Good build is a little different from the app-a-day entries: it isn't an app at all. It's a **film**. And it's the most interesting capability test I've run at an AI coding agent so far.

- ▶️ **Watch it:** [naveenneog.github.io/Antikythera](https://naveenneog.github.io/Antikythera/)
- 💻 **Source (MIT):** [github.com/naveenneog/Antikythera](https://github.com/naveenneog/Antikythera)

---

## The prompt

This is the whole brief, verbatim. Nothing else was specified — not the subject, not the concept, not the look:

```text
Build one motion graphics piece that demonstrates the absolute ceiling of your
motion design capability. You choose the subject and the concept. That decision
is part of what's being evaluated.

Context you should know: this is going into a video comparing you against other
frontier models, shown to a large audience, and your work will be credited to you
by name. Every model gets this exact prompt. So go nuts and show people what
you're actually capable of.

Requirements:

1. You pick it. A title sequence, a product spot, a data story, an explainer, a
   brand identity in motion, a piece of pure abstract choreography — anything.
   Decide and commit. The ambition of the choice is part of the score.

2. It plays automatically on load, runs roughly 15-30 seconds, and holds on a
   final frame. Add a replay control. It must read as a finished, edited piece —
   not a looping animation demo.

3. Choreography is the whole test. Pull from whatever best showcases you —
   including but not limited to: kinetic typography and per-character animation,
   variable font animation, staggered reveal systems, easing with real authored
   weight, overshoot and anticipation, masking and reveal wipes, SVG path drawing
   and morphing, shape transitions, mix-blend-mode compositing, particle and
   physics-driven motion, 3D layers and camera moves, depth and parallax,
   shader-based transitions, displacement and distortion, grain and optical
   treatment, match cuts between scenes, sound-design-driven timing.

4. You have free reign to look up how to use any of these, and to pull in open
   source animation libraries freely — GSAP, anime.js, Three.js, Lottie, shader
   libraries, anything on a CDN. Add any other technique you think demonstrates
   more. The list is a starting point, not a boundary.

5. Timing is what separates real motion design from animation. Beats should land
   with intent, moments should breathe, and the piece should build. If everything
   moves at the same speed with the same easing, it has failed.

6. Single self-contained index.html. Any library via CDN. No build step, no server,
   no API keys.

7. No hotlinked video or stock footage. Everything generated in-browser.

8. QA it by watching it. Play it start to finish several times. Check that beats
   don't collide, nothing pops in unstyled, timing reads, and it holds 60fps
   throughout.
```

Note requirement 1: **the choice of subject is part of the score.** That's the genuinely interesting part of the test. Anyone can animate a logo. Picking *what deserves 29 seconds* is a design judgement.

---

## Why the Antikythera mechanism

Copilot picked the **Antikythera mechanism** — the bronze geared analog computer built around 150 BCE, lost in a shipwreck off the island of Antikythera around 60 BCE, and dredged up by sponge divers in 1901. It predicted eclipses, tracked the Metonic and Saros cycles, and modelled the motion of the sun and moon. Nothing of comparable mechanical complexity appears again in the archaeological record for **over a thousand years**.

The reasoning it gave for the choice is the bit I actually care about, because it's a *motion design* argument rather than a "cool topic" argument:

> It hands you two opposing motion vocabularies to choreograph against each other.

| Register | Behaviour | Where |
|---|---|---|
| **Organic** | slow, sine-driven drift, long eases, nothing ever stops hard | the sea floor |
| **Mechanical** | quantised, staccato, hard `expo` landings, overshoot and settle | the machine |

The edit then cuts *between* those two registers. The subject isn't decoration — it generates the grammar of the piece. That's the difference between choosing a topic and choosing a concept.

---

## The edit

Five acts, ~29 seconds, then it holds on the final frame.

| t | Act | What happens |
|---|---|---|
| **0.0s** | The Dark | The frame closes to 2.39:1. Marine snow drifts through three parallax depth bands, light shafts sway, coordinates type on in the corner. |
| **3.0s** | | A raking light travels across frame and **uncovers** a corroded bronze fragment — the light and the reveal mask are driven by the same value, so the light is physically the thing revealing the object. |
| **5.55s** | The Find | **Hard cut.** Register change to cold cyan. Corner reticles snap in with overshoot, data readouts stagger, a counter races to 82. |
| **6.5s** | | A scan bar crosses the artifact and the gear line-art draws in **exactly where the bar has already passed**. Greek inscription glyphs flicker on around the rim in random order. |
| **9.45s** | The Machine | **Hard cut.** Eight bronze gears fly forward out of the dark and land hard. A beat of anticipation — a tiny backwards creep — and the train starts to turn. |
| **11.2s** | | Four cycle cards cut over the mechanism: **METONIC · SAROS · CALLIPPIC · EXELIGMOS**, each with a *different* entrance, each with its number counting up. |
| **15.7s** | | Everything accelerates, then **slams to a dead stop** with a prismatic radial smear. |
| **16.5s** | *(silence)* | **Cut to black. 0.36 seconds of nothing.** |
| **16.85s** | The Sky | The great gear's rim becomes the outer orbit. An orrery runs at real relative periods. |
| **20.0s** | | The moon crosses the sun. Time decelerates. The light goes out, the stars come up — as they really do at totality. |
| **22.0s** | | **Totality.** The piece stops moving for about a second. |
| **23.85s** | Title | The corona ring is squashed on one axis until it *is* the rule under the title. **ANTIKYTHERA** reveals per character. |

![The raking light uncovering the bronze fragment on the sea floor](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/fragment.png)

![The X-ray scan revealing the gear line-art inside the fragment](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/xray.png)

### Three match cuts carry the structure

This is the part I'd point at if someone asked what "editing" means in a piece with no footage.

1. **The artifact becomes its own X-ray.** Same SVG path, same position, same size — only the render register changes. The eye reads continuity, the brain reads *a new way of seeing the same object*.
2. **The great gear's rim becomes the outer orbit.** The camera lands at exactly `z = 43.7` so the 223-tooth wheel's rim measures ~298px on screen; the outer orbit circle is 300px. For most of a second *both are on screen at once* while the machine dissolves out from under the circle. The machine doesn't cut to the sky — it **becomes** the sky.
3. **The corona ring becomes the title rule.** One property: `scaleY → 0.0035`. A circle with no height is a line. That line then slides down and is the rule under the title.

One circle, three meanings, across three acts.

---

## How the graphics were made

Nothing is loaded. No image files, no video, no models, no HDRIs, no textures. Here's what that actually required.

### Gear geometry from real tooth counts

The gears aren't decorative cog shapes. Each is a `THREE.Shape` whose outline is generated tooth by tooth, then extruded with `THREE.ExtrudeGeometry` and bevelled. The tooth counts are the **real surviving Antikythera counts** — 223 (the Saros wheel), 127 (Metonic), 64, 53, 48, 38, 32, 27 — laid out on a **shared module**, so every pitch radius is `m · teeth / 2` and the gears genuinely mesh when placed tangentially:

```js
const GEAR_SPEC = [
  {t:223, z: 0.00, abs:true, th:.46, arms:4},   // the great Saros wheel
  {t:127, z:-1.90, abs:true, th:.40, arms:3},   // Metonic, on a layer behind
  {t: 64, z: 0.98, p:0, ang: 58, th:.34, arms:3},
  {t: 53, z: 0.98, p:0, ang:  4, th:.34, arms:3},
  ...
];
// meshing distance is just the sum of the two pitch radii
const d = parent.rP + rP;
px = parent.mesh.userData.hx + Math.cos(a) * d;
```

Angular velocity is then `ω · (223 / teeth)` with alternating direction — so the train turns at **true ratios**. The little 27-tooth gear whirs; the great wheel barely creeps. You can feel the gearing without being told about it. Spoke cutouts are `THREE.Path` holes punched into the same shape, which is why you can see the Metonic wheel turning *through* the Saros wheel behind it.

![The full mechanism — the 223-tooth Saros wheel with the 127-tooth Metonic wheel layered behind it](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/gears.png)

### The bronze surface, computed in JavaScript

There's no texture file, so the corrosion is a **value-noise heightfield** evaluated in JS at load:

1. An integer hash → smooth-interpolated value noise → 5-octave fBm heightfield.
2. Screen-space normals taken from the heightfield's neighbours.
3. A Lambert term against a fixed key direction, plus a tight specular power.
4. A second low-frequency noise field distributes **verdigris** patches (bronze → green patina).
5. A third, higher-frequency field carves **pits**, which also self-shadow — that's what sells the relief rather than making it look like printed noise.

It's rasterised once into three canvases and reused three ways: as an **SVG `<pattern>` fill** for the artifact, and as the **`map` + `roughnessMap` + `bumpMap`** on the gear material. One noise pass, one look, two rendering technologies.

### An environment map with nothing to load

Metal needs reflections, and hotlinking an HDRI was off the table. So the environment is *painted*: a canvas gradient with a warm key blob and a cold cyan kicker, marked as an equirectangular texture and run through `PMREMGenerator`. That's where the bronze's specular life comes from.

### A hand-written post-processing chain

No `EffectComposer` — the whole chain is written out, which keeps the cost controllable:

```
scene → half-float render target
      → bright pass (threshold 1.15)
      → two-scale separable gaussian bloom (¼ and 1/14 res, ping-pong)
      → one composite pass
```

That single composite pass does **barrel distortion, prismatic radial smear, chromatic aberration, colour grade, ACES tonemap, sRGB encode and vignette**. The expensive smear/aberration path — 8 taps × 3 channels — sits behind a *uniform* branch, so it costs nothing except on the two or three beats that actually use it (the slam, the cuts).

### Optical treatment: grain and gate weave

Two details that do a disproportionate amount of work:

- **Film grain** is eight pre-baked frames of *gaussian* noise (three uniforms averaged — flat `Math.random()` reads as video noise, not film) cycled at **24fps, not 60**, with a randomised offset each swap, composited in `mix-blend-mode: overlay`.
- **Gate weave** — sub-pixel translation and a fraction of a degree of rotation applied to the whole frame, because projected film never sits perfectly still. It's almost subliminal and the piece feels dead without it.

### Three layers, one frame

```
#gl    <canvas>  Three.js — particles, gears, starfield, corona, post chain
#vec   <svg>     line art — artifact, X-ray gears, orbits, the title rule
#type  <div>     DOM      — all typography
       grain / scanlines / halation / vignette / flash / letterbox
```

Typography deliberately stays in the **DOM**: real font rendering, real variable-font axes, and it stays razor sharp regardless of the WebGL render scale. The title animates `font-variation-settings` from `'wght' 900` down to `420` as the letters land — the letterforms visibly *cool* from black to book weight while tracking in. That's a variable font doing something a static font simply cannot.

![The final title card — Bodoni Moda tracking in over the rule, with a gear still turning behind](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-26-antikythera-generative-title-sequence/title.png)

---

## How the audio was made

Also no files. Every sound is synthesised with the **Web Audio API** at runtime.

| Cue | How it's built |
|---|---|
| **Sub drone** (the bed) | Two detuned sawtooth oscillators at 40 / 40.35 Hz plus two sines, through a lowpass whose cutoff sweeps 110 → 340 → 150 Hz across the whole piece. A 0.09 Hz LFO on the gain gives it a slow tape-like breathing. |
| **Impacts** (the cuts) | A sine with a pitch envelope from 150 Hz down to 32 Hz in 0.34s, plus a band-passed noise transient for the click. |
| **Gear ticks** | 50ms noise bursts through a narrow band-pass (Q = 9) at 2.4 kHz, pitch-scaled per gear so the eight gears landing sound like eight *different* pieces of metal. |
| **Data blips** | Short square-wave pings through a lowpass, one per readout row. |
| **Riser** (into the slam) | White noise through a band-pass sweeping 300 Hz → 7 kHz exponentially, doubled by a sawtooth sweeping 70 → 430 Hz. |
| **Celestial pad** (the sky) | Five sine partials on a minor voicing, each doubled and detuned by 0.4%, with a long 1.9s fade in. |
| **Reverse swell** (into the title) | Band-passed noise with an *exponentially rising* gain envelope, so it sounds like a reversed cymbal. |

Reverb is a **synthesised impulse response** — 3.4 seconds of stereo noise shaped by an exponential decay curve, fed into a `ConvolverNode`. A plate reverb with no plate and no sample.

The important part isn't the synthesis, though. It's that **every cue is fired from the same GSAP timeline that drives the picture**:

```js
tl.call(() => SND.hit(1.15), null, A3 - 0.050);   // the impact IS the cut
tl.call(() => SND.riser(0.95), null, A3 + 5.30);  // riser into the slam
GEARS.forEach((g, i) => {
  tl.call(() => SND.tick(0.55 + i*0.16, 0.20), null, at + 0.55);  // per gear landing
});
```

Sound and picture can't drift, because there's only one clock. Sound is **on by default**. Browsers won't start an `AudioContext` without a user gesture, so the piece tries immediately on load and — if the browser refuses — arms every plausible first gesture anywhere on the page. Whichever click lands first unlocks it, and the drone then **joins at the point in its envelope the picture has already reached** rather than restarting its five-second fade underneath Act III. A small "click anywhere for sound" hint surfaces only if the browser actually blocked it, and vanishes the moment it doesn't.

It's still designed to read perfectly **silent** — the sound is a layer on top of timing that already works.

---

## Timing: the actual test

Requirement 5 said it plainly: *if everything moves at the same speed with the same easing, it has failed.*

So **nothing in the piece uses a default ease.** There are ten hand-authored `CustomEase` bezier curves, each with a job:

```js
CE.create('cinema' ,'M0,0 C0.62,0 0.05,1 1,1');        // long filmic settle
CE.create('slam'   ,'M0,0 C0.04,0.92 0.09,1 1,1');      // hard mechanical stop
CE.create('settle' ,'M0,0 C0.12,0.86 0.18,1.045 1,1');  // land + micro overshoot
CE.create('punch'  ,'M0,0 C0.02,1.18 0.28,0.99 1,1');   // big overshoot
CE.create('antic'  ,'M0,0 C0.34,-0.30 0.18,1 1,1');     // pull back, then go
CE.create('choke'  ,'M0,0 C0.86,0.02 0.98,0.62 1,1');   // slow start, late rush
```

`antic` is the one I like best: it dips *below zero* before moving, so when the gear train starts turning it creeps backwards a few frames first. Classic animation anticipation, expressed as a bezier control point at `y = -0.30`.

And the single most effective beat in the whole piece costs nothing at all: after the mechanism slams to a stop, there is a **hard cut to black and 0.36 seconds of absolutely nothing** before the sky fades up. Silence and stillness, used as a beat. That's an editing decision, not an animation one.

Everything is placed on one `gsap.timeline()` at **absolute** times, so cut points are authored rather than accumulated. GSAP writes to a plain state object; the renderer only ever *reads* it. Picture logic and draw logic never touch each other.

---

## How it was actually built — and what it says about capability

The whole thing was built in a single session with **GitHub Copilot CLI** in autopilot mode. The genuinely notable part wasn't the code generation. It was requirement 8: *QA it by watching it.*

An agent can't watch. So it built itself an eye:

1. Installed Playwright, exposed a small transport API (`SEQ.seek()`, `SEQ.play()`) from the piece.
2. Captured **90 frames** across the runtime — every 0.5s, plus extra samples clustered on the cut points.
3. Assembled them into a **contact sheet** and looked at the whole edit as one image.
4. Measured frame pacing across a full real-time run (p50/p95/p99).

That loop caught seven real defects that reading the code would never have surfaced:

| Bug | Why it mattered |
|---|---|
| A wrapper `div`'s `z-index` created a stacking context that **isolated `mix-blend-mode` from the canvas** — the film grain rendered as raw grey static over everything. | Structurally invisible in code. Obvious in one screenshot. |
| GSAP read a CSS `transform: translateY(112%)` back as **resolved pixels** into its `y` cache, so the later `yPercent` tween animated a *different axis* — **the title never appeared at all.** | The tween existed, was correctly positioned, and reported `progress: 1`. Only the picture showed it was wrong. |
| The eclipsing moon's circles sat at SVG origin instead of the orrery centre — it flew off-screen and **totality never happened**. | |
| The title **wrapped onto two lines** mid-track-in. | |
| Flash frames held ~0.35s — read as an error, not a cut. Now 2–3 frames. | |
| The corona quad's **square edge was visible** against the starfield. | |
| Point-light intensities were in physical units on a renderer defaulting to legacy lighting — **the entire third act blew out to white.** | |

Two of those were in the QA harness rather than the piece, which is its own lesson: `waitForFunction`'s rAF polling stalls under a software rasterizer, and GSAP's `seek()` **suppresses `onUpdate` by default**, so scrub-based screenshots silently missed every `onUpdate`-driven write. Both were diagnosed by instrumenting rather than guessing.

Then, because the environment had no GPU at all (a software rasterizer — 15fps), it added **adaptive resolution**: if rolling frame time exceeds 21.5ms the render scale steps down, at most three times, never changing composition, timing or colour. That doubled throughput on the bad machine and stays at full resolution on real hardware.

**That's the capability worth pointing at.** Not "it wrote some Three.js." It made a design decision with a defensible rationale, built its own verification instrument when the requirement demanded one it didn't have, believed the evidence over its own code, and fixed things it could not have known were broken without looking.

---

## The good

Two things, honestly.

The first is **access**. A 29-second title sequence of this kind is normally After Effects, Cinema 4D, a plugin stack, licences, and a render farm's worth of patience. This is one text file, three CDN links, and a browser. A student anywhere can open it, read every line, change the tooth counts, and watch what happens. There's no pipeline standing between curiosity and the thing.

The second is the **subject**. The Antikythera mechanism is a reminder that the ancient world was not simple, and that knowledge is genuinely fragile — this machine existed, worked, and then the entire idea of it vanished for a millennium. If a few thousand people watch 29 seconds and go and read about the Saros cycle afterwards, that's a good use of a title sequence.

---

## Try it

- ▶️ **Watch it:** [naveenneog.github.io/Antikythera](https://naveenneog.github.io/Antikythera/) — plays on load with sound, ~29s
- 💻 **Source (MIT, one file):** [github.com/naveenneog/Antikythera](https://github.com/naveenneog/Antikythera)
- 🛠 **Built with:** [Three.js r149](https://threejs.org) · [GSAP + CustomEase](https://gsap.com) · Web Audio API · Bodoni Moda / Archivo / JetBrains Mono · [GitHub Copilot CLI](https://github.com/features/copilot/cli)

One note if you go poking: it pins **Three.js r149** on purpose. r149 is the last release that ships a real UMD `build/three.min.js`. Everything after it is ES-module only, and module CORS blocks `file://` — which would have quietly broken the "no build step, no server" constraint the moment anyone double-clicked the file.
