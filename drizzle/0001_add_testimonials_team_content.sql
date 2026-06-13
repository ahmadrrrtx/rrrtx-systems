-- Migration: add testimonials, team_members, and content_pages tables.
-- Safe to run multiple times (IF NOT EXISTS). Apply to the production Turso DB.
--
-- How to apply:
--   turso db shell rrrtx-systems < drizzle/0001_add_testimonials_team_content.sql
-- Or, preferred (matches the existing project workflow):
--   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx drizzle-kit push

CREATE TABLE IF NOT EXISTS `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`company` text,
	`quote` text NOT NULL,
	`rating` integer DEFAULT 5,
	`image_url` text,
	`featured` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` integer
);

CREATE TABLE IF NOT EXISTS `team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text,
	`image_url` text,
	`linkedin_url` text,
	`twitter_url` text,
	`sort_order` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` integer
);

CREATE TABLE IF NOT EXISTS `content_pages` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`meta_description` text,
	`updated_at` integer
);
