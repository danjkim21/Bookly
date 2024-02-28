CREATE TABLE IF NOT EXISTS "book_shelves" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"public" boolean NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" varchar(256) NOT NULL,
	"book_shelf_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_book_shelf_id_book_shelves_id_fk" FOREIGN KEY ("book_shelf_id") REFERENCES "book_shelves"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
