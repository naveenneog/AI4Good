---
layout: post
title: "Onboarding Open-Source Models into Azure AI Foundry: An Architect's Playbook"
date: 2026-06-29 10:00:00 +0530
categories: azure ai foundry
tags: [azure-ai-foundry, azure-ml, huggingface, byom, llmops]
excerpt: "A grounded, end-to-end guide to getting any open-source model running in Azure AI Foundry — catalog, Hugging Face, and bring-your-own — with validation, cost, and GPU SKU guidance."
---

> **How to read this guide.** Statements are tagged **[Fact]** when they reflect
> documented Azure behavior and **[Assumption]** when they are reasonable defaults
> you must confirm in your tenant. Where docs do not confirm something, it says so.

## 1. Executive Summary

Azure AI Foundry supports open-source models through three paths. **[Fact]** The
**Model Catalog** offers curated models (Mistral, Qwen, Llama, Phi, and more) you
deploy as **serverless (pay-as-you-go) APIs** or to **managed online endpoints**
with no infra to manage. The **Hugging Face collection** in the catalog lets you
deploy thousands of HF models to a managed endpoint backed by your own GPU compute.
For anything else, **Bring Your Own Model (BYOM)** runs the model on Azure ML, AKS,
or a VM, then registers it back into Foundry as a connection so agents can call it.

Use **serverless catalog** when the model is listed and you want fastest time-to-value
and no GPU quota worries. Use **Hugging Face → managed endpoint** when the model is on
HF but not serverless, and you accept managing GPU SKUs. Use **BYOM** for gated,
quantized, custom-architecture, or compliance-isolated models. Cost and operational
burden rise left-to-right; control rises with them.

## 2. Decision Tree

```
Is the model in the Foundry Model Catalog?
├─ YES → Serverless API available?
│        ├─ YES → Deploy serverless (pay per token). [easiest]
│        └─ NO  → Deploy to Managed Online Endpoint (pick GPU SKU).
└─ NO  → Is it on Hugging Face + supported task/architecture?
         ├─ YES → Deploy via Foundry HF collection / Azure ML to Managed Endpoint.
         └─ NO  → BYOM: containerize → AML/AKS/VM endpoint → register connection.
```

## 3. Step-by-Step Guides

### Path 1 — Foundry Model Catalog
1. Open [ai.azure.com](https://ai.azure.com) → your project → **Model catalog**.
2. Filter by collection (e.g., Mistral, Qwen) and search the model.
3. Open the card → **Deploy**. Choose **Serverless API** or **Managed compute**.
4. For managed compute, pick the GPU SKU and instance count; create the endpoint.
5. **Validate:** card shows *Succeeded*; the **Chat playground** returns a response.

### Path 2 — Hugging Face → Azure
1. In the catalog, open the **Hugging Face** collection; search by repo id.
2. Deploy to a **managed online endpoint**; select a GPU SKU sized to the model.
3. **[Fact]** Endpoint exposes a scoring URL + key. **[Assumption]** API shape depends
   on the serving stack (vLLM → OpenAI-compatible `/chat/completions`).
4. **Validate:** `curl` the endpoint with a sample payload; check 200 + tokens.

### Path 3 — Bring Your Own Model (BYOM)
1. Containerize with vLLM/TGI; register the model in an Azure ML workspace.
2. Deploy to **AML managed endpoint** or **AKS**; expose HTTPS.
3. In Foundry, add a **Connection** (custom/serverless) pointing at the URL + key.
4. Link the connection to an **Agent** as a tool/model. **Docs do not confirm** every
   custom stack auto-registers — verify the connection type your model exposes.

## 4. Validation Framework

```bash
# OpenAI-compatible managed endpoint
curl -sX POST "$ENDPOINT/chat/completions" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" -d '{
    "messages":[{"role":"user","content":"Reply with: OK"}],
    "max_tokens":16,"temperature":0}'
```
Verify: deployment **Succeeded**, `/health` 200, output contains expected text.
Failure modes: 401 (key/identity), 429 (quota), 503 (cold start), garbage (wrong template).

## 5–7: Failures, Enterprise, Automation

Quota, region GPU shortages, VLM/MoE serving, and timeouts are the usual blockers.
Govern with catalog allow-lists + Azure Policy; control cost via serverless vs reserved
GPU; pipe logs to App Insights. CLI: `az ml online-endpoint create`. Python: `azure-ai-ml`.

> **GPU rule of thumb [Assumption]:** ≤8B → L4/A10; 24B → A100-80GB; 35B+/FP4 → H100/B200.

➡️ **See the [Side Quest](/DailyBlogs/sidequest/)** for a 5-model feasibility check.
