import type { Metadata } from "next";
import { getPublicResources } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResourcesClient } from "./resources-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gated Engineering Resources & Guides | RRRTX SYSTEMS",
  description:
    "Explore our free downloads, website planning documents, checklist templates, launch sheets, and guides for custom ecommerce & AI automation systems.",
  openGraph: {
    title: "Gated Engineering Resources & Guides | RRRTX SYSTEMS",
    description: "Explore our free downloads, website planning documents, checklist templates, and guides.",
    url: "/resources",
  },
};

export default async function ResourcesPage() {
  const items = await getPublicResources();

  // Convert schema objects to matching typescript props for front-end client
  const serializedItems = items.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description || "",
    coverImageUrl: r.coverImageUrl || "",
    category: r.category || "Guide",
    fileType: r.fileType || "PDF",
    isGated: r.isGated || false,
    downloadUrl: r.downloadUrl,
  }));

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <ResourcesClient initialItems={serializedItems} />
      <Footer />
    </main>
  );
}
