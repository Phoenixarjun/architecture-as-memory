# AAM PowerShell Module Script

$JSEntrypoint = Join-Path $PSScriptRoot "js/bin/aam.js"

function Invoke-AAMRaw {
    param(
        [string[]]$Arguments
    )
    
    # 1. Verify Node is available
    $Node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $Node) {
        Write-Error "Node.js runtime was not found on your system path. Please install Node.js (v18+) to run AAM."
        return
    }

    if (-not (Test-Path $JSEntrypoint)) {
        Write-Error "AAM core JavaScript module could not be located at: $JSEntrypoint"
        return
    }

    # 2. Execute process
    $ProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
    $ProcessInfo.FileName = $Node.Source
    $ProcessInfo.Arguments = @($JSEntrypoint) + $Arguments -join " "
    $ProcessInfo.UseShellExecute = $false
    
    $Process = [System.Diagnostics.Process]::Start($ProcessInfo)
    $Process.WaitForExit()
    $ExitCode = $Process.ExitCode
    
    if ($ExitCode -ne 0) {
        $host.SetShouldExit($ExitCode)
    }
}

function Initialize-AAM {
    [CmdletBinding()]
    param()
    Invoke-AAMRaw -Arguments "init"
}

function Test-AAM {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [Switch]$Doctor
    )
    if ($Doctor) {
        Invoke-AAMRaw -Arguments "doctor"
    } else {
        Invoke-AAMRaw -Arguments "validate"
    }
}

function Start-AAMViewer {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [int]$Port = 4200
    )
    Invoke-AAMRaw -Arguments @("dev", "--port", $Port)
}

Export-ModuleMember -Function Initialize-AAM, Test-AAM, Start-AAMViewer
