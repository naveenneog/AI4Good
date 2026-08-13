---
title: "Claude Code on Microsoft Foundry: Your Own Claude Deployment, Entra ID Auth, No API Key"
published: true
description: "Anthropic's Claude Code, pointed at Claude models running in your own Azure AI Foundry resource, authenticating with az login or a managed identity. No Anthropic account, no API key in a dotfile, no proxy in the middle. Here is the working setup, the seven checks that prove it, and every dead end I hit."
tags: azure, ai, devtools, opensource
cover_image: https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-08-13-claude-code-on-microsoft-foundry/card.png
canonical_url: https://naveenneog.github.io/AI4Good/2026/08/13/claude-code-on-microsoft-foundry/
---

![Claude Code's /status panel reporting "API provider: Microsoft Foundry" and the Foundry resource name, with the model resolved to claude-sonnet-5](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-08-13-claude-code-on-microsoft-foundry/card.png)

> **#AI4Good — engineering notes.** I wanted Claude Code to run against *my* Claude deployment
> in Azure, billed to my subscription, gated by my tenant's identity. It turns out that takes
> two environment variables and no proxy at all. Getting to those two variables took a while.

There's a specific kind of friction that keeps good tools out of regulated organisations. The
tool is fine. The model is fine. What fails review is the sentence *"and then each developer
pastes a vendor API key into a file on their laptop."*

So the question I actually wanted answered was narrow: **can Claude Code talk to Claude models
deployed in my own Azure AI Foundry resource, using Microsoft Entra ID, with no long-lived
secret anywhere?**

Yes. And the setup is much smaller than the internet suggests.

## The short answer

```powershell
az login
npm install -g @anthropic-ai/claude-code

$env:CLAUDE_CODE_USE_FOUNDRY   = "1"
$env:ANTHROPIC_FOUNDRY_RESOURCE = "<your-foundry-resource-name>"

claude
```

That's it. No gateway, no LiteLLM, no `claude-code-router`. Those exist for good reasons —
central cost attribution, audit logging — but none of them are required just to reach Foundry.

## Why no proxy is needed

Most "run tool X on Azure" guides need a shim because Azure speaks OpenAI's wire format and the
tool speaks something else. That is **not** the case here.

Foundry exposes Claude deployments through a **native Anthropic Messages API**:

```
POST https://<resource>.services.ai.azure.com/anthropic/v1/messages
     Authorization: Bearer <entra-id-token>
     anthropic-version: 2023-06-01
```

The wire format is genuine Anthropic — same `messages` array, same `content` blocks, same
`tool_use` semantics, same SSE streaming. So Claude Code can just… talk to it.

I checked what else that endpoint would answer to, because assuming is how you lose an
afternoon:

| Path | Result |
|---|---|
| `/anthropic/v1/messages` | **200** |
| `/anthropic/v1/messages/count_tokens` | **200** |
| `/openai/v1/chat/completions` | 404 `api_not_supported` |
| `/models/chat/completions` | 404 `api_not_supported` |
| `/openai/deployments/<name>/chat/completions` | 404 `api_not_supported` |
| `/anthropic/v1/models` | 404 `api_not_supported` |

So: the Anthropic routes, and **only** the Anthropic routes. If you reflexively reach for
`chat/completions` on a Claude deployment — as I did — that 404 is the first thing you'll meet.

Streaming, tool use and `count_tokens` all work, which matters because Claude Code leans on all
three constantly. An agent that can't stream or call tools isn't an agent.

## The two variables that actually matter

Claude Code has a **built-in Foundry mode**. Set it, and it constructs that URL from your
resource name and fetches bearer tokens through the Azure SDK's `DefaultAzureCredential` chain.

| Variable | What it does |
|---|---|
| `CLAUDE_CODE_USE_FOUNDRY=1` | Switches Claude Code into Foundry mode |
| `ANTHROPIC_FOUNDRY_RESOURCE` | Your resource **name** — not a URL |

`DefaultAzureCredential` is the whole trick. It picks up `az login` on a laptop and a **managed
identity** on Azure compute, with no configuration difference between the two. Leave
`ANTHROPIC_FOUNDRY_API_KEY` and `ANTHROPIC_FOUNDRY_AUTH_TOKEN` unset and it falls through to
that chain automatically. Nothing to rotate, nothing to leak.

> **`CLAUDE_CODE_USE_AZURE` does not exist.** I guessed it first, obviously. To be sure I wasn't
> trusting a stale doc, I scanned the shipped v2.1.223 binary: `CLAUDE_CODE_USE_FOUNDRY`,
> `ANTHROPIC_FOUNDRY_RESOURCE`, `ANTHROPIC_FOUNDRY_BASE_URL`, `ANTHROPIC_FOUNDRY_API_KEY` and
> `ANTHROPIC_FOUNDRY_AUTH_TOKEN` are all in there. `CLAUDE_CODE_USE_AZURE` is not.

## Making it permanent

Two files, no secrets in either.

**`~/.claude/settings.json`** — the CLI:

```json
{
  "env": {
    "CLAUDE_CODE_USE_FOUNDRY": "1",
    "ANTHROPIC_FOUNDRY_RESOURCE": "<your-resource>",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5"
  }
}
```

**Pin all three model aliases.** Foundry mode does no start-up model check, so an alias pointing
at a deployment you don't have doesn't fail at launch — it fails later, mid-task, as a
`DeploymentNotFound`. Deployment names are *yours*, not Anthropic's catalogue names.

I hit exactly this. `claude-haiku-4-5` — the small, cheap model Claude Code uses for background
work — wasn't deployed on my resource, and I couldn't create it:

```
ERROR: Marketplace purchases are disabled for this subscription due to policy restrictions.
```

Claude models bill through Azure Marketplace, and internal, sandbox, CSP, student and
sponsored-credit subscriptions are blocked from creating them. Existing deployments keep working
fine. So I mapped `haiku` to my Sonnet deployment and moved on — slightly more expensive per
background call, entirely functional.

## The permission everyone gets wrong

Being **Owner** on the subscription does not let you call the endpoint. That's a control-plane
role; inference is data-plane. You need **Cognitive Services User**
(`a97b65f3-24c7-4388-baec-2e87135dc908`):

```powershell
$scope = az cognitiveservices account show -n <resource> -g <rg> --query id -o tsv
az role assignment create --assignee "<you>" --role "Cognitive Services User" --scope $scope
```

For CI or Azure compute, the same role goes to the managed identity and the sign-in becomes:

```bash
az login --identity                          # system-assigned
az login --identity --username <client-id>   # user-assigned
```

Everything downstream is identical. That symmetry is the actual payoff: the laptop flow and the
pipeline flow differ by one command.

## Proving it, rather than hoping

"It replied, so it must be working" is not evidence — Claude Code will happily fall back to an
Anthropic account if it has one. I wrote a seven-point check that fails loudly instead.

![Seven verification checks passing: Azure CLI sign-in, Entra ID token, Claude deployments found, Messages API responds, CLI installed, provider = foundry, and an end-to-end Claude Code turn on Foundry](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-08-13-claude-code-on-microsoft-foundry/verify.png)

The two lines that actually settle it:

```console
$ claude auth status
{ "loggedIn": true, "authMethod": "third_party", "apiProvider": "foundry" }

$ claude doctor
CLAUDE_CODE_USE_FOUNDRY is set, so this session is using Microsoft Foundry
- Not connected to the Anthropic API (api.anthropic.com)
- Not signed in to claude.ai
```

Not connected to Anthropic. Connected to my resource. That's the claim, verified from the tool's
own mouth.

And from Azure's side, `TokenTransaction` metrics on the resource line up with the timestamps of
my test runs — the traffic really did land where I think it did.

## It works in the VS Code extension too

Same credential, no extra wiring. Open the panel with **Ctrl+Shift+P → `Claude Code: Open in
Side Bar`** and it drops straight into a usable prompt — **no sign-in step at all**, because the
credential already resolved through Entra ID.

![The Claude Code panel in VS Code answering a question about a file after calling its Glob and Read tools, with no sign-in prompt](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-08-13-claude-code-on-microsoft-foundry/answer.png)

![Animated walkthrough: the Claude Code panel opens without a login prompt, then answers a question about the codebase using its file tools](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-08-13-claude-code-on-microsoft-foundry/extension.gif)

It reads files with its normal tools and answers from the Foundry deployment. Agentic behaviour
intact, model hosted in my tenant.

I also documented — then corrected — a wrong assumption here. I'd written that the extension
*requires* its own `claudeCode.environmentVariables` setting in VS Code. Then I actually tested
it: removed that setting entirely, reloaded, asked again. It still worked, purely from
`~/.claude/settings.json`. The extension's own setting description agrees: *"Prefer setting
environment variables in Claude's settings.json."* Configure both if you like belt and braces,
but one is enough.

## Two gotchas worth your afternoon

**`/status` is terminal-only.** In the VS Code panel it answers *"/status isn't available in this
environment."* Run it in a terminal session instead — that's where the screenshot at the top of
this post comes from.

**On Windows, a bare `az` inside Git Bash is a trap.** It resolves to the WSL shim and returns:

```
Windows Subsystem for Linux has no installed distributions.
```

…which then gets captured as your "token". Use `az.cmd`. And note that `command -v az.cmd`
*also* fails, because bash doesn't apply `PATHEXT` — so probing for the file first doesn't save
you. The reliable pattern is to run the candidate and validate that what came back is actually a
JWT:

```sh
case "$TOKEN" in
  eyJ*) : ;;            # looks like a JWT, keep it
  *) return 1 ;;        # an error message wearing a token's clothes
esac
```

That check is the difference between a helper that fails loudly and one that hands a WSL error
string to your inference endpoint.

## The good

The interesting part isn't that this works. It's how *little* is required for it to work — two
environment variables and an `az login`, because Foundry chose to expose the vendor's real API
instead of a translated one.

That choice is what removes the shim. No proxy means no extra hop to secure, no second place for
credentials to live, no component to keep patched between a developer and a model. The security
review gets shorter, and the answer to "where does the key live?" becomes "there isn't one."

For teams who've been told they can't use the good agentic tools because of key handling: that
objection is now just… gone. Your identity, your tenant, your subscription, your audit trail.

## Try it

- 💻 **Setup + verification scripts:** [`Setup-ClaudeFoundry.ps1`](https://github.com/naveenneog/AI4Good/blob/main/assets/code/2026-08-13-claude-code-on-microsoft-foundry/Setup-ClaudeFoundry.ps1) configures both surfaces; [`Test-ClaudeFoundry.ps1`](https://github.com/naveenneog/AI4Good/blob/main/assets/code/2026-08-13-claude-code-on-microsoft-foundry/Test-ClaudeFoundry.ps1) runs the seven checks; [`get-foundry-token.sh`](https://github.com/naveenneog/AI4Good/blob/main/assets/code/2026-08-13-claude-code-on-microsoft-foundry/get-foundry-token.sh) is the optional token helper for CI
- 📘 **Anthropic — Claude Code on Microsoft Foundry:** <https://code.claude.com/docs/en/microsoft-foundry>
- 📗 **Microsoft Learn — Deploy and use Claude models in Foundry:** <https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude>

*Verified end-to-end on 13 August 2026 with Claude Code v2.1.223 against `claude-sonnet-5` and
`claude-opus-5` deployments in East US 2.*
