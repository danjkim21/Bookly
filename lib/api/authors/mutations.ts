import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  AuthorId,
  NewAuthorParams,
  UpdateAuthorParams,
  updateAuthorSchema,
  insertAuthorSchema,
  authors,
  authorIdSchema
} from "@/lib/db/schema/authors";
import { getUserAuth } from "@/lib/auth/utils";

export const createAuthor = async (author: NewAuthorParams) => {
  const { session } = await getUserAuth();
  const newAuthor = insertAuthorSchema.parse({
    ...author,
    userId: session?.user.id!
  });
  try {
    const [a] = await db
      .insert(authors)
      .values(newAuthor)
      .onConflictDoUpdate({
        target: authors.name,
        set: { name: newAuthor.name }
      })
      .returning();

    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAuthor = async (
  id: AuthorId,
  author: UpdateAuthorParams
) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  const newAuthor = updateAuthorSchema.parse({
    ...author,
    userId: session?.user.id!
  });
  try {
    const [a] = await db
      .update(authors)
      .set({ ...newAuthor, updatedAt: new Date() })
      .where(
        and(eq(authors.id, authorId!), eq(authors.userId, session?.user.id!))
      )
      .returning();
    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAuthor = async (id: AuthorId) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  try {
    const [a] = await db
      .delete(authors)
      .where(
        and(eq(authors.id, authorId!), eq(authors.userId, session?.user.id!))
      )
      .returning();
    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
