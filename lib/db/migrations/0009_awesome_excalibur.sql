ALTER TABLE "books" ADD COLUMN "status" text DEFAULT 'unread' NOT NULL;--> statement-breakpoint
ALTER TABLE "book_shelves" ADD CONSTRAINT "book_shelves_slug_unique" UNIQUE("slug");