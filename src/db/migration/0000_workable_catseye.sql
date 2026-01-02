CREATE TABLE `domain` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cf_zone_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `domain_name_unique` ON `domain` (`name`);--> statement-breakpoint
CREATE TABLE `tunnel` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cf_tunnel_id` text,
	`cf_account_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tunnel_name_unique` ON `tunnel` (`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_discord_id_unique` ON `user` (`discord_id`);