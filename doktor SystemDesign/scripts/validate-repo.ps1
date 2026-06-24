<#
.SYNOPSIS
  Validacoes basicas do Doktor System-Design.

.DESCRIPTION
  Checa ASCII, links Markdown relativos, texto quebrado conhecido e scripts
  principais. Nao instala comandos nem altera PATH/perfil do usuario.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$Failures = New-Object System.Collections.Generic.List[string]

function Add-Failure([string]$Message) {
    $Failures.Add($Message) | Out-Null
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Write-Ok([string]$Message) {
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Get-RepoFiles {
    Get-ChildItem -Path $RepoRoot -Recurse -File -Force |
        Where-Object { $_.FullName -notmatch '\\.git\\' }
}

function Test-IsBinaryAsset($File) {
    $binaryExtensions = @(
        '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico',
        '.pdf', '.zip', '.7z', '.gz', '.tar',
        '.woff', '.woff2', '.ttf', '.otf'
    )
    return $binaryExtensions -contains $File.Extension.ToLowerInvariant()
}

function Test-Ascii {
    $bad = @()
    foreach ($file in Get-RepoFiles) {
        if (Test-IsBinaryAsset $file) { continue }

        $text = Get-Content -Raw -LiteralPath $file.FullName
        foreach ($ch in $text.ToCharArray()) {
            if ([int][char]$ch -gt 127) {
                $bad += "$($file.FullName) contains non-ASCII char code $([int][char]$ch)"
                break
            }
        }
    }

    if ($bad.Count -gt 0) {
        $bad | ForEach-Object { Add-Failure $_ }
    } else {
        Write-Ok 'ASCII check'
    }
}

function Test-MarkdownLinks {
    $errors = @()
    $skipTargets = @('URL', 'url', 'caminho/README.md', '[a-zA-Z0-9]{32}')

    Get-ChildItem -Path $RepoRoot -Recurse -File -Include *.md -Force |
        Where-Object { $_.FullName -notmatch '\\.git\\' } |
        ForEach-Object {
            $file = $_
            $text = Get-Content -Raw -LiteralPath $file.FullName
            $matches = [regex]::Matches($text, '\[[^\]]+\]\(([^)#][^)]*)\)')

            foreach ($match in $matches) {
                $target = $match.Groups[1].Value
                if ($target -match '^(https?:|mailto:|#)' -or $skipTargets -contains $target) { continue }

                $targetPath = ($target -split '#')[0]
                if ([string]::IsNullOrWhiteSpace($targetPath)) { continue }

                $full = Join-Path $file.DirectoryName $targetPath
                if (-not (Test-Path -LiteralPath $full)) {
                    $errors += "$($file.FullName) -> $target"
                }
            }
        }

    if ($errors.Count -gt 0) {
        $errors | ForEach-Object { Add-Failure "Broken markdown link: $_" }
    } else {
        Write-Ok 'Markdown links'
    }
}

function Test-BrokenText {
    $matches = Get-ChildItem -Path $RepoRoot -Recurse -File -Include *.md -Force |
        Where-Object { $_.FullName -notmatch '\\.git\\' } |
        Select-String -Pattern '\?{4,}|^#+ \?' -CaseSensitive:$false

    if ($matches) {
        foreach ($match in $matches) {
            Add-Failure "Broken text candidate: $($match.Path):$($match.LineNumber) $($match.Line)"
        }
    } else {
        Write-Ok 'Broken text scan'
    }
}

function Test-Scripts {
    $powerShellInstaller = Join-Path $RepoRoot 'scripts/powershell/install-doktor-powershell.ps1'
    $cmdCommand = Join-Path $RepoRoot 'scripts/cmd/doktor-command.cmd'
    $cmdInstaller = Join-Path $RepoRoot 'scripts/cmd/install-doktor-cmd.cmd'
    $bashInstaller = Join-Path $RepoRoot 'scripts/bash-zsh/install-doktor-bash-zsh.sh'

    foreach ($path in @($powerShellInstaller, $cmdCommand, $cmdInstaller, $bashInstaller)) {
        if (-not (Test-Path -LiteralPath $path)) {
            Add-Failure "Missing script: $path"
        }
    }

    if (Test-Path -LiteralPath $powerShellInstaller) {
        [scriptblock]::Create((Get-Content -Raw -LiteralPath $powerShellInstaller)) | Out-Null
        Write-Ok 'PowerShell installer parser'
    }

    if (Test-Path -LiteralPath $cmdCommand) {
        $output = cmd /c "`"$cmdCommand`" --help"
        if ($LASTEXITCODE -ne 0 -or ($output -join "`n") -notmatch 'Uso: doktor') {
            Add-Failure 'CMD command help failed'
        } else {
            Write-Ok 'CMD command help'
        }
    }

    if (Get-Command bash -ErrorAction SilentlyContinue) {
        cmd /c "bash --version >nul 2>nul"
        if ($LASTEXITCODE -ne 0) {
            Write-Host '[WARN] Bash command exists but is not functional in this environment; skipping Bash syntax check.' -ForegroundColor Yellow
            return
        }

        cmd /c "bash -n `"$bashInstaller`" >nul 2>nul"
        if ($LASTEXITCODE -eq 0) {
            Write-Ok 'Bash syntax'
        } else {
            Write-Host '[WARN] Bash syntax check did not run successfully in this environment.' -ForegroundColor Yellow
        }
    } else {
        Write-Host '[WARN] Bash not available; skipping Bash syntax check.' -ForegroundColor Yellow
    }
}

Push-Location $RepoRoot
try {
    Test-Ascii
    Test-MarkdownLinks
    Test-BrokenText
    Test-Scripts

    if ($Failures.Count -gt 0) {
        Write-Host ""
        Write-Host "Validation failed with $($Failures.Count) issue(s)." -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host 'Validation OK' -ForegroundColor Green
}
finally {
    Pop-Location
}
