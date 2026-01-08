CREATE TABLE `dns_record` (
	`id` text PRIMARY KEY NOT NULL,
	`domain_id` text NOT NULL,
	`cf_record_id` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`proxied` integer DEFAULT false,
	FOREIGN KEY (`domain_id`) REFERENCES `domain`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dns_record_cf_record_id_unique` ON `dns_record` (`cf_record_id`);--> statement-breakpoint
CREATE TABLE `tunnel_ingress` (
	`id` text PRIMARY KEY NOT NULL,
	`tunnel_id` text NOT NULL,
	`hostname` text,
	`service` text NOT NULL,
	`path` text,
	FOREIGN KEY (`tunnel_id`) REFERENCES `tunnel`(`id`) ON UPDATE no action ON DELETE no action
);
