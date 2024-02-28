import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { books } from "./books";
import { type getQuotes } from "@/lib/api/quotes/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const quotes = pgTable("quotes", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: varchar("content", { length: 256 }).notNull(),
  bookId: varchar("book_id", { length: 256 })
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for quotes - used to validate API requests
const baseSchema = createSelectSchema(quotes).omit(timestamps);

export const insertQuoteSchema = createInsertSchema(quotes).omit(timestamps);
export const insertQuoteParams = baseSchema
  .extend({
    bookId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateQuoteSchema = baseSchema;
export const updateQuoteParams = baseSchema
  .extend({
    bookId: z.coerce.string().min(1),
  })
  .omit({
    userId: true,
  });
export const quoteIdSchema = baseSchema.pick({ id: true });

// Types for quotes - used to type API request params and within Components
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = z.infer<typeof insertQuoteSchema>;
export type NewQuoteParams = z.infer<typeof insertQuoteParams>;
export type UpdateQuoteParams = z.infer<typeof updateQuoteParams>;
export type QuoteId = z.infer<typeof quoteIdSchema>["id"];

// this type infers the return from getQuotes() - meaning it will include any joins
export type CompleteQuote = Awaited<
  ReturnType<typeof getQuotes>
>["quotes"][number];
