import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  service: text("service"),
  budget: text("budget"),
  message: text("message"),
  status: text("status").default("new"),
  source: text("source").default("website"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const leadNotes = sqliteTable("lead_notes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  leadId: integer("lead_id").notNull(),
  note: text("note").notNull(),
  followUpDate: integer("follow_up_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const services = sqliteTable("services", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  iconName: text("icon_name"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  isAddon: integer("is_addon", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  clientName: text("client_name"),
  industry: text("industry"),
  title: text("title").notNull(),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  metrics: text("metrics"),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  status: text("status").default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const pricingTiers = sqliteTable("pricing_tiers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  startingPrice: text("starting_price"),
  description: text("description"),
  features: text("features"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const promptBundles = sqliteTable("prompt_bundles", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  githubUrl: text("github_url"),
  price: integer("price"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role"),
  company: text("company"),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const teamMembers = sqliteTable("team_members", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const contentPages = sqliteTable("content_pages", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const posts = sqliteTable("posts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url"),
  tags: text("tags"), // stored as a comma-separated list or JSON array
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").default("draft"), // "draft" or "published"
  publishedAt: integer("published_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const auditSubmissions = sqliteTable("audit_submissions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  websiteUrl: text("website_url").notNull(),
  businessType: text("business_type"),
  helpWith: text("help_with"),
  scores: text("scores"), // JSON string
  recommendations: text("recommendations"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const calculatorSubmissions = sqliteTable("calculator_submissions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email"),
  monthlyLeads: integer("monthly_leads"),
  conversionRate: real("conversion_rate"),
  averageValue: real("average_value"),
  currentRevenue: real("current_revenue"),
  timeSpentManual: real("time_spent_manual"),
  costManual: real("cost_manual"),
  expectedImprovement: real("expected_improvement"),
  results: text("results"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const resources = sqliteTable("resources", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  category: text("category"), // PDF, Checklist, Guide, Template
  fileType: text("file_type"), // PDF, XLSX, DOCX
  downloadUrl: text("download_url").notNull(),
  isGated: integer("is_gated", { mode: "boolean" }).default(true),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const gatedLeads = sqliteTable("gated_leads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  resourceId: integer("resource_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// RRRTX Partner Network
// ─────────────────────────────────────────────────────────────

export const partnerApplications = sqliteTable("partner_applications", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  applicationId: text("application_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  country: text("country"),
  role: text("role"),
  company: text("company"),
  website: text("website"),
  linkedin: text("linkedin"),
  experience: text("experience"),
  referralBackground: text("referral_background"),
  whyPartner: text("why_partner"),
  howRefer: text("how_refer"),
  status: text("status").notNull().default("pending"), // pending | under_review | approved | rejected
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewedBy: text("reviewed_by"),
});

export const partners = sqliteTable("partners", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  partnerId: text("partner_id").notNull().unique(),
  referralCode: text("referral_code").notNull().unique(),
  applicationId: integer("application_id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  country: text("country"),
  company: text("company"),
  website: text("website"),
  linkedin: text("linkedin"),
  role: text("role"),
  passwordHash: text("password_hash"),
  setupTokenHash: text("setup_token_hash"),
  setupTokenExpiresAt: integer("setup_token_expires_at", { mode: "timestamp" }),
  rank: text("rank").notNull().default("starter"),
  commissionRate: real("commission_rate").notNull().default(0.1),
  status: text("status").notNull().default("active"), // active | suspended | terminated
  joinDate: integer("join_date", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerRankTiers = sqliteTable("partner_rank_tiers", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  minProjects: integer("min_projects").notNull().default(0),
  minRevenue: real("min_revenue").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  isAutomatic: integer("is_automatic", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerRankHistory = sqliteTable("partner_rank_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  partnerId: integer("partner_id").notNull(),
  previousRank: text("previous_rank").notNull(),
  newRank: text("new_rank").notNull(),
  reason: text("reason"),
  actor: text("actor").notNull().default("system"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerAgreementVersions = sqliteTable("partner_agreement_versions", {
  version: text("version").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentHash: text("content_hash").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  effectiveAt: integer("effective_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerAgreements = sqliteTable("partner_agreements", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  partnerId: integer("partner_id").notNull(),
  version: text("version").notNull(),
  acceptanceRecordId: text("acceptance_record_id").notNull().unique(),
  signedName: text("signed_name").notNull(),
  signatureData: text("signature_data"),
  documentHash: text("document_hash").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  acceptedAt: integer("accepted_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerReferrals = sqliteTable("partner_referrals", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  referralId: text("referral_id").notNull().unique(),
  partnerId: integer("partner_id").notNull(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  industry: text("industry"),
  service: text("service"),
  budget: text("budget"),
  relationship: text("relationship"),
  notes: text("notes"),
  attribution: text("attribution"),
  leadId: integer("lead_id"),
  status: text("status").notNull().default("submitted"), // submitted | under_review | contacted | discovery | proposal | negotiation | won | lost
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerCommissions = sqliteTable("partner_commissions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  partnerId: integer("partner_id").notNull(),
  referralId: integer("referral_id"),
  projectName: text("project_name").notNull(),
  projectValue: real("project_value").notNull().default(0),
  amountReceived: real("amount_received").notNull().default(0),
  commissionRate: real("commission_rate").notNull().default(0.1),
  commissionAmount: real("commission_amount").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending | payable | paid | cancelled | reversed
  payableDate: integer("payable_date", { mode: "timestamp" }),
  paidDate: integer("paid_date", { mode: "timestamp" }),
  paymentReference: text("payment_reference"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerDocuments = sqliteTable("partner_documents", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  documentId: text("document_id").notNull().unique(),
  partnerId: integer("partner_id").notNull(),
  type: text("type").notNull(), // joining_letter | partnership_certificate | achievement_certificate
  rank: text("rank"),
  issueDate: integer("issue_date", { mode: "timestamp" }).$defaultFn(() => new Date()),
  snapshot: text("snapshot"), // JSON
  status: text("status").notNull().default("valid"), // valid | revoked
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const partnerAuditLogs = sqliteTable("partner_audit_logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  actorType: text("actor_type").notNull(), // admin | partner | system
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  meta: text("meta"), // JSON
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
