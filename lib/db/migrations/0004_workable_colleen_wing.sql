ALTER TABLE "book_shelves" ADD CONSTRAINT "book_shelves_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_title_unique" UNIQUE("title");