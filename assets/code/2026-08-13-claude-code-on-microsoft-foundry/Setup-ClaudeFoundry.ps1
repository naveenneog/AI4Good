<#
.SYNOPSIS
    Configures Claude Code (CLI + VS Code extension) to run against Claude models
    deployed in Microsoft Foundry, authenticating with Microsoft Entra ID.

.DESCRIPTION
    Writes two configuration files:

      %USERPROFILE%\.claude\settings.json    - used by the Claude Code CLI
      %APPDATA%\Code\User\settings.json      - used by the VS Code extension
                                               (claudeCode.environmentVariables)

    No API key is stored. Claude Code obtains tokens through the Azure SDK
    DefaultAzureCredential chain, which picks up `az login` on a workstation and
    a managed identity automatically on Azure compute.

    Existing files are backed up next to the original before being modified, and
    unrelated settings are preserved.

.PARAMETER Resource
    Foundry (AIServices) account name, e.g. ai-contosohub530569751908.

.PARAMETER SonnetModel
    Deployment name to use for the 'sonnet' alias.

.PARAMETER OpusModel
    Deployment name to use for the 'opus' alias.

.PARAMETER HaikuModel
    Deployment name for the 'haiku' alias and Claude Code's background tasks.
    Point this at a deployment that actually exists; if claude-haiku-4-5 is not
    deployed, map it to your Sonnet deployment.

.PARAMETER SkipVSCode
    Only configure the CLI.

.EXAMPLE
    .\Setup-ClaudeFoundry.ps1 -Resource ai-contosohub530569751908 `
        -SonnetModel claude-sonnet-5 -OpusModel claude-opus-5 -HaikuModel claude-sonnet-5
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Resource,
    [string]$SonnetModel = 'claude-sonnet-5',
    [string]$OpusModel   = 'claude-opus-5',
    [string]$HaikuModel  = 'claude-sonnet-5',
    [switch]$SkipVSCode
)

$ErrorActionPreference = 'Stop'

function Backup-IfExists {
    param([string]$Path)
    if (Test-Path $Path) {
        $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
        $bak = "$Path.bak-$stamp"
        Copy-Item $Path $bak -Force
        Write-Host "  backed up -> $bak" -ForegroundColor DarkGray
    }
}

$envVars = [ordered]@{
    CLAUDE_CODE_USE_FOUNDRY        = '1'
    ANTHROPIC_FOUNDRY_RESOURCE     = $Resource
    ANTHROPIC_DEFAULT_OPUS_MODEL   = $OpusModel
    ANTHROPIC_DEFAULT_SONNET_MODEL = $SonnetModel
    ANTHROPIC_DEFAULT_HAIKU_MODEL  = $HaikuModel
}

Write-Host ""
Write-Host "Configuring Claude Code for Microsoft Foundry" -ForegroundColor Cyan
Write-Host "  resource : $Resource"
Write-Host "  endpoint : https://$Resource.services.ai.azure.com/anthropic"
Write-Host ""

# --- Claude Code CLI -------------------------------------------------------
$claudeDir = Join-Path $env:USERPROFILE '.claude'
$claudeSettings = Join-Path $claudeDir 'settings.json'
New-Item -ItemType Directory -Force -Path $claudeDir | Out-Null

Write-Host "Claude Code CLI settings: $claudeSettings"
Backup-IfExists $claudeSettings

$cli = if (Test-Path $claudeSettings) {
    Get-Content $claudeSettings -Raw | ConvertFrom-Json
}
else {
    [pscustomobject]@{}
}

if (-not $cli.PSObject.Properties['env']) {
    $cli | Add-Member -NotePropertyName env -NotePropertyValue ([pscustomobject]@{})
}
foreach ($k in $envVars.Keys) {
    if ($cli.env.PSObject.Properties[$k]) { $cli.env.$k = $envVars[$k] }
    else { $cli.env | Add-Member -NotePropertyName $k -NotePropertyValue $envVars[$k] }
}

$cli | ConvertTo-Json -Depth 12 | Set-Content $claudeSettings -Encoding utf8
Write-Host "  written" -ForegroundColor Green

# --- VS Code extension -----------------------------------------------------
if (-not $SkipVSCode) {
    $codeSettings = Join-Path $env:APPDATA 'Code\User\settings.json'
    Write-Host ""
    Write-Host "VS Code user settings: $codeSettings"

    if (Test-Path $codeSettings) {
        Backup-IfExists $codeSettings
        $raw = Get-Content $codeSettings -Raw
        # Strip // and /* */ comments so JSONC parses; the file is rewritten as JSON.
        $stripped = [regex]::Replace($raw, '(?m)^\s*//.*$', '')
        $stripped = [regex]::Replace($stripped, '/\*[\s\S]*?\*/', '')
        $code = if ($stripped.Trim()) { $stripped | ConvertFrom-Json } else { [pscustomobject]@{} }
    }
    else {
        New-Item -ItemType Directory -Force -Path (Split-Path $codeSettings) | Out-Null
        $code = [pscustomobject]@{}
    }

    $list = foreach ($k in $envVars.Keys) { [pscustomobject]@{ name = $k; value = $envVars[$k] } }

    if ($code.PSObject.Properties['claudeCode.environmentVariables']) {
        $code.'claudeCode.environmentVariables' = @($list)
    }
    else {
        $code | Add-Member -NotePropertyName 'claudeCode.environmentVariables' -NotePropertyValue @($list)
    }

    $code | ConvertTo-Json -Depth 12 | Set-Content $codeSettings -Encoding utf8
    Write-Host "  written" -ForegroundColor Green
    Write-Host "  restart VS Code (or run 'Developer: Reload Window') to pick this up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Verify with:" -ForegroundColor Cyan
Write-Host "  az login"
Write-Host "  .\Test-ClaudeFoundry.ps1 -Resource $Resource"
Write-Host ""
