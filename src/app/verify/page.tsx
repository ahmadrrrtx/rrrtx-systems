// Public certificate verification — entry page: enter a certificate ID to check
// authenticity. The per-certificate result lives at /verify/[certificateId].

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifyLookup } from "./verify-lookup";

export const metadata: Metadata = {
  title: "Verify a Certificate — RRRTX Systems",
  description:
    "Check whether an RRRTX Partner Network certificate is genuine. Enter the certificate ID printed on the document to confirm its validity.",
  robots: { index: false, follow: false },
};

export default function VerifyIndexPage() {
  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <VerifyLookup />
      <Footer />
    </main>
  );
}
