CREATE TABLE "card_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid,
	"graded_id" uuid,
	"source" varchar(60) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"kind" varchar(60) NOT NULL,
	"language" varchar(16) DEFAULT 'EN' NOT NULL,
	"print_run" integer,
	"is_limited" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card_prices" ADD CONSTRAINT "card_prices_variant_id_card_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."card_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_prices" ADD CONSTRAINT "card_prices_graded_id_graded_cards_id_fk" FOREIGN KEY ("graded_id") REFERENCES "public"."graded_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_variants" ADD CONSTRAINT "card_variants_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_variants_card_kind_lang_idx" ON "card_variants" USING btree ("card_id","kind","language");