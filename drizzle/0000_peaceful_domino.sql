CREATE TABLE "couples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"partner_one" jsonb NOT NULL,
	"partner_two" jsonb NOT NULL,
	"tagline" jsonb,
	"wedding_at" timestamp with time zone NOT NULL,
	"timezone" text DEFAULT 'Africa/Addis_Ababa' NOT NULL,
	"city" jsonb,
	"invitation" jsonb,
	"hosts" jsonb,
	"story" jsonb,
	"scripture" jsonb,
	"scripture_ref" jsonb,
	"dress_code" jsonb,
	"gift_note" jsonb,
	"hero_photo_url" text,
	"hero_position" text DEFAULT '50% 40%' NOT NULL,
	"music_url" text,
	"music_title" text,
	"telegram_url" text,
	"theme" text DEFAULT 'tibeb' NOT NULL,
	"rsvp_enabled" boolean DEFAULT true NOT NULL,
	"rsvp_deadline" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "couples_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"title" jsonb NOT NULL,
	"description" jsonb,
	"starts_at" timestamp with time zone NOT NULL,
	"venue_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"kind" text DEFAULT 'bank' NOT NULL,
	"provider" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"note" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"url" text NOT NULL,
	"caption" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"attending" boolean NOT NULL,
	"guest_count" integer NOT NULL,
	"message" text,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"name" jsonb NOT NULL,
	"address" jsonb,
	"maps_url" text,
	"lat" double precision,
	"lng" double precision,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_id" uuid NOT NULL,
	"title" jsonb NOT NULL,
	"url" text,
	"image_url" text,
	"price" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_accounts" ADD CONSTRAINT "gift_accounts_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_couple_id_couples_id_fk" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_couple_idx" ON "events" USING btree ("couple_id","starts_at");--> statement-breakpoint
CREATE INDEX "gift_accounts_couple_idx" ON "gift_accounts" USING btree ("couple_id","sort_order");--> statement-breakpoint
CREATE INDEX "photos_couple_idx" ON "photos" USING btree ("couple_id","sort_order");--> statement-breakpoint
CREATE INDEX "rsvps_couple_idx" ON "rsvps" USING btree ("couple_id","created_at");--> statement-breakpoint
CREATE INDEX "venues_couple_idx" ON "venues" USING btree ("couple_id","sort_order");--> statement-breakpoint
CREATE INDEX "wishlist_items_couple_idx" ON "wishlist_items" USING btree ("couple_id","sort_order");