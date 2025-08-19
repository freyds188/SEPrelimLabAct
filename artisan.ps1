#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Laravel Artisan command wrapper for running from project root
.DESCRIPTION
    This script allows you to run Laravel artisan commands from the project root
    directory without having to cd into the api/ directory first.
.PARAMETER Command
    The artisan command to run (e.g., serve, migrate, make:controller, etc.)
.PARAMETER Arguments
    Additional arguments to pass to the artisan command
.EXAMPLE
    .\artisan.ps1 serve
    .\artisan.ps1 migrate
    .\artisan.ps1 make:controller TestController
    .\artisan.ps1 serve --host=0.0.0.0 --port=8000
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Command,
    
    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# Check if api directory exists
if (-not (Test-Path "api")) {
    Write-Error "api directory not found. Make sure you're in the project root directory."
    exit 1
}

# Check if artisan file exists in api directory
if (-not (Test-Path "api/artisan")) {
    Write-Error "artisan file not found in api directory."
    exit 1
}

# Build the full command
$fullCommand = "php artisan $Command"
if ($Arguments) {
    $fullCommand += " " + ($Arguments -join " ")
}

# Change to api directory and run the command
Write-Host "Running: $fullCommand" -ForegroundColor Green
Write-Host "From directory: api/" -ForegroundColor Yellow

Push-Location api
try {
    Invoke-Expression $fullCommand
}
finally {
    Pop-Location
}



