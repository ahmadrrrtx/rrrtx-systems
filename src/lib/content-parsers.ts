export function parseStringList(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Legacy values are newline- or comma-separated.
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim().replace(/^['"\[]+|['"\]]+$/g, ""))
    .filter(Boolean);
}

export function parseMetrics(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.values(parsed as Record<string, unknown>)
        .filter((item) => typeof item === "string" || typeof item === "number")
        .join(" · ");
    }
  } catch {
    // Preserve legacy plain-text metrics.
  }
  return value;
}
