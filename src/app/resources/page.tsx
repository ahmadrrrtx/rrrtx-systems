import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getPublicResources } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResourcesClient } from "./resources-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Free Systems & Engineering Resources",
  description:
    "Download practical ecommerce, conversion, website-launch, lead-generation, and AI automation guides from RRRTX Systems.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const items = await getPublicResources();

  // Convert schema objects to matching typescript props for front-end client
  const serializedItems = items.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description || "",
    coverImageUrl: r.coverImageUrl || "",
    category: r.category || "Guide",
    fileType: r.downloadUrl.toLowerCase().split("?")[0].endsWith(".html")
      ? "Interactive HTML"
      : (r.fileType || "Download"),
    isGated: r.isGated || false,
    downloadUrl: r.downloadUrl,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RRRTX Systems engineering resources",
    numberOfItems: serializedItems.length,
    itemListElement: serializedItems.map((resource, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.title,
      url: resource.downloadUrl.startsWith("http")
        ? resource.downloadUrl
        : `https://rrrtx-systems.com${resource.downloadUrl}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-resource-library" data={schema} />
      <Navbar />
      <ResourcesClient initialItems={serializedItems} />
      <Footer />
    </main>
  );
}
