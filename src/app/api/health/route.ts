import { db, dbConfig } from "@/lib/db";
import { leads } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const start = Date.now();
    await db.select().from(leads).limit(1);
    const dbLatency = Date.now() - start;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        type: dbConfig.isTurso ? "turso" : "local",
        latency: `${dbLatency}ms`,
      },
      env: {
        hasDbUrl: !!process.env.TURSO_DATABASE_URL,
        hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
