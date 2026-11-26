$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $root
$local=Join-Path $root '.local'
$pg=Join-Path $local 'pgsql/bin'
$node=Join-Path $local 'node-v24.22.3-win-x64'
$env:Path="$node;$pg;$env:Path"
$cluster=Join-Path $local 'pgdata'
$port=55432
function New-Secret {
  $secretBytes=New-Object byte[] 32
  $rng=[Security.Cryptography.RandomNumberGenerator]::Create()
  try {$rng.GetBytes($secretBytes)} finally {$rng.Dispose()}
  [BitConverter]::ToString($secretBytes).Replace('-','').ToLowerInvariant()
}
function Invoke-Pg {
  param([string]$Sql)
  $Sql | & psql.exe -X -v 'ON_ERROR_STOP=1' -q -h 127.0.0.1 -p $port -U prelaunch_admin -d postgres
  if ($LASTEXITCODE) {throw 'Local PostgreSQL setup failed'}
}
if (!(Test-Path -LiteralPath (Join-Path $cluster 'PG_VERSION'))) {
  if(Test-Path -LiteralPath (Join-Path $root '.env.local')) {throw 'Existing local configuration must be reconciled before initializing a database'}
  $admin=New-Secret
  $app=New-Secret
  $migration=New-Secret
  $pwfile=Join-Path $local 'init-password'
  [IO.File]::WriteAllText($pwfile,$admin+[Environment]::NewLine)
  & initdb.exe -D $cluster -U prelaunch_admin --auth=scram-sha-256 "--pwfile=$pwfile" --encoding=UTF8 --locale=C
  if ($LASTEXITCODE) {throw 'Local PostgreSQL initialization failed'}
  Remove-Item -LiteralPath $pwfile
  [IO.File]::WriteAllText((Join-Path $local 'pgadmin.secret'),$admin)
  Add-Content -LiteralPath (Join-Path $cluster 'postgresql.conf') -Value "listen_addresses = '127.0.0.1'","port = $port","password_encryption = 'scram-sha-256'" -Encoding ascii
  $new=$true
}
& pg_ctl.exe status -D $cluster *> $null
if ($LASTEXITCODE) {
  & pg_ctl.exe start -D $cluster -l (Join-Path $local 'postgres.log') -w
  if ($LASTEXITCODE) {throw 'Could not start dedicated loopback PostgreSQL'}
}
if($new) {
  try {
    $env:PGPASSWORD=$admin
    Invoke-Pg ("CREATE ROLE prelaunch_migrate LOGIN PASSWORD '$migration'; CREATE ROLE prelaunch_app LOGIN PASSWORD '$app';" + [Environment]::NewLine +
      "CREATE DATABASE prelaunch OWNER prelaunch_migrate;" + [Environment]::NewLine +
      "CREATE DATABASE prelaunch_test OWNER prelaunch_migrate;" + [Environment]::NewLine +
      "REVOKE CONNECT ON DATABASE prelaunch, prelaunch_test FROM PUBLIC; GRANT CONNECT ON DATABASE prelaunch, prelaunch_test TO prelaunch_app;")
  } finally {Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue}
  $config=@(
    'APP_ORIGIN=http://127.0.0.1:3001',
    "DATABASE_URL=postgresql://prelaunch_app:${app}@127.0.0.1:${port}/prelaunch",
    "MIGRATION_DATABASE_URL=postgresql://prelaunch_migrate:${migration}@127.0.0.1:${port}/prelaunch",
    "TEST_DATABASE_URL=postgresql://prelaunch_app:${app}@127.0.0.1:${port}/prelaunch_test",
    "TEST_MIGRATION_DATABASE_URL=postgresql://prelaunch_migrate:${migration}@127.0.0.1:${port}/prelaunch_test",
    "LOOKUP_KEY=$(New-Secret)", "ADDRESS_KEY=$(New-Secret)", "VERIFY_KEY=$(New-Secret)", "UNSUBSCRIBE_KEY=$(New-Secret)", "PRIVACY_KEY=$(New-Secret)", "RATE_KEY=$(New-Secret)", "CRON_SECRET=$(New-Secret)",
    'TURNSTILE_SITE_KEY=1x00000000000000000000BB','TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA',
    'LOCAL_TEST_MAIL_DOMAIN=example.test','LOCAL_LAUNCH_URLS=https://meduzellar.test/'
  )
  [IO.File]::WriteAllLines((Join-Path $root '.env.local'),[string[]]$config)
}
