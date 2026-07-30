import { describe, expect, it } from "vitest";
import { parseMetrics, parseStringList } from "../src/lib/content-parsers";

describe("content parsers", () => {
  it("parses JSON feature arrays without leaking brackets or quotes", () => {
    expect(parseStringList('["Architecture plan","Launch support"]')).toEqual([
      "Architecture plan",
      "Launch support",
    ]);
  });

  it("preserves legacy newline and comma lists", () => {
    expect(parseStringList("Audit\nArchitecture, QA")).toEqual(["Audit", "Architecture", "QA"]);
  });

  it("formats metric objects and preserves plain text", () => {
    expect(parseMetrics('{"orders":"15K+ orders","speed":"Sub-2s"}')).toBe("15K+ orders · Sub-2s");
    expect(parseMetrics("Measured client outcome")).toBe("Measured client outcome");
  });
});
