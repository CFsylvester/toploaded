CREATE TABLE "cards" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"set_id" text NOT NULL,
	"name" text NOT NULL,
	"searchable_name" text NOT NULL,
	"number" text NOT NULL,
	"slug" text NOT NULL,
	"external_id" text NOT NULL,
	"images" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"searchable_name" text NOT NULL,
	"slug" text NOT NULL,
	"total_cards" integer,
	"release_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"vendor_id" text,
	"condition" text,
	"purchase_price" integer,
	"purchase_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"inventory_id" text NOT NULL,
	"photo_url" text NOT NULL,
	"photo_type" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"note_id" text NOT NULL,
	"photo_url" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"details" jsonb,
	"pokedex" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"series" text,
	"searchable_series" text,
	"images" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"variant" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_master_set_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"variant" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grading" (
	"id" text PRIMARY KEY NOT NULL,
	"inventory_id" text NOT NULL,
	"grading_company" text NOT NULL,
	"status" text NOT NULL,
	"tracking_number_to_grader" text,
	"tracking_number_from_grader" text,
	"expected_grade" text,
	"actual_grade" text,
	"grading_cost" integer,
	"grading_shipment_cost" integer,
	"grading_total_cost" integer,
	"submission_date" timestamp,
	"received_by_grader_date" timestamp,
	"grading_completed_date" timestamp,
	"received_back_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psa_grading" (
	"id" text PRIMARY KEY NOT NULL,
	"grade" integer,
	"cert_number" text,
	"in_grader_vault" boolean DEFAULT false,
	"item_authenticated" boolean DEFAULT false,
	"psa_service_level" text,
	"submission_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"vendor_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ebay_vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"ebay_username" text NOT NULL,
	"ebay_feedback" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_shop_vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_name" text NOT NULL,
	"address" text,
	"phone" text,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "individual_vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"seller_name" text,
	"platform" text,
	"contact_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pack_pull_vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"pack_type" text NOT NULL,
	"set_id" text,
	"purchase_location" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trade_vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"trader_name" text,
	"platform" text,
	"contact_info" text,
	"reputation" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_photos" ADD CONSTRAINT "inventory_photos_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_photos" ADD CONSTRAINT "note_photos_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_cards" ADD CONSTRAINT "pokemon_cards_id_cards_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_sets" ADD CONSTRAINT "pokemon_sets_id_sets_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_inventory" ADD CONSTRAINT "pokemon_inventory_id_inventory_id_fk" FOREIGN KEY ("id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_master_set_cards" ADD CONSTRAINT "pokemon_master_set_cards_id_master_set_cards_id_fk" FOREIGN KEY ("id") REFERENCES "public"."master_set_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grading" ADD CONSTRAINT "grading_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psa_grading" ADD CONSTRAINT "psa_grading_id_grading_id_fk" FOREIGN KEY ("id") REFERENCES "public"."grading"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ebay_vendors" ADD CONSTRAINT "ebay_vendors_id_vendors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_shop_vendors" ADD CONSTRAINT "card_shop_vendors_id_vendors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "individual_vendors" ADD CONSTRAINT "individual_vendors_id_vendors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pack_pull_vendors" ADD CONSTRAINT "pack_pull_vendors_id_vendors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pack_pull_vendors" ADD CONSTRAINT "pack_pull_vendors_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_vendors" ADD CONSTRAINT "trade_vendors_id_vendors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;