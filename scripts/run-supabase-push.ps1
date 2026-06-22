$tokenPath = Join-Path $PSScriptRoot "..\.supabase_token"

if (Test-Path $tokenPath) {
    $token = Get-Content $tokenPath -Raw
    $token = $token.Trim()
} else {
    $token = Read-Host "Enter Supabase CLI access token (sbp_... or sb_secret_...)"
}

if (-not $token) {
    Write-Error "Supabase token is required. Create a .supabase_token file or enter the token when prompted."
    exit 1
}

$env:SUPABASE_ACCESS_TOKEN = $token
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Linking Supabase project..."
npx supabase link --project-ref pmujkebyxcgspjdcbary --yes

Write-Host "Pushing Supabase migrations..."
npx supabase db push --yes
