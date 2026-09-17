ALTER TABLE "couples" ADD COLUMN "partner_one_nick" jsonb;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "partner_two_nick" jsonb;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "border" text DEFAULT 'tibeb' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "petals" boolean DEFAULT true NOT NULL;