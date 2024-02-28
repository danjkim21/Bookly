import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  BookShelfId,
  NewBookShelfParams,
  UpdateBookShelfParams,
  updateBookShelfSchema,
  insertBookShelfSchema,
  bookShelves,
  bookShelfIdSchema
} from "@/lib/db/schema/bookShelves";
import { getUserAuth } from "@/lib/auth/utils";

export const createBookShelf = async (bookShelf: NewBookShelfParams) => {
  const { session } = await getUserAuth();
  const newBookShelf = insertBookShelfSchema.parse({
    ...bookShelf,
    userId: session?.user.id!
  });
  try {
    const [b] = await db.insert(bookShelves).values(newBookShelf).returning();
    return { bookShelf: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBookShelf = async (
  id: BookShelfId,
  bookShelf: UpdateBookShelfParams
) => {
  const { session } = await getUserAuth();
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id });
  const newBookShelf = updateBookShelfSchema.parse({
    ...bookShelf,
    userId: session?.user.id!
  });
  try {
    const [b] = await db
      .update(bookShelves)
      .set({ ...newBookShelf, updatedAt: new Date() })
      .where(
        and(
          eq(bookShelves.id, bookShelfId!),
          eq(bookShelves.userId, session?.user.id!)
        )
      )
      .returning();
    return { bookShelf: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBookShelf = async (id: BookShelfId) => {
  const { session } = await getUserAuth();
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id });
  try {
    const [b] = await db
      .delete(bookShelves)
      .where(
        and(
          eq(bookShelves.id, bookShelfId!),
          eq(bookShelves.userId, session?.user.id!)
        )
      )
      .returning();
    return { bookShelf: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
