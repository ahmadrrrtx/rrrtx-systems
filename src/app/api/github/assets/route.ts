import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner") || "ahmadrrrtx";
    const repo = searchParams.get("repo") || "Gemma-4-RSS-Intelligence-Monitor";
    const path = searchParams.get("path") || "";
    const branch = searchParams.get("branch") || "main";

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error: "GitHub API error", details: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub assets" }, { status: 500 });
  }
}
