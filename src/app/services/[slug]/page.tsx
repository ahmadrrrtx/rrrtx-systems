import type { Metadata } from "next";
import { ServicePageClient, serviceData } from "./service-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug];

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service does not exist.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${service.title} — Custom Solutions`,
    description: service.description,
    openGraph: {
      title: `${service.title} — Custom Solutions | RRRTX SYSTEMS`,
      description: service.description,
      url: `/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServicePageClient slug={slug} />;
}
