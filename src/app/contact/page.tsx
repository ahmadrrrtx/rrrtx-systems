import type { Metadata } from "next";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Book a Free Strategy Call — Start Your Project",
  description:
    "Start your custom ecommerce or AI automation project. Free strategy call with clear next steps. No sales pressure. We reply within 24 hours.",
  openGraph: {
    title: "Book a Free Strategy Call — Start Your Project | RRRTX SYSTEMS",
    description: "Start your custom ecommerce or AI automation project. Free strategy call with clear next steps.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
