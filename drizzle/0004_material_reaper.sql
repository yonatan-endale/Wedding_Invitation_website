CREATE TABLE "story_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"happened_on" date NOT NULL,
	"title" jsonb NOT NULL,
	"body" jsonb,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "partner_one_role" text DEFAULT 'bride' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "partner_two_role" text DEFAULT 'groom' NOT NULL;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "partner_one_portrait_url" text;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "partner_two_portrait_url" text;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "layout" text DEFAULT 'classic' NOT NULL;--> statement-breakpoint
ALTER TABLE "story_milestones" ADD CONSTRAINT "story_milestones_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "story_milestones_couple_idx" ON "story_milestones" USING btree ("couple_id","sort_order");