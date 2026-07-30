---
title: "SpendLens: Private, On-Device Bank-Statement Analysis — No Login, No Cloud, No LLM"
published: true
description: "Day 17 of #AI4Good. SpendLens turns Indian bank-statement PDFs into reconciled totals, categories, and daily trends entirely on your device — no bank login, no cloud upload, no analytics, and no LLM anywhere near your money. Built with Flutter and a deterministic 78-bank parser."
tags: ai4good, flutter, privacy, opensource
cover_image: https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-30-spendlens-private-statement-analysis/card.png
canonical_url: https://naveenneog.github.io/AI4Good/2026/07/30/spendlens-private-statement-analysis/
---

[![SpendLens — a bank statement analyzed entirely on-device: reconciled totals, spend by category, and a daily-spend chart, marked Verified](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-30-spendlens-private-statement-analysis/card.png)](https://naveenneog.github.io/SpendLens/)

> **Day 17 of #AI4Good.** I used an AI coding agent to build a personal-finance app — and the single most important design decision was to keep AI, the cloud, and the network completely *out* of it. Your bank statement is read, parsed, and reconciled on your own device. Nothing is uploaded. Nothing is stored anywhere but your phone.

I'm **[Naveen Gopalakrishna](https://naveenneog.github.io/AI4Good/about/)** — an AI Global Black Belt at Microsoft, a compulsive builder after hours. Most #AI4Good builds put AI *in* the product. **SpendLens** is the opposite, on purpose: the "good" here is financial privacy, so the intelligence lives in the parser, not in a model, and your money never leaves the device.

- ▶️ **Try it in the browser (nothing retained):** [naveenneog.github.io/SpendLens](https://naveenneog.github.io/SpendLens/)
- 📦 **Android APK:** [github.com/naveenneog/SpendLens/releases/latest](https://github.com/naveenneog/SpendLens/releases/latest)
- 💻 **Source:** [github.com/naveenneog/SpendLens](https://github.com/naveenneog/SpendLens)

---

## What it is

SpendLens reads a bank-statement PDF and turns it into an honest picture of where your money went — **without a bank login, an OTP, a screen-scrape, or an upload**.

- **Import a PDF** through the native Android/iOS document picker (or drag one into the browser version). Password-protected statements are supported; the password is used in memory and never kept.
- **Reconciled summary** — total spent, total received, opening and closing balance, and date range, in Indian digit grouping with tabular figures.
- **Spend by category, daily-spend trend, and largest spends**, each with an accessible table/list equivalent and labels that never rely on colour alone.
- **Searchable, filterable transactions** with editable categories. Correct a category once and SpendLens remembers the merchant rule for next time.
- **Saved statement history** on-device, and a one-tap **delete everything** that really deletes everything.
- **Detection for 78 RBI scheduled retail banks** — public-sector, private, small-finance, payments, and regional-rural — by official name, known aliases, and IFSC prefixes.

The cover image is the browser version analysing a fully synthetic Axis sample: an `Axis Bank Ltd.` statement, marked **Verified**, `Active only in this tab`, spend broken out by category, and a daily-spend chart — all rendered without a single network request leaving the page.

## How it was built

The whole app is **Flutter (Dart)** with a thin layer of native platform code, and it was built with **GitHub Copilot CLI in autopilot mode** — the agent researched Indian statement formats, wrote the parser and tests, ran the builds, and drove an Android emulator smoke test end to end.

**On-device PDF text extraction.** Rather than ship a commercial PDF SDK, SpendLens calls the platform's own engine on a worker thread: **PDFBox-Android (Kotlin)** on Android and **PDFKit (Swift)** on iOS, over a method channel. Image-only / scanned PDFs are rejected explicitly (on-device OCR is a future module) instead of pretending they parsed.

**A deterministic parser — no ML, no LLM.** This is the heart of the trust model. The generic parser:

- recovers multiline transaction descriptions and handles the common Indian date formats;
- infers debit vs credit from the direction of consecutive running balances;
- checks the **opening + credits − debits = closing** equation, and, when the statement declares its own debit/credit totals, validates those too — in the detected column order;
- preserves `DR`, leading-minus, and zero-crossing overdraft balances;
- and returns an explicit **Verified**, **Needs review**, or **Incomplete** verdict with the diagnostic attached.

It never converts a parse error into a success-shaped empty dashboard. If the numbers don't reconcile, the UI says so.

**Money is integer paise, never floating point.** Every amount is stored and summed as an integer so ₹0.01 rounding drift can't creep into a total.

**Explainable categorization.** Categories come from transparent keyword rules with **token-boundary matching**, so "Zuber" doesn't get filed under the ride brand "Uber," and your own merchant corrections always override the built-ins.

**Local persistence.** Statements, edited categories, merchant rules, and settings live in **SQLite** (analyses stored as JSON documents for schema agility). Category-rule updates and full data deletion are atomic transactions, and concurrent first-access is serialised through a single database-open future so startup can't race.

**A custom native document picker.** `file_picker` didn't compile cleanly against Flutter 3.44 / AGP 9, so SpendLens ships its own Storage Access Framework / `UIDocumentPickerViewController` picker — which also avoids asking for broad storage permissions.

**A zero-retention web twin.** The GitHub Pages version does the same parsing in the browser with **self-hosted PDF.js** and a Content-Security-Policy of `connect-src 'none'` — no cookies, local storage, IndexedDB, service worker, analytics, or upload endpoint. A static `verify_web_privacy` check runs in CI to keep it that way, and the analysis auto-clears after 15 minutes.

**Verified before shipping.** 40 automated tests (parser, bank registry, categorization, SQLite, controller, privacy, concurrency, widgets), a clean `flutter analyze`, the web-privacy verifier, and a scripted Android emulator smoke that imports a synthetic statement, checks reconciliation, and confirms that "delete everything" survives a relaunch.

## The good

Most "see where your money goes" apps ask you to connect your bank — handing a third party your credentials, or trusting an aggregator to hold your transaction history. SpendLens is a bet that you shouldn't have to. **Everything happens on the device you already trust with the statement.** No account, no analytics SDK, no remote parser, no generative-AI dependency; Android backup/transfer is disabled and the iOS database is excluded from backups.

And it's built for **Indian** statements specifically — the date formats, the digit grouping, and coverage across 78 banks including the small-finance and regional-rural banks that mainstream tools ignore. When a layout is unfamiliar it degrades honestly to **Needs review** rather than inventing certainty.

The meta-point is the one I like most: an AI agent built a finance tool whose entire value proposition is that **AI and the network never touch your money.** That's a version of #AI4Good worth keeping in the toolkit — using the agent to ship privacy, not to harvest it.

## Try it

- ▶️ **Live (zero-retention browser analyzer):** [naveenneog.github.io/SpendLens](https://naveenneog.github.io/SpendLens/)
- 📦 **Android APK:** [github.com/naveenneog/SpendLens/releases/latest](https://github.com/naveenneog/SpendLens/releases/latest)
- 💻 **Source:** [github.com/naveenneog/SpendLens](https://github.com/naveenneog/SpendLens)

{% embed https://github.com/naveenneog/SpendLens %}

*Part of the [#AI4Good](https://naveenneog.github.io/AI4Good/2026/07/10/ai4good-an-app-a-day/) series — one build at a time, from a single laptop, with the "who does this help?" chosen first. [GitHub](https://github.com/naveenneog) · [LinkedIn](https://www.linkedin.com/in/naveen-gopalakrishna-99863040/). #AI4Good*
