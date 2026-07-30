import { describe, expect, it } from "vitest";
import { absoluteUrl, createMetadata } from "../src/lib/seo";

describe("SEO metadata", () => {
  it("creates a self-referencing canonical and complete social cards", () => {
    const metadata = createMetadata({ title: "Custom Ecommerce", description: "A useful description", path: "/services/ecommerce" });
    expect(metadata.alternates?.canonical).toBe("https://rrrtx-systems.com/services/ecommerce");
    expect(metadata.openGraph && "url" in metadata.openGraph ? metadata.openGraph.url : null).toBe("https://rrrtx-systems.com/services/ecommerce");
    expect(metadata.twitter && "images" in metadata.twitter ? metadata.twitter.images : null).toBeTruthy();
  });

  it("does not alter an already absolute URL", () => {
    expect(absoluteUrl("https://cdn.example.com/image.jpg")).toBe("https://cdn.example.com/image.jpg");
  });
});
