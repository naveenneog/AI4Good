# DailyBlogs

A general-topic GitHub Pages blog (Jekyll + minima) on cloud, AI, and engineering.

## Contents
- **Flagship post:** `_posts/2026-06-29-onboarding-oss-models-azure-ai-foundry.md` — onboarding open-source models into Azure AI Foundry.
- **Image → 3D:** `_posts/2026-07-10-image-to-3d-huggingface-blender-copilot.md` — carving a glowing 3D chess army from single images with a free Hugging Face Space (`tencent/Hunyuan3D-2`) + headless Blender, driven by Copilot CLI autopilot. Rich renders + rotating turntables under `assets/img/2026-07-10-image-to-3d/`.
- **Side quest:** [`sidequest.md`](sidequest.md) — feasibility check of 5 OSS models (✅/⚠️/❌, compute, blockers, paths).

## Run locally
```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000/DailyBlogs
```

## Publish to GitHub Pages
1. Create repo `naveenneog/DailyBlogs`, push `main`.
2. Settings → Pages → Source: **Deploy from branch** → `main` / root.
3. Site: `https://naveenneog.github.io/DailyBlogs`.

## Cross-publish to DEV.to (automated)
Markdown files in [`articles/`](articles/) are auto-synced to [DEV](https://dev.to) on every push to `main`
via [`.github/workflows/publish.yml`](.github/workflows/publish.yml) (uses [`sinedied/publish-devto`](https://github.com/sinedied/publish-devto)).

**One-time setup — add your DEV API key as a secret:**
1. Generate a key at **DEV → Settings → Extensions → DEV Community API Keys**.
2. In this repo: **Settings → Secrets and variables → Actions → New repository secret**.
3. Name it **`DEVTOMASTERKEY`**, paste the key, save.

You can run the sync manually anytime from **Actions → Publish to DEV → Run workflow** (the workflow also has a `workflow_dispatch` trigger), or just push a change under `articles/`.

Each article's front matter carries `published: false` (creates a **draft** on DEV to review first); flip to
`true` to go live. Images use absolute `raw.githubusercontent.com` URLs so they render on DEV, and `canonical_url`
points back to the GitHub Pages post for SEO. The action stores each post's DEV id back into the file's front
matter on first run to keep future pushes in sync.

