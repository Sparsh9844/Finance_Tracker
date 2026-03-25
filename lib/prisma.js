import { PrismaClient } from "@prisma/client";

// Pick the correct database URL based on environment
const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PROD // Use pooler in production
    : process.env.DATABASE_URL; // Use direct DB for local dev

let globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: ["query", "info", "warn", "error"],
  });

// Prevent creating multiple PrismaClient instances in dev
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
