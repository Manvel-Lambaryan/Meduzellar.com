import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

for (const [name, url] of [
  ["prelaunch", process.env.MIGRATION_DATABASE_URL],
  ["prelaunch_test", process.env.TEST_MIGRATION_DATABASE_URL],
]) {
  const parsed = new URL(url ?? "");
  if (
    parsed.hostname !== "127.0.0.1" ||
    parsed.port !== "55432" ||
    parsed.pathname !== "/" + name
  )
    throw new Error("Dedicated local database required");
  const run = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: { ...process.env, MIGRATION_DATABASE_URL: url }, stdio: "inherit" },
  );
  if (run.status !== 0) process.exit(run.status ?? 1);
  const psql = spawnSync(
    resolve(".local/pgsql/bin/psql.exe"),
    [
      "-X",
      "-v",
      "ON_ERROR_STOP=1",
      "-q",
      "-h",
      "127.0.0.1",
      "-p",
      "55432",
      "-U",
      decodeURIComponent(parsed.username),
      "-d",
      name,
    ],
    {
      env: { ...process.env, PGPASSWORD: decodeURIComponent(parsed.password) },
      encoding: "utf8",
      stdio: ["pipe", "inherit", "inherit"],
      input: `REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO prelaunch_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO prelaunch_app;
REVOKE ALL ON "_prisma_migrations" FROM prelaunch_app;
REVOKE UPDATE ON "AuditEvent" FROM prelaunch_app;
REVOKE UPDATE, DELETE ON "ConsentEvent" FROM prelaunch_app;`,
    },
  );
  if (psql.status !== 0) process.exit(psql.status ?? 1);
}
