import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { bookShelves } from "./bookShelves";
import { type getComments } from "@/lib/api/comments/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const comments = pgTable("comments", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: varchar("content", { length: 256 }).notNull(),
  bookShelfId: varchar("book_shelf_id", { length: 256 })
    .references(() => bookShelves.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`)
});

// Schema for comments - used to validate API requests
const baseSchema = createSelectSchema(comments).omit(timestamps);

export const insertCommentSchema =
  createInsertSchema(comments).omit(timestamps);
export const insertCommentParams = baseSchema
  .extend({
    bookShelfId: z.coerce.string().min(1)
  })
  .omit({
    id: true,
    userId: true
  });

export const updateCommentSchema = baseSchema;
export const updateCommentParams = baseSchema
  .extend({
    bookShelfId: z.coerce.string().min(1)
  })
  .omit({
    userId: true
  });
export const commentIdSchema = baseSchema.pick({ id: true });

// Types for comments - used to type API request params and within Components
export type Comment = typeof comments.$inferSelect;
export type NewComment = z.infer<typeof insertCommentSchema>;
export type NewCommentParams = z.infer<typeof insertCommentParams>;
export type UpdateCommentParams = z.infer<typeof updateCommentParams>;
export type CommentId = z.infer<typeof commentIdSchema>["id"];

// this type infers the return from getComments() - meaning it will include any joins
export type CompleteComment = Awaited<
  ReturnType<typeof getComments>
>["comments"][number];
