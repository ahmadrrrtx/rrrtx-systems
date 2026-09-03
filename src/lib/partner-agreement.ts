// RRRTX Partner Network Agreement — versioned template (business draft).
//
// ⚠️ This is a professionally structured starting document, NOT legal advice.
// Every clause marked "lawyer review" should be confirmed by qualified counsel
// before relying on it in a specific jurisdiction.

export const AGREEMENT_VERSION = "1.0";
export const AGREEMENT_TITLE = "RRRTX Partner Network Agreement";

export interface AgreementSection {
  number: number;
  title: string;
  paragraphs: string[];
  lawyerReview?: boolean;
}

export const AGREEMENT_SECTIONS: AgreementSection[] = [
  {
    number: 1,
    title: "Parties",
    paragraphs: [
      "This Partner Network Agreement (\"Agreement\") is entered into by and between RRRTX Systems (\"RRRTX\", \"we\", \"our\"), and the partner identified in the acceptance record (\"Partner\", \"you\"), collectively the \"Parties\".",
    ],
    lawyerReview: true,
  },
  {
    number: 2,
    title: "Definitions",
    paragraphs: [
      "\"Referral\" means a prospective client introduced by the Partner to RRRTX through the official referral channel. \"Qualifying Project\" means a paid project signed and delivered by RRRTX for a referred client, subject to this Agreement. \"Commission\" means the referral fee calculated under Clause 10. \"Attributed Revenue\" means client payments actually received by RRRTX for a Qualifying Project attributable to the Partner's Referral.",
    ],
  },
  {
    number: 3,
    title: "Appointment",
    paragraphs: [
      "RRRTX appoints the Partner as a non-exclusive introducer of prospective clients. The Partner accepts this appointment on the terms of this Agreement. Nothing in this Agreement creates an employment, agency, franchise, or joint-venture relationship.",
    ],
  },
  {
    number: 4,
    title: "Partnership Scope",
    paragraphs: [
      "The Partner may introduce prospective clients for RRRTX services, including custom ecommerce systems, AI automations and agents, lead generation systems, website rebuilds, chatbots and AI assistants, and SEO/AEO engagements.",
    ],
  },
  {
    number: 5,
    title: "Partner Responsibilities",
    paragraphs: [
      "The Partner will represent RRRTX accurately and professionally, submit referrals through the official channel with truthful information, comply with this Agreement and applicable law, and not make representations about pricing, scope, or commitments beyond RRRTX's published information.",
    ],
  },
  {
    number: 6,
    title: "RRRTX Responsibilities",
    paragraphs: [
      "RRRTX will review referrals in good faith, qualify and pursue them at its reasonable discretion, track referral status visibly in the Partner dashboard, and pay eligible Commission under Clauses 10–12.",
    ],
  },
  {
    number: 7,
    title: "Referral Process",
    paragraphs: [
      "Referrals are submitted through the Partner dashboard. Each accepted referral receives a unique referral ID and a visible status. Manual submission through the official channel is the authoritative attribution method.",
    ],
  },
  {
    number: 8,
    title: "Lead Attribution",
    paragraphs: [
      "A Referral is attributed to the Partner who first submits it through the official channel. RRRTX may reasonably consider supplementary evidence (such as a referral link) but is not bound to attribute a lead where the official submission is absent or ambiguous.",
    ],
  },
  {
    number: 9,
    title: "Duplicate and Existing Leads",
    paragraphs: [
      "If a referred prospect is already an RRRTX lead, already in active discussion with RRRTX, or was independently introduced by another partner, RRRTX will determine attribution reasonably and in good faith. RRRTX's determination, with reasons recorded, is final.",
    ],
  },
  {
    number: 10,
    title: "Commission",
    paragraphs: [
      "Subject to this Agreement, the Partner earns Commission on Qualifying Projects at the rate shown in the Partner's dashboard (the \"Commission Rate\"). The default Commission Rate is 10% of Attributed Revenue unless a different rate is agreed in writing or configured by RRRTX.",
    ],
    lawyerReview: true,
  },
  {
    number: 11,
    title: "Commission Eligibility",
    paragraphs: [
      "Commission becomes eligible only where: (a) the prospect was an attributable Referral; (b) RRRTX signs a paid project with that prospect; and (c) RRRTX has actually received the applicable client payment. No Commission is earned merely because a proposal was issued or a project was signed but unpaid.",
    ],
    lawyerReview: true,
  },
  {
    number: 12,
    title: "Payment Timing",
    paragraphs: [
      "Commission is calculated against client payments actually received, net of any refunds, chargebacks, or reversals. For milestone or installment projects, Commission may be calculated per received payment. Payment is made through a method communicated by RRRTX, after the relevant payment has cleared and any reversal window has passed.",
    ],
    lawyerReview: true,
  },
  {
    number: 13,
    title: "Refunds and Reversals",
    paragraphs: [
      "If RRRTX refunds or reverses a client payment, the corresponding Commission is reduced or reversed accordingly. RRRTX may offset such amounts against future Commission.",
    ],
  },
  {
    number: 14,
    title: "Taxes",
    paragraphs: [
      "The Partner is solely responsible for any taxes applicable to Commission received, including any withholding, income, or other taxes in the Partner's jurisdiction. RRRTX may withhold amounts required by law.",
    ],
    lawyerReview: true,
  },
  {
    number: 15,
    title: "Confidentiality",
    paragraphs: [
      "Each Party will keep confidential the other's non-public information, including client information, deal terms, and this Agreement's commercial terms, and will use it only to perform this Agreement. This survives termination.",
    ],
  },
  {
    number: 16,
    title: "Intellectual Property",
    paragraphs: [
      "RRRTX retains all rights in its brand, software, deliverables, and materials. The Partner acquires no intellectual property rights except the limited, revocable right to use RRRTX-provided partner materials for referral purposes under Clause 17.",
    ],
  },
  {
    number: 17,
    title: "RRRTX Brand Usage",
    paragraphs: [
      "The Partner may use RRRTX-provided materials and the RRRTX name and logo solely to promote RRRTX in accordance with any brand guidelines. The Partner must not modify RRRTX marks or imply endorsement or partnership beyond this Agreement, and must stop use on request or termination.",
    ],
  },
  {
    number: 18,
    title: "No Authority to Bind RRRTX",
    paragraphs: [
      "The Partner has no authority to bind RRRTX, to sign on RRRTX's behalf, to quote prices, to make commitments, or to collect payment. The Partner must not hold itself out as an employee or agent of RRRTX.",
    ],
  },
  {
    number: 19,
    title: "Client Relationships",
    paragraphs: [
      "All client relationships and contracts belong to RRRTX. The Partner must not interfere with RRRTX's client relationships and has no right to the referred client's business beyond this Agreement's Commission.",
    ],
  },
  {
    number: 20,
    title: "Non-Circumvention",
    paragraphs: [
      "For the term of this Agreement and a reasonable period after, the Partner must not circumvent RRRTX to deliver, arrange, or profit from services substantially similar to the referred engagement outside this Agreement.",
    ],
    lawyerReview: true,
  },
  {
    number: 21,
    title: "Data and Privacy",
    paragraphs: [
      "The Partner must obtain any consent required to share referred-prospect information with RRRTX, and must not share RRRTX data with third parties. RRRTX processes partner and referral data for program administration in accordance with its published privacy practices and applicable law.",
    ],
    lawyerReview: true,
  },
  {
    number: 22,
    title: "Term",
    paragraphs: [
      "This Agreement begins on electronic acceptance and continues until terminated under Clause 23. It may be renewed or superseded by an updated version as described in Clause 30.",
    ],
  },
  {
    number: 23,
    title: "Suspension and Termination",
    paragraphs: [
      "Either Party may terminate on written notice. RRRTX may suspend or terminate immediately for breach, fraud, misrepresentation, unlawful conduct, or brand misuse. On termination, the Partner's dashboard access ends; Commission earned and payable before termination is paid subject to Clause 11–13.",
    ],
  },
  {
    number: 24,
    title: "Effect of Termination",
    paragraphs: [
      "Clauses concerning confidentiality, intellectual property, non-circumvention, liability, and accrued payment obligations survive termination. Pending referrals are assessed under this Agreement's attribution and eligibility terms for work signed before termination.",
    ],
  },
  {
    number: 25,
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, neither Party is liable for indirect, incidental, or consequential damages, and each Party's aggregate liability under this Agreement is limited to the Commission actually payable in the twelve months preceding the claim. Nothing limits liability that cannot be limited by law.",
    ],
    lawyerReview: true,
  },
  {
    number: 26,
    title: "Indemnification",
    paragraphs: [
      "Each Party indemnifies the other against third-party claims arising from the indemnifying Party's breach of this Agreement, misrepresentation, or unlawful conduct, except to the extent caused by the other Party.",
    ],
    lawyerReview: true,
  },
  {
    number: 27,
    title: "Dispute Resolution",
    paragraphs: [
      "The Parties will first attempt to resolve disputes in good faith through direct discussion. If unresolved, the Parties may agree to mediation before pursuing other remedies.",
    ],
    lawyerReview: true,
  },
  {
    number: 28,
    title: "Governing Law",
    paragraphs: [
      "This Agreement is governed by the laws of the Islamic Republic of Pakistan, without regard to conflict-of-law principles.",
    ],
    lawyerReview: true,
  },
  {
    number: 29,
    title: "Jurisdiction",
    paragraphs: [
      "The Parties submit to the exclusive jurisdiction of the competent courts in Islamabad, Pakistan, subject to Clause 27.",
    ],
    lawyerReview: true,
  },
  {
    number: 30,
    title: "Electronic Acceptance",
    paragraphs: [
      "This Agreement may be accepted electronically. The Partner's authenticated submission of the acceptance form — including an affirmative acknowledgment and typed legal name — constitutes the Partner's electronic signature and agreement to be bound. RRRTX records the version, timestamp, and integrity metadata, and the Partner agrees such records are admissible evidence of acceptance to the extent permitted by law.",
    ],
    lawyerReview: true,
  },
  {
    number: 31,
    title: "Amendments",
    paragraphs: [
      "RRRTX may publish an updated version of this Agreement. Continued participation after notice of a new version may constitute acceptance where lawful. Material changes may require the Partner's re-acceptance before further referral activity.",
    ],
    lawyerReview: true,
  },
  {
    number: 32,
    title: "Severability",
    paragraphs: [
      "If any provision is held unenforceable, the remaining provisions continue in effect, and the unenforceable provision is modified to the minimum extent necessary.",
    ],
  },
  {
    number: 33,
    title: "Entire Agreement",
    paragraphs: [
      "This Agreement (including its versioned schedules) is the entire agreement between the Parties regarding its subject matter and supersedes prior discussions.",
    ],
  },
  {
    number: 34,
    title: "Notices",
    paragraphs: [
      "Notices to RRRTX should be sent to the contact email published on the RRRTX Systems website. Notices to the Partner may be sent to the email on the Partner's account.",
    ],
  },
  {
    number: 35,
    title: "Force Majeure",
    paragraphs: [
      "Neither Party is liable for failure caused by events beyond its reasonable control, provided the affected Party notifies the other and makes reasonable efforts to resume performance.",
    ],
  },
  {
    number: 36,
    title: "Signatures",
    paragraphs: [
      "This Agreement is executed electronically. The acceptance record identifies the Partner, the Partner ID, the agreement version, the signed name, and the acceptance timestamp, and together with the stored document hash constitutes the executed agreement.",
    ],
  },
];

/** The exact text that is hashed for integrity verification. */
export function agreementHashSource(): string {
  return AGREEMENT_SECTIONS.map((s) => `## ${s.number}. ${s.title}\n${s.paragraphs.join("\n")}`).join("\n\n");
}
