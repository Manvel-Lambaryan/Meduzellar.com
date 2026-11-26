import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
const shared = globalThis as typeof globalThis & { preLaunchDb?: PrismaClient };
export function db() {
  if (!shared.preLaunchDb) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("Database unavailable");
    shared.preLaunchDb = new PrismaClient({
      adapter: new PrismaPg({
        connectionString,
        max: 8,
        connectionTimeoutMillis: 3000,
      }),
    });
  }
  return shared.preLaunchDb;
}
export type { Prisma } from "@/generated/prisma/client";
