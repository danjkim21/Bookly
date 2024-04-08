ALTER TABLE "books" DROP CONSTRAINT "books_book_shelf_id_book_shelves_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "books" ADD CONSTRAINT "books_book_shelf_id_book_shelves_id_fk" FOREIGN KEY ("book_shelf_id") REFERENCES "book_shelves"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
