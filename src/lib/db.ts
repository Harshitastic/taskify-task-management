function replaceDbName(url: string | undefined, dbName: string): string | undefined {
  if (!url) return url;
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return url.replace(/\/neondb(\?|$)/, `/${dbName}$1`);
  }
  return url;
}

if (process.env.POSTGRES_PRISMA_URL) {
  process.env.POSTGRES_PRISMA_URL = replaceDbName(process.env.POSTGRES_PRISMA_URL, 'taskify');
}
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL_NON_POOLING = replaceDbName(process.env.POSTGRES_URL_NON_POOLING, 'taskify');
}
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = replaceDbName(process.env.DATABASE_URL, 'taskify');
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
