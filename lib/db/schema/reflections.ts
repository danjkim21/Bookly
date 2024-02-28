import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { books } from "./books";
import { type getReflections } from "@/lib/api/reflections/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const reflections = pgTable("reflections", {
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
    .default(sql`now()`)
});

// Schema for reflections - used to validate API requests
const baseSchema = createSelectSchema(reflections).omit(timestamps);

export const insertReflectionSchema =
  createInsertSchema(reflections).omit(timestamps);
export const insertReflectionParams = baseSchema
  .extend({
    bookId: z.coerce.string().min(1)
  })
  .omit({
    id: true,
    userId: true
  });

export const updateReflectionSchema = baseSchema;
export const updateReflectionParams = baseSchema
  .extend({
    bookId: z.coerce.string().min(1)
  })
  .omit({
    userId: true
  });
export const reflectionIdSchema = baseSchema.pick({ id: true });

// Types for reflections - used to type API request params and within Components
export type Reflection = typeof reflections.$inferSelect;
export type NewReflection = z.infer<typeof insertReflectionSchema>;
export type NewReflectionParams = z.infer<typeof insertReflectionParams>;
export type UpdateReflectionParams = z.infer<typeof updateReflectionParams>;
export type ReflectionId = z.infer<typeof reflectionIdSchema>["id"];

// this type infers the return from getReflections() - meaning it will include any joins
export type CompleteReflection = Awaited<
  ReturnType<typeof getReflections>
>["reflections"][number];
