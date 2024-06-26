import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  BookId,
  NewBookParams,
  UpdateBookParams,
  updateBookSchema,
  insertBookSchema,
  books,
  bookIdSchema
} from "@/lib/db/schema/books";
import { getUserAuth } from "@/lib/auth/utils";
import { BookShelfId } from "@/lib/db/schema/bookShelves";

export const createBook = async (book: NewBookParams) => {
  const { session } = await getUserAuth();
  const newBook = insertBookSchema.parse({
    ...book,
    userId: session?.user.id!
  });
  try {
    const [b] = await db.insert(books).values(newBook).returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBook = async (id: BookId, book: UpdateBookParams) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const newBook = updateBookSchema.parse({
    ...book,
    userId: session?.user.id!
  });
  try {
    const [b] = await db
      .update(books)
      .set({ ...newBook, updatedAt: new Date() })
      .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
      .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBookFavoritedStatus = async (
  id: BookId,
  favorited: boolean
) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  try {
    const [b] = await db
      .update(books)
      .set({ favorited, updatedAt: new Date() })
      .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
      .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBookStatus = async (
  id: BookId,
  status: "completed" | "in-progress" | "unread"
) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  try {
    const [b] = await db
      .update(books)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
      .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBookBookshelf = async (
  id: BookId,
  bookShelfId: BookShelfId
) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });

  try {
    const [b] = await db
      .update(books)
      .set({ bookShelfId, updatedAt: new Date() })
      .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
      .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBook = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  try {
    const [b] = await db
      .delete(books)
      .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
      .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
