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
CREATE TABLE "pokemon_tcg" (
	"id" text PRIMARY KEY DEFAULT 'pokemon' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_cards" ADD CONSTRAINT "pokemon_cards_id_cards_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_sets" ADD CONSTRAINT "pokemon_sets_id_sets_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_tcg" ADD CONSTRAINT "pokemon_tcg_id_games_id_fk" FOREIGN KEY ("id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;