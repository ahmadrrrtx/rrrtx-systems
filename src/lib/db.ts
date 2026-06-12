import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client);

// Export for debugging/health checks
export const dbConfig = { url: dbUrl, isTurso: dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://") };
