import { sql } from "drizzle-orm";
import { varchar, boolean, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getBookShelves } from "@/lib/api/bookShelves/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const bookShelves = pgTable("book_shelves", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  public: boolean("public").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`)
});

// Schema for bookShelves - used to validate API requests
const baseSchema = createSelectSchema(bookShelves).omit(timestamps);

export const insertBookShelfSchema =
  createInsertSchema(bookShelves).omit(timestamps);
export const insertBookShelfParams = baseSchema
  .extend({
    public: z.coerce.boolean()
  })
  .omit({
    id: true,
    userId: true
  });

export const updateBookShelfSchema = baseSchema;
export const updateBookShelfParams = baseSchema
  .extend({
    public: z.coerce.boolean()
  })
  .omit({
    userId: true
  });
export const bookShelfIdSchema = baseSchema.pick({ id: true });

// Types for bookShelves - used to type API request params and within Components
export type BookShelf = typeof bookShelves.$inferSelect;
export type NewBookShelf = z.infer<typeof insertBookShelfSchema>;
export type NewBookShelfParams = z.infer<typeof insertBookShelfParams>;
export type UpdateBookShelfParams = z.infer<typeof updateBookShelfParams>;
export type BookShelfId = z.infer<typeof bookShelfIdSchema>["id"];

// this type infers the return from getBookShelves() - meaning it will include any joins
export type CompleteBookShelf = Awaited<
  ReturnType<typeof getBookShelves>
>["bookShelves"][number];
