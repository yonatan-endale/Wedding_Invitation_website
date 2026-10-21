CREATE TABLE "honorees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"name" jsonb NOT NULL,
	"nick" jsonb,
	"father" jsonb,
	"headline" jsonb,
	"subheadline" jsonb,
	"story" jsonb,
	"portrait_url" text,
	"portrait_position" text DEFAULT '50% 40%' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "couples" ALTER COLUMN "partner_one" SET DEFAULT '{"en":""}'::jsonb;--> statement-breakpoint
ALTER TABLE "couples" ALTER COLUMN "partner_two" SET DEFAULT '{"en":""}'::jsonb;--> statement-breakpoint
ALTER TABLE "couples" ADD COLUMN "event_type" text DEFAULT 'wedding' NOT NULL;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "group_label" jsonb;--> statement-breakpoint
ALTER TABLE "honorees" ADD CONSTRAINT "honorees_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "honorees_couple_idx" ON "honorees" USING btree ("couple_id","sort_order");