import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getAuthors } from "@/lib/api/authors/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const authors = pgTable("authors", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`)
});

// Schema for authors - used to validate API requests
const baseSchema = createSelectSchema(authors).omit(timestamps);

export const insertAuthorSchema = createInsertSchema(authors).omit(timestamps);
export const insertAuthorParams = baseSchema.extend({}).omit({
  id: true,
  userId: true
});

export const updateAuthorSchema = baseSchema;
export const updateAuthorParams = baseSchema.extend({}).omit({
  userId: true
});
export const authorIdSchema = baseSchema.pick({ id: true });

// Types for authors - used to type API request params and within Components
export type Author = typeof authors.$inferSelect;
export type NewAuthor = z.infer<typeof insertAuthorSchema>;
export type NewAuthorParams = z.infer<typeof insertAuthorParams>;
export type UpdateAuthorParams = z.infer<typeof updateAuthorParams>;
export type AuthorId = z.infer<typeof authorIdSchema>["id"];

// this type infers the return from getAuthors() - meaning it will include any joins
export type CompleteAuthor = Awaited<
  ReturnType<typeof getAuthors>
>["authors"][number];
