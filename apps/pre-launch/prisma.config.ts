import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";
if (existsSync(".env.local")) loadEnvFile(".env.local");
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL,
  },
});
