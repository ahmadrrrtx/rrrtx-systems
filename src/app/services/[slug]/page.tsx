import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ServicePageClient } from "./service-client";
import { getServiceBySlug } from "@/lib/queries";
import { mergeServiceDetail, serviceData } from "@/lib/service-data";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site-config";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;
export const dynamicParams = true;

const resolveService = cache(async function resolveService(slug: string) {
  const shouldReadDatabase = Boolean(process.env.TURSO_DATABASE_URL) || process.env.NODE_ENV !== "production";
  const dbService = shouldReadDatabase ? await getServiceBySlug(slug) : null;
  if (dbService && !dbService.isActive) return null;
  return mergeServiceDetail(slug, dbService);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) notFound();

  return createMetadata({
    title: service.title,
    description: service.description.slice(0, 160),
    path: `/services/${slug}`,
    image: service.image,
  });
}

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) notFound();

  const serviceUrl = absoluteUrl(`/services/${slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        name: service.title,
        description: service.description,
        url: serviceUrl,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
        serviceType: service.title,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: serviceUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id={`schema-service-${slug}`} data={schema} />
      <Navbar />
      <ServicePageClient service={service} />
      <Footer />
    </>
  );
}
