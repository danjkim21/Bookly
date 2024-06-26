import { sql } from "drizzle-orm";
import {
  varchar,
  boolean,
  date,
  timestamp,
  pgTable,
  text
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { authors } from "./authors";
import { bookShelves } from "./bookShelves";
import { type getBooks } from "@/lib/api/books/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const books = pgTable("books", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 256 }).unique().notNull(),
  completedOn: date("completed_on"),
  favorited: boolean("favorited"),
  authorId: varchar("author_id", { length: 256 })
    .references(() => authors.id, { onDelete: "cascade" })
    .notNull(),
  bookShelfId: varchar("book_shelf_id", { length: 256 }).references(
    () => bookShelves.id
  ),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
  status: text("status", {
    enum: ["unread", "in-progress", "completed"]
  })
    .notNull()
    .default("unread")
});

// Schema for books - used to validate API requests
const baseSchema = createSelectSchema(books).omit(timestamps);

export const insertBookSchema = createInsertSchema(books).omit(timestamps);
export const insertBookParams = baseSchema
  .extend({
    title: z.coerce.string().min(1, "Add a Title"),
    completedOn: z.coerce
      .string()
      .optional()
      .transform((e) => (e === "" || e === "undefined" ? undefined : e)),
    favorited: z.coerce
      .boolean()
      .optional()
      .transform((e) => (e === null || e === undefined ? false : e)),
    authorId: z.coerce.string().min(1, "Select or Add an Author"),
    bookShelfId: z.coerce
      .string()
      .optional()
      .transform((e) => (e === "" || e === "undefined" ? undefined : e))
  })
  .omit({
    id: true,
    userId: true
  });

export const updateBookSchema = baseSchema;
export const updateBookParams = baseSchema
  .extend({
    completedOn: z.coerce
      .string()
      .optional()
      .transform((e) => (e === "" || e === "undefined" ? undefined : e)),
    favorited: z.coerce
      .boolean()
      .optional()
      .transform((e) => (e === null || e === undefined ? false : e)),
    authorId: z.coerce.string().min(1),
    bookShelfId: z.coerce
      .string()
      .optional()
      .transform((e) => (e === "" || e === "undefined" ? undefined : e))
  })
  .omit({
    userId: true
  });
export const bookIdSchema = baseSchema.pick({ id: true });

// Types for books - used to type API request params and within Components
export type Book = typeof books.$inferSelect;
export type NewBook = z.infer<typeof insertBookSchema>;
export type NewBookParams = z.infer<typeof insertBookParams>;
export type UpdateBookParams = z.infer<typeof updateBookParams>;
export type BookId = z.infer<typeof bookIdSchema>["id"];

// this type infers the return from getBooks() - meaning it will include any joins
export type CompleteBook = Awaited<
  ReturnType<typeof getBooks>
>["books"][number];
