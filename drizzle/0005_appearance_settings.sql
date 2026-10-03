ALTER TABLE "couples" ADD COLUMN "opening" text DEFAULT 'netela' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "calendar_style" text DEFAULT 'both' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "motion" text DEFAULT 'moderate' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "ornament" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "calendar_photo_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "kind" text DEFAULT 'other' NOT NULL;