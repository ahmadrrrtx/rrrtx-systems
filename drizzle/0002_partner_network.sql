-- Migration: RRRTX Partner Network tables.
-- Additive and idempotent (CREATE TABLE IF NOT EXISTS). No destructive statements.
-- Apply order: drizzle-kit push (schema-driven) OR this SQL against Turso.
--
--   turso db shell <database> < drizzle/0002_partner_network.sql

CREATE TABLE IF NOT EXISTS `partner_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`country` text,
	`role` text,
	`company` text,
	`website` text,
	`linkedin` text,
	`experience` text,
	`referral_background` text,
	`why_partner` text,
	`how_refer` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	`reviewed_at` integer,
	`reviewed_by` text
);

CREATE TABLE IF NOT EXISTS `partners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partner_id` text NOT NULL UNIQUE,
	`referral_code` text NOT NULL UNIQUE,
	`application_id` integer,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`phone` text,
	`country` text,
	`company` text,
	`website` text,
	`linkedin` text,
	`role` text,
	`password_hash` text,
	`setup_token_hash` text,
	`setup_token_expires_at` integer,
	`rank` text DEFAULT 'starter' NOT NULL,
	`commission_rate` real DEFAULT 0.1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`join_date` integer,
	`created_at` integer,
	`updated_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_rank_tiers` (
	`key` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`min_projects` integer DEFAULT 0 NOT NULL,
	`min_revenue` real DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_automatic` integer DEFAULT true NOT NULL,
	`updated_at` integer
);

INSERT OR IGNORE INTO `partner_rank_tiers` (`key`,`label`,`min_projects`,`min_revenue`,`sort_order`,`is_automatic`,`updated_at`) VALUES
	('starter','Starter',0,0,0,1,unixepoch()),
	('bronze','Bronze',2,5000,1,1,unixepoch()),
	('silver','Silver',5,15000,2,1,unixepoch()),
	('gold','Gold',10,35000,3,1,unixepoch()),
	('platinum','Platinum',20,75000,4,1,unixepoch()),
	('elite','Elite',0,0,5,0,unixepoch());

CREATE TABLE IF NOT EXISTS `partner_rank_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partner_id` integer NOT NULL,
	`previous_rank` text NOT NULL,
	`new_rank` text NOT NULL,
	`reason` text,
	`actor` text DEFAULT 'system' NOT NULL,
	`created_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_agreement_versions` (
	`version` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`content_hash` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`effective_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_agreements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partner_id` integer NOT NULL,
	`version` text NOT NULL,
	`acceptance_record_id` text NOT NULL UNIQUE,
	`signed_name` text NOT NULL,
	`signature_data` text,
	`document_hash` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`accepted_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_referrals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`referral_id` text NOT NULL UNIQUE,
	`partner_id` integer NOT NULL,
	`business_name` text NOT NULL,
	`contact_name` text,
	`contact_email` text,
	`contact_phone` text,
	`website` text,
	`industry` text,
	`service` text,
	`budget` text,
	`relationship` text,
	`notes` text,
	`attribution` text,
	`lead_id` integer,
	`status` text DEFAULT 'submitted' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_commissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partner_id` integer NOT NULL,
	`referral_id` integer,
	`project_name` text NOT NULL,
	`project_value` real DEFAULT 0 NOT NULL,
	`amount_received` real DEFAULT 0 NOT NULL,
	`commission_rate` real DEFAULT 0.1 NOT NULL,
	`commission_amount` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payable_date` integer,
	`paid_date` integer,
	`payment_reference` text,
	`created_at` integer,
	`updated_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` text NOT NULL UNIQUE,
	`partner_id` integer NOT NULL,
	`type` text NOT NULL,
	`rank` text,
	`issue_date` integer,
	`snapshot` text,
	`status` text DEFAULT 'valid' NOT NULL,
	`created_at` integer
);

CREATE TABLE IF NOT EXISTS `partner_audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`meta` text,
	`ip_address` text,
	`created_at` integer
);

CREATE INDEX IF NOT EXISTS `idx_partner_applications_status` ON `partner_applications` (`status`);
CREATE INDEX IF NOT EXISTS `idx_partner_applications_email` ON `partner_applications` (`email`);
CREATE INDEX IF NOT EXISTS `idx_partners_status` ON `partners` (`status`);
CREATE INDEX IF NOT EXISTS `idx_partner_referrals_partner` ON `partner_referrals` (`partner_id`);
CREATE INDEX IF NOT EXISTS `idx_partner_referrals_status` ON `partner_referrals` (`status`);
CREATE INDEX IF NOT EXISTS `idx_partner_commissions_partner` ON `partner_commissions` (`partner_id`);
CREATE INDEX IF NOT EXISTS `idx_partner_commissions_status` ON `partner_commissions` (`status`);
CREATE INDEX IF NOT EXISTS `idx_partner_agreements_partner` ON `partner_agreements` (`partner_id`);
CREATE INDEX IF NOT EXISTS `idx_partner_documents_partner` ON `partner_documents` (`partner_id`);
CREATE INDEX IF NOT EXISTS `idx_partner_audit_logs_created` ON `partner_audit_logs` (`created_at`);
