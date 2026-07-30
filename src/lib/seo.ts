import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site-config";

const DEFAULT_OG_IMAGE = "/assets/og-image.png";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image || DEFAULT_OG_IMAGE);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    openGraph: {
      title: `${input.title} | ${SITE_NAME}`,
      description: input.description,
      type: input.type || "website",
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: `${input.title} — ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} | ${SITE_NAME}`,
      description: input.description,
      images: [image],
    },
  };
}
