---
layout: post
title: "Governing Claude Code with Azure API Management: Per-Developer Budgets, Tiering and Chargeback on Microsoft Foundry"
date: 2026-08-13 11:00:00 +0530
categories: ai4good engineering
tags: [ai4good, azure, foundry, claude, apim, governance, entra-id, accelerator]
image: /assets/img/2026-08-13-claude-code-governance-apim-foundry/architecture.png
excerpt: "Hand Claude Code to a whole team without giving anyone a model credential. An Azure API Management AI gateway in front of Foundry gives per-developer token budgets, Entra ID group tiering, 429 throttling and per-person chargeback. Step-by-step, with a one-command accelerator."
---

{% assign img = '/assets/img/2026-08-13-claude-code-governance-apim-foundry' %}

![Architecture: developer's Entra ID token to an APIM AI gateway, which validates identity, applies tiered token budgets, emits chargeback metrics, then calls Microsoft Foundry with its own managed identity]({{ img | append: '/architecture.png' | relative_url }})

[Running Claude Code on Foundry]({{ '/2026/08/13/claude-code-on-microsoft-foundry/' | relative_url }})
solves the credential problem for one developer: `az login` and you're in, no API key anywhere.

Scaling that to a team surfaces a different problem. Going direct to Foundry means **every
developer needs `Cognitive Services User` on the resource**, and that gives you no rate limit, no
budget, no tiering, and usage data only at the resource level — you can see that $4,000 of tokens
were spent, but not by whom.

This post puts an **Azure API Management AI gateway** in front. Developers end up holding no
Foundry role at all.

Everything below was built and executed on **13 Aug 2026**: APIM **Basic v2**, Claude Code
**v2.1.223**, `claude-sonnet-5` and `claude-opus-5` in East US 2.

> **Skip the manual steps:** the whole thing is packaged as a one-command accelerator —
> [**github.com/naveenneog/claude-code-foundry-gateway**](https://github.com/naveenneog/claude-code-foundry-gateway).
> Steps 1–7 below are what it automates, and worth reading before you run it.

---

## What you get

| Control | Mechanism | Result |
|---|---|---|
| Who may use Claude Code | Entra ID group membership | **403** with an actionable message |
| Tiered budgets | `llm-token-limit` per tier | standard vs premium |
| Per-developer rate limit | tokens/minute keyed on `oid` | **429** + `Retry-After` |
| Per-developer daily budget | `token-quota` + period | **403** until reset |
| Runaway-agent protection | `rate-limit-by-key` | request ceiling |
| Chargeback | `llm-emit-token-metric` | tokens per named person |
| No credential sprawl | gateway managed identity | nothing to leak or rotate |

![Four governance checks passing: entitled developer served at standard tier, second identity served at premium tier, exhausted budget throttled with HTTP 429 and Retry-After, and chargeback attribution showing tokens per developer]({{ img | append: '/governance.png' | relative_url }})

---

## Why per-developer metering actually works here

This is the load-bearing detail, and I established it by intercepting real traffic rather than
assuming.

Claude Code's Foundry mode does not invent a credential. It calls the Azure SDK's
`DefaultAzureCredential`, so the request carries the **developer's own Entra ID token**:

```json
{
  "aud": "https://cognitiveservices.azure.com",
  "oid": "43cc5304-...",
  "upn": "naveen.g@contoso.com",
  "appid": "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
}
```

Three consequences:

1. **Identity is unforgeable.** `oid` is signed by Entra. A developer cannot spoof a colleague,
   and a shared credential cannot exist because there is no credential to share.
2. **No client-side auth work.** No app registration, no custom audience, no device-code flow.
3. **Offboarding is free.** Remove the person from the group and access stops. Nothing is revoked
   at the endpoint.

Claude Code also sends an `x-claude-code-session-id` header, which makes a useful metric
dimension.

---

## Step 1 — Deploy the gateway

**The SKU decision matters more than anything else in this post.** APIM's `llm-*` policies parse
the **Anthropic Messages API** shape **only on v2 tiers**. On classic Developer/Basic/Standard/
Premium the policies apply happily and count zero tokens forever — budgets never trip and you
believe you are governed when you are not.

`az apim create` has no v2 support, so deploy with ARM/Bicep:

```powershell
az deployment group create -g rg-claude-gateway `
    --template-file infra/main.bicep `
    --parameters foundryAccountName=<foundry> publisherEmail=<you@contoso.com>
```

Basic v2 provisions in about **four minutes**; classic tiers take 30–45.

The template enables a **system-assigned managed identity** — the identity that will reach
Foundry.

---

## Step 2 — Let the gateway in, and nobody else

```powershell
$apimMi = az apim show -n <apim> -g <rg> --query identity.principalId -o tsv
$scope  = az cognitiveservices account show -n <foundry> -g <rg> --query id -o tsv

az role assignment create `
    --assignee-object-id $apimMi --assignee-principal-type ServicePrincipal `
    --role "Cognitive Services User" --scope $scope
```

Then the step that actually closes the bypass:

```powershell
az role assignment delete --assignee <developer-oid> `
    --role "Cognitive Services User" --scope $scope
```

Until developers lose that role they can point Claude Code straight at Foundry and skip every
control below. Leave it assigned only to the gateway.

---

## Step 3 — Entitlement lives in Entra ID

```powershell
az ad group create --display-name claude-code-standard --mail-nickname claude-code-standard
az ad group create --display-name claude-code-premium  --mail-nickname claude-code-premium
```

Entitlement belongs in Entra because that is where joiner/mover/leaver already runs. Adding
someone to `claude-code-premium` is an action your identity team can take, audit and review —
whereas an allowlist in a config file drifts and is nobody's job.

---

## Step 4 — Import Foundry as an API

```powershell
az apim api create -g <rg> --service-name <apim> `
    --api-id claude-foundry --path claude `
    --service-url "https://<foundry>.services.ai.azure.com/anthropic" `
    --protocols https --subscription-required false

az apim api operation create -g <rg> --service-name <apim> `
    --api-id claude-foundry --operation-id messages `
    --display-name "Create Message" --method POST --url-template "/v1/messages"
```

`--subscription-required false` is deliberate: authorization comes from the Entra token, not an
APIM subscription key. Claude Code has no reliable way to send a custom key header, and a shared
key would destroy per-person attribution anyway.

---

## Step 5 — The policy

Limits live in named values so changing a budget is a config edit, not a redeployment:

```powershell
tpm-standard=20000   quota-standard=500000
tpm-premium=80000    quota-premium=5000000
calls-per-minute=120
```

The policy itself, in order:

{% raw %}
```xml
<validate-azure-ad-token tenant-id="{{tenant-id}}" output-token-variable-name="jwt"
                         failed-validation-httpcode="401">
    <audiences>
        <audience>https://cognitiveservices.azure.com</audience>
    </audiences>
</validate-azure-ad-token>

<set-variable name="userId" value="@(((Jwt)context.Variables["jwt"]).Claims.GetValueOrDefault("oid",""))" />

<set-variable name="tier" value="@{
    var oid = "," + (string)context.Variables["userId"] + ",";
    if (("{{allow-premium}}").Contains(oid))  { return "premium"; }
    if (("{{allow-standard}}").Contains(oid)) { return "standard"; }
    return "denied";
}" />

<llm-token-limit counter-key="@((string)context.Variables["userId"])"
                 tokens-per-minute="{{tpm-standard}}" estimate-prompt-tokens="false"
                 retry-after-header-name="Retry-After"
                 remaining-tokens-header-name="x-ratelimit-remaining-tokens"
                 tokens-consumed-header-name="x-tokens-consumed" />

<llm-emit-token-metric namespace="claudecode">
    <dimension name="User" value="@((string)context.Variables["userUpn"])" />
    <dimension name="Tier" value="@((string)context.Variables["tier"])" />
</llm-emit-token-metric>

<authentication-managed-identity resource="https://cognitiveservices.azure.com"
                                 output-token-variable-name="msi-token" />
<set-header name="Authorization" exists-action="override">
    <value>@("Bearer " + (string)context.Variables["msi-token"])</value>
</set-header>
```
{% endraw %}

Four things worth knowing:

1. **The audience is `https://cognitiveservices.azure.com`** — that is what Claude Code requests
   a token for, so that is what the gateway must accept. No app registration required.
2. **`estimate-prompt-tokens="false"`** bills actual usage from the response.
3. **XML comments cannot contain `--`.** APIM rejects the policy with an error that never
   mentions comments.
4. **The developer's token is discarded**, not forwarded. Foundry sees only the gateway identity.

Sentinel commas around each object id in the allowlists make `contains()` exact, so one id cannot
partially match another.

---

## Step 6 — Sync group membership

The gateway cannot read group membership from the caller's token: the Cognitive Services audience
is a first-party Microsoft resource whose token has no configurable `groups` claim. Two options:

| | How | Trade-off |
|---|---|---|
| **Sync** (default) | a script writes object ids into named values | no tenant admin needed; membership lags by one sync |
| **Live Graph lookup** | policy calls Graph per request, cached | no lag; needs admin consent for `GroupMember.Read.All` |

I hit `Authorization_RequestDenied` on the Graph grant — it needs a Privileged Role Administrator
— so the accelerator ships the sync approach and documents the Graph upgrade.

```powershell
./scripts/Sync-ClaudeAccess.ps1 -ApimName <apim> -ResourceGroup <rg>
```

Service principals in a group are invisible to a delegated token without `Application.Read.All`,
so CI identities are passed explicitly with `-AdditionalPremiumOids`.

---

## Step 7 — Chargeback telemetry

Two settings, both of which fail *silently* if you miss them:

- the APIM diagnostic needs **`metrics: true`**, or `llm-emit-token-metric` emits nothing and the
  metric namespace never appears
- Application Insights needs **`CustomMetricsOptedInType: WithDimensions`**, or the metric arrives
  as a bare total with no `User` breakdown — exactly the part chargeback needs

Then:

```
naveen.g@contoso.com      831 tokens
service-principal         728 tokens
```

> The Azure CLI's `az monitor metrics list` drops `--namespace` for custom namespaces and reports
> "metric not found". Query the REST API instead.

---

## Step 8 — Point Claude Code at the gateway

```json
{
  "env": {
    "CLAUDE_CODE_USE_FOUNDRY": "1",
    "ANTHROPIC_FOUNDRY_BASE_URL": "https://<apim>.azure-api.net/claude",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-sonnet-5"
  },
  "availableModels": ["claude-sonnet-5", "claude-opus-5"],
  "enforceAvailableModels": true
}
```

> **`ANTHROPIC_FOUNDRY_BASE_URL` and `ANTHROPIC_FOUNDRY_RESOURCE` are mutually exclusive.**
> Setting both fails with `baseURL and resource are mutually exclusive`. Drop the resource
> variable when you move to the gateway.

That one file covers the CLI and the VS Code extension. The panel opens straight into a usable
prompt — no sign-in step, because the Entra credential is already resolved — and streaming works
through the gateway unchanged:

![Claude Code panel in VS Code answering a question about a file through the governed gateway, having called its Glob and Read tools, with no sign-in prompt]({{ img | append: '/vscode.png' | relative_url }})

To stop developers editing their own settings, push the same JSON as **managed settings**:
`HKLM\SOFTWARE\Policies\ClaudeCode` via Intune or Group Policy on Windows,
`/Library/Application Support/ClaudeCode/managed-settings.json` on macOS,
`/etc/claude-code/managed-settings.json` on Linux. Those also let you force `availableModels` and
block `bypassPermissions`.

---

## Onboarding a developer, end to end

```powershell
az ad group member add --group claude-code-standard `
    --member-id (az ad user show --id alice@contoso.com --query id -o tsv)

./scripts/Sync-ClaudeAccess.ps1 -ApimName <apim> -ResourceGroup <rg>
```

Alice then runs `az login`, drops in the settings file, and works. No key, no Foundry role, and
she appears in chargeback from her first request.

> **Guests:** a B2B guest (a `#EXT#` UPN) must use `az login --tenant <tenant-id>`. A plain
> `az login` lands them in their home tenant and the gateway returns 401. This caught me out
> onboarding a colleague.

---

## The accelerator

All of the above is packaged as a solution accelerator:

**[github.com/naveenneog/claude-code-foundry-gateway](https://github.com/naveenneog/claude-code-foundry-gateway)**

```powershell
git clone https://github.com/naveenneog/claude-code-foundry-gateway
cd claude-code-foundry-gateway
az login
./deploy.ps1
```

With no arguments it discovers a Foundry account that has Claude deployments, maps the
`sonnet`/`opus`/`haiku` aliases to deployments that actually exist, deploys APIM + Log Analytics +
Application Insights, creates the API and policy, grants the gateway identity its role, creates
the Entra groups, syncs membership, and writes the `settings.json` you hand to developers.

`./deploy.ps1 -WhatIf` previews without changing anything. There is a **Deploy to Azure** button
for the portal path, `Show-Governance.ps1` to verify all four controls, and an inspector proxy
that shows exactly what Claude Code sends — that is how the identity model above was established
rather than assumed.

---

## What it costs

| Item | Approx |
|---|---|
| APIM Basic v2, 1 unit | ~$250/month |
| Log Analytics + App Insights | ingestion-based, small at this volume |
| Claude tokens | Foundry CCU billing, unchanged by the gateway |

Basic v2 is the cheapest tier that can enforce Anthropic token budgets at all. If that is too
much for a pilot, run direct-to-Foundry first and add the gateway when a second team joins.

---

## The honest summary

The gateway buys you four things that direct access cannot: **entitlement**, **budgets**,
**throttling** and **attribution**. It costs you an APIM instance and one more hop.

For a single developer that trade is not worth it. For a team — especially one where "who spent
the $4,000?" is a question someone will eventually ask — it is the difference between a tool you
can roll out and a tool you have to keep explaining.

The part I did not expect: none of it required changing how developers work. They still run
`az login` and `claude`. The governance is entirely on the platform side.

---

- 💻 **Accelerator:** <https://github.com/naveenneog/claude-code-foundry-gateway>
- 📘 **Getting Claude Code on Foundry first:** [step-by-step setup]({{ '/2026/08/13/claude-code-on-microsoft-foundry/' | relative_url }})
- 📗 **Microsoft Learn — APIM `llm-token-limit`:** <https://learn.microsoft.com/en-us/azure/api-management/llm-token-limit-policy>
- 📗 **Microsoft Learn — `llm-emit-token-metric`:** <https://learn.microsoft.com/en-us/azure/api-management/llm-emit-token-metric-policy>
