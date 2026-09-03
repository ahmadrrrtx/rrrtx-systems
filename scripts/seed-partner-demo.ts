// Demo data seeder for the RRRTX Partner Network preview (not part of the app).
// Run:  TURSO_DATABASE_URL=file:local.db npx tsx scripts/seed-partner-demo.ts

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  partnerAgreements,
  partnerApplications,
  partnerAuditLogs,
  partnerCommissions,
  partnerRankHistory,
  partnerReferrals,
  partners,
  users,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  ensureAgreementVersion,
  issuePartnerDocument,
  seedRankTiers,
} from "@/lib/partner-data";
import { AGREEMENT_VERSION } from "@/lib/partner-agreement";
import { formatAcceptanceId, formatReferralId, sha256Hex } from "@/lib/partner-logic";

const ago = (days: number) => new Date(Date.now() - days * 86_400_000);

async function main() {
  await seedRankTiers();
  await ensureAgreementVersion();

  const existing = await db.select().from(partners).where(eq(partners.email, "demo@rrrtx.com")).limit(1);
  if (existing.length) {
    console.log("Demo partner already exists — nothing to do.");
    return;
  }

  // ── Admin (so /dashboard/partners is reachable with known creds) ──
  const adminHash = await bcrypt.hash("admin-pass-123456", 12);
  await db
    .insert(users)
    .values({ email: "admin@rrrtx.com", passwordHash: adminHash, role: "admin" })
    .onConflictDoNothing();

  // ── Applications ──
  const [app1] = await db
    .insert(partnerApplications)
    .values({
      applicationId: "RRRTX-APP-2026-0001",
      name: "Ayesha Khan",
      email: "demo@rrrtx.com",
      phone: "+92 300 1112233",
      country: "Pakistan",
      role: "Agency Owner",
      company: "NorthBridge Digital",
      website: "https://northbridge.pk",
      linkedin: "https://linkedin.com/in/ayesha-khan",
      experience: "8+ years running a digital agency",
      referralBackground: "Refers e-commerce, fintech and SaaS clients across MENA.",
      whyPartner: "RRRTX builds the complex engineering my clients keep asking for.",
      howRefer: "Network, industry events, and client hand-offs.",
      status: "approved",
      reviewedAt: ago(20),
      reviewedBy: "admin@rrrtx.com",
    })
    .returning();
  const [app2] = await db
    .insert(partnerApplications)
    .values({
      applicationId: "RRRTX-APP-2026-0002",
      name: "Bilal Ahmed",
      email: "bilal@example.com",
      phone: "+971 50 555 1188",
      country: "United Arab Emirates",
      role: "Consultant",
      company: "Vertex Advisory",
      website: "https://vertex-advisory.ae",
      linkedin: "https://linkedin.com/in/bilal-ahmed",
      experience: "12 years in digital transformation consulting",
      referralBackground: "Advisory clients needing build partners.",
      whyPartner: "Trusted build partner for implementation work.",
      howRefer: "Consulting engagements.",
      status: "approved",
      reviewedAt: ago(14),
      reviewedBy: "admin@rrrtx.com",
    })
    .returning();
  await db.insert(partnerApplications).values({
    applicationId: "RRRTX-APP-2026-0003",
    name: "Chen Wei",
    email: "chen@example.com",
    phone: "+65 8123 4567",
    country: "Singapore",
    role: "Founder",
    company: "Lattice Labs",
    website: "https://latticelabs.sg",
    linkedin: "https://linkedin.com/in/chenwei",
    experience: "Ex-engineering lead, now a startup studio",
    referralBackground: "Portfolio companies that outsource build.",
    whyPartner: "Need a reliable offshore engineering partner.",
    howRefer: "Portfolio referrals.",
    status: "under_review",
  });
  await db.insert(partnerApplications).values({
    applicationId: "RRRTX-APP-2026-0004",
    name: "Daniyal Raza",
    email: "daniyal@example.com",
    phone: "+92 321 7654321",
    country: "Pakistan",
    role: "Freelance Marketer",
    company: "",
    website: "",
    linkedin: "https://linkedin.com/in/daniyal-raza",
    experience: "5 years performance marketing",
    referralBackground: "Clients needing web builds.",
    whyPartner: "Want to add development to my offer.",
    howRefer: "Client conversations.",
    status: "pending",
  });

  // ── Partners ──
  const p1Hash = await bcrypt.hash("Partner@123", 12);
  const [p1] = await db
    .insert(partners)
    .values({
      partnerId: "RRRTX-A7K29",
      referralCode: "A7K29",
      applicationId: app1.id,
      name: "Ayesha Khan",
      email: "demo@rrrtx.com",
      phone: "+92 300 1112233",
      country: "Pakistan",
      company: "NorthBridge Digital",
      website: "https://northbridge.pk",
      linkedin: "https://linkedin.com/in/ayesha-khan",
      role: "Agency Owner",
      passwordHash: p1Hash,
      rank: "bronze",
      commissionRate: 0.1,
      status: "active",
      joinDate: ago(20),
    })
    .returning();
  const [p2] = await db
    .insert(partners)
    .values({
      partnerId: "RRRTX-B4L19",
      referralCode: "B4L19",
      applicationId: app2.id,
      name: "Bilal Ahmed",
      email: "bilal@example.com",
      phone: "+971 50 555 1188",
      country: "United Arab Emirates",
      company: "Vertex Advisory",
      website: "https://vertex-advisory.ae",
      linkedin: "https://linkedin.com/in/bilal-ahmed",
      role: "Consultant",
      passwordHash: await bcrypt.hash("Partner@123", 12),
      rank: "silver",
      commissionRate: 0.12,
      status: "active",
      joinDate: ago(90),
    })
    .returning();
  const [p3] = await db
    .insert(partners)
    .values({
      partnerId: "RRRTX-C2W88",
      referralCode: "C2W88",
      name: "Chen Wei",
      email: "chen@example.com",
      phone: "+65 8123 4567",
      country: "Singapore",
      company: "Lattice Labs",
      website: "https://latticelabs.sg",
      linkedin: "https://linkedin.com/in/chenwei",
      role: "Founder",
      passwordHash: await bcrypt.hash("Partner@123", 12),
      rank: "gold",
      commissionRate: 0.15,
      status: "active",
      joinDate: ago(180),
    })
    .returning();

  // ── Agreements signed ──
  const accHash = await sha256Hex(`${AGREEMENT_VERSION}|RRRTX-A7K29|demo@rrrtx.com`);
  await db.insert(partnerAgreements).values([
    {
      partnerId: p1.id,
      version: AGREEMENT_VERSION,
      acceptanceRecordId: formatAcceptanceId(2026, 1),
      signedName: "Ayesha Khan",
      documentHash: accHash,
      ipAddress: "203.0.113.10",
      userAgent: "Mozilla/5.0 (Macintosh; demo)",
      acceptedAt: ago(19),
    },
    {
      partnerId: p2.id,
      version: AGREEMENT_VERSION,
      acceptanceRecordId: formatAcceptanceId(2026, 2),
      signedName: "Bilal Ahmed",
      documentHash: await sha256Hex(`${AGREEMENT_VERSION}|RRRTX-B4L19|bilal@example.com`),
      ipAddress: "203.0.113.21",
      userAgent: "Mozilla/5.0 (Windows; demo)",
      acceptedAt: ago(85),
    },
    {
      partnerId: p3.id,
      version: AGREEMENT_VERSION,
      acceptanceRecordId: formatAcceptanceId(2026, 3),
      signedName: "Chen Wei",
      documentHash: await sha256Hex(`${AGREEMENT_VERSION}|RRRTX-C2W88|chen@example.com`),
      ipAddress: "203.0.113.32",
      userAgent: "Mozilla/5.0 (X11; demo)",
      acceptedAt: ago(170),
    },
  ]);

  // ── Documents for the demo partner ──
  const joiningLetterId = await issuePartnerDocument(p1.id, "joining_letter", null, "system");
  const certId = await issuePartnerDocument(p1.id, "partnership_certificate", "bronze", "system");
  await issuePartnerDocument(p2.id, "joining_letter", null, "system");
  await issuePartnerDocument(p2.id, "partnership_certificate", "silver", "system");
  await issuePartnerDocument(p3.id, "partnership_certificate", "gold", "system");

  // ── Referrals (demo partner) ──
  const refs = await db
    .insert(partnerReferrals)
    .values([
      { referralId: formatReferralId(184), partnerId: p1.id, businessName: "Al-Noor Retail", contactName: "Omar Sheikh", contactEmail: "omar@alnoor.pk", contactPhone: "+92 300 555 0101", website: "https://alnoor.pk", industry: "Retail", service: "E-commerce Platform", budget: "PKR 3.5M", relationship: "Existing client", notes: "Migrating from WooCommerce.", status: "won", createdAt: ago(40), updatedAt: ago(25) },
      { referralId: formatReferralId(185), partnerId: p1.id, businessName: "FinEdge Technologies", contactName: "Sara Malik", contactEmail: "sara@finedge.io", website: "https://finedge.io", industry: "Fintech", service: "Mobile App", budget: "PKR 2.6M", relationship: "Referral", status: "won", createdAt: ago(30), updatedAt: ago(12) },
      { referralId: formatReferralId(186), partnerId: p1.id, businessName: "Karachi Textiles", contactName: "Rashid Ali", contactEmail: "rashid@karachitextiles.com", industry: "Textile", service: "Business Website", budget: "PKR 800K", status: "lost", createdAt: ago(35), updatedAt: ago(28) },
      { referralId: formatReferralId(187), partnerId: p1.id, businessName: "Apex Logistics", contactName: "Hina Baig", contactEmail: "hina@apexlogistics.com", industry: "Logistics", service: "Custom Software", budget: "PKR 5M", relationship: "Warm intro", status: "discovery", createdAt: ago(8), updatedAt: ago(3) },
      { referralId: formatReferralId(188), partnerId: p1.id, businessName: "MediCare Clinics", contactName: "Dr. Fatima Noor", contactEmail: "fatima@medicare.pk", industry: "Healthcare", service: "Website + Booking", budget: "PKR 1.2M", status: "proposal", createdAt: ago(12), updatedAt: ago(4) },
      { referralId: formatReferralId(189), partnerId: p1.id, businessName: "Verde Organics", contactName: "Usman Tariq", contactEmail: "usman@verdeorganics.com", industry: "Agriculture", service: "E-commerce Store", budget: "PKR 900K", status: "contacted", createdAt: ago(3), updatedAt: ago(1) },
    ])
    .returning();
  const refMap = Object.fromEntries(refs.map((r) => [r.businessName, r.id]));

  await db.insert(partnerReferrals).values([
    { referralId: formatReferralId(190), partnerId: p2.id, businessName: "Gulf Capital Advisors", contactName: "Nadia Rahman", contactEmail: "nadia@gulfcap.ae", industry: "Finance", service: "Web Portal", budget: "AED 120K", status: "won", createdAt: ago(60), updatedAt: ago(40) },
    { referralId: formatReferralId(191), partnerId: p3.id, businessName: "Lattice Portfolio Co.", contactName: "Mei Ling", contactEmail: "mei@lattice.sg", industry: "SaaS", service: "Product Engineering", budget: "SGD 90K", status: "negotiation", createdAt: ago(20), updatedAt: ago(2) },
  ]);

  // ── Commissions (demo partner) ──
  await db.insert(partnerCommissions).values([
    { partnerId: p1.id, referralId: refMap["Al-Noor Retail"], projectName: "Al-Noor Retail — E-commerce Platform", projectValue: 5000, amountReceived: 5000, commissionRate: 0.1, commissionAmount: 500, status: "paid", payableDate: ago(12), paidDate: ago(9), paymentReference: "TRF-2026-0814", createdAt: ago(40), updatedAt: ago(9) },
    { partnerId: p1.id, referralId: refMap["FinEdge Technologies"], projectName: "FinEdge — Mobile App", projectValue: 4000, amountReceived: 4000, commissionRate: 0.1, commissionAmount: 400, status: "payable", payableDate: ago(5), createdAt: ago(30), updatedAt: ago(5) },
    { partnerId: p1.id, referralId: refMap["MediCare Clinics"], projectName: "MediCare — Website + Booking", projectValue: 12000, amountReceived: 0, commissionRate: 0.1, commissionAmount: 0, status: "pending", createdAt: ago(12), updatedAt: ago(4) },
    { partnerId: p1.id, referralId: refMap["Karachi Textiles"], projectName: "Karachi Textiles — Website", projectValue: 8000, amountReceived: 0, commissionRate: 0.1, commissionAmount: 0, status: "cancelled", createdAt: ago(35), updatedAt: ago(28) },
  ]);
  await db.insert(partnerCommissions).values([
    { partnerId: p2.id, projectName: "Gulf Capital — Web Portal", projectValue: 30000, amountReceived: 30000, commissionRate: 0.12, commissionAmount: 3600, status: "paid", payableDate: ago(45), paidDate: ago(40), paymentReference: "TRF-2026-0711", createdAt: ago(60), updatedAt: ago(40) },
    { partnerId: p3.id, projectName: "Lattice — Product Engineering", projectValue: 60000, amountReceived: 45000, commissionRate: 0.15, commissionAmount: 6750, status: "payable", payableDate: ago(2), createdAt: ago(20), updatedAt: ago(2) },
  ]);

  // ── Rank history (demo partner) ──
  await db.insert(partnerRankHistory).values([
    { partnerId: p1.id, previousRank: "starter", newRank: "bronze", reason: "2 projects won", actor: "system", createdAt: ago(25) },
    { partnerId: p2.id, previousRank: "starter", newRank: "bronze", reason: "First project won", actor: "system", createdAt: ago(50) },
    { partnerId: p2.id, previousRank: "bronze", newRank: "silver", reason: "Revenue threshold", actor: "system", createdAt: ago(20) },
  ]);

  // ── Audit trail ──
  await db.insert(partnerAuditLogs).values([
    { actorType: "system", action: "application_approved", entityType: "application", entityId: "RRRTX-APP-2026-0001", ipAddress: "203.0.113.10", createdAt: ago(20) },
    { actorType: "partner", actorId: "RRRTX-A7K29", action: "login", entityType: "partner", entityId: "RRRTX-A7K29", ipAddress: "203.0.113.10", createdAt: ago(19) },
    { actorType: "partner", actorId: "RRRTX-A7K29", action: "agreement_signed", entityType: "agreement", entityId: formatAcceptanceId(2026, 1), ipAddress: "203.0.113.10", createdAt: ago(19) },
    { actorType: "system", action: "document_issued", entityType: "document", entityId: joiningLetterId, createdAt: ago(19) },
    { actorType: "system", action: "document_issued", entityType: "document", entityId: certId, createdAt: ago(19) },
  ]);

  console.log("Seeded demo data.");
  console.log("  Partner login:  demo@rrrtx.com  /  Partner@123");
  console.log("  Admin login:    admin@rrrtx.com /  admin-pass-123456");
  console.log(`  Certificate to verify: ${certId}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
