#!/bin/sh
# ---------------------------------------------------------------------------
# get-foundry-token.sh
#
# Prints a short-lived Microsoft Entra ID access token for the Azure AI Foundry
# data plane on stdout, and nothing else.
#
# You normally do NOT need this. With CLAUDE_CODE_USE_FOUNDRY=1 Claude Code
# resolves credentials itself through the Azure SDK DefaultAzureCredential
# chain (`az login` on a workstation, managed identity on Azure compute).
#
# Use it only when you must hand Claude Code an explicit bearer token, e.g.
#
#     export ANTHROPIC_FOUNDRY_AUTH_TOKEN="$(./get-foundry-token.sh)"
#
# in a CI job or a container where you want to pin the credential yourself.
#
# Auth order:
#   1. Azure CLI  (az login / az login --identity)
#   2. IMDS       (managed identity on Azure compute, no Azure CLI required)
#
# Export AZURE_CLIENT_ID first to pin a specific user-assigned managed identity.
#
# Uses no external binaries beyond the Azure CLI and curl, so it also works in
# the stripped-down shells that Claude Code and CI runners provide.
# ---------------------------------------------------------------------------
set -u

# Verified working scope for the Foundry Anthropic endpoint.
# https://ai.azure.com/.default is also accepted.
RESOURCE="https://cognitiveservices.azure.com"
CLIENT_ID="${AZURE_CLIENT_ID:-}"

# Entra ID access tokens are JWTs, so a valid one always starts with "eyJ".
# Anything else means we picked up an error message instead of a token.
is_jwt() {
    case "$1" in
        eyJ*) return 0 ;;
        *) return 1 ;;
    esac
}

strip_cr() {
    _cr=$(printf '\r')
    printf '%s' "${1%"$_cr"}"
}

# `command -v az.cmd` fails in Git Bash because bash does not apply PATHEXT,
# even though executing az.cmd works. So try each candidate and validate the
# result rather than probing for the file first. A bare `az` on Windows can
# also resolve to the WSL shim, which is exactly what the JWT check rejects.
try_az() {
    _tok=$("$1" account get-access-token \
             --resource "$RESOURCE" \
             --query accessToken -o tsv 2>/dev/null) || return 1
    _tok=$(strip_cr "$_tok")
    is_jwt "$_tok" || return 1
    printf '%s' "$_tok"
}

for _cand in az.cmd az; do
    if TOKEN=$(try_az "$_cand"); then
        printf '%s' "$TOKEN"
        exit 0
    fi
done

# ---------------------------------------------------------------------------
# Fallback: Azure Instance Metadata Service (managed identity on Azure compute)
# ---------------------------------------------------------------------------
IMDS="http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=${RESOURCE}"
if [ -n "$CLIENT_ID" ]; then
    IMDS="${IMDS}&client_id=${CLIENT_ID}"
fi

if command -v curl >/dev/null 2>&1; then
    RESP=$(curl -s --max-time 5 -H "Metadata: true" "$IMDS" 2>/dev/null) || RESP=""
    case "$RESP" in
        *'"access_token":"'*)
            _rest=${RESP#*'"access_token":"'}
            TOKEN=${_rest%%'"'*}
            if is_jwt "$TOKEN"; then
                printf '%s' "$TOKEN"
                exit 0
            fi
            ;;
    esac
fi

echo "get-foundry-token.sh: no Entra ID token available. Run 'az login' (or 'az login --identity' on Azure compute)." >&2
exit 1
