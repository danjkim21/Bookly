import { db } from "@/lib/db/index";
import { eq, and, desc } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type BookShelfId,
  bookShelfIdSchema,
  bookShelves
} from "@/lib/db/schema/bookShelves";
import { comments, type CompleteComment } from "@/lib/db/schema/comments";
import { CompleteBook, books } from "@/lib/db/schema/books";

export const getBookShelves = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(bookShelves)
    .where(eq(bookShelves.userId, session?.user.id!));
  const b = rows;
  return { bookShelves: b };
};

export const getMostRecentBookShelves = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(bookShelves)
    .where(eq(bookShelves.userId, session?.user.id!))
    .orderBy(desc(bookShelves.createdAt))
    .limit(2);
  const b = rows;
  return { bookShelves: b };
};

export const getBookShelfById = async (id: BookShelfId) => {
  const { session } = await getUserAuth();
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(bookShelves)
    .where(
      and(
        eq(bookShelves.id, bookShelfId),
        eq(bookShelves.userId, session?.user.id!)
      )
    );
  if (row === undefined) return {};
  const b = row;
  return { bookShelf: b };
};

export const getBookShelfBySlugWithBooksAndComments = async (slug: string) => {
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id: slug });

  const rows = await db
    .select({ bookShelf: bookShelves, comment: comments, book: books })
    .from(bookShelves)
    .where(eq(bookShelves.slug, bookShelfId))
    .leftJoin(books, eq(bookShelves.id, books.bookShelfId))
    .leftJoin(comments, eq(bookShelves.id, comments.bookShelfId));

  if (rows.length === 0) return {};
  const b = rows[0].bookShelf;
  const bb = rows
    .filter((r) => r.book !== null)
    .map((c) => c.book) as CompleteBook[];
  const bc = rows
    .filter((r) => r.comment !== null)
    .map((c) => c.comment) as CompleteComment[];

  return { bookShelf: b, books: bb, comments: bc };
};

export const getBookShelfByIdWithComments = async (id: BookShelfId) => {
  const { session } = await getUserAuth();
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id });
  const rows = await db
    .select({ bookShelf: bookShelves, comment: comments })
    .from(bookShelves)
    .where(
      and(
        eq(bookShelves.id, bookShelfId),
        eq(bookShelves.userId, session?.user.id!)
      )
    )
    .leftJoin(comments, eq(bookShelves.id, comments.bookShelfId));
  if (rows.length === 0) return {};
  const b = rows[0].bookShelf;
  const bc = rows
    .filter((r) => r.comment !== null)
    .map((c) => c.comment) as CompleteComment[];

  return { bookShelf: b, comments: bc };
};

export const getBookShelfByIdWithBooksAndComments = async (id: BookShelfId) => {
  const { session } = await getUserAuth();
  const { id: bookShelfId } = bookShelfIdSchema.parse({ id });

  const rows = await db
    .select({ bookShelf: bookShelves, comment: comments, book: books })
    .from(bookShelves)
    .where(
      and(
        eq(bookShelves.id, bookShelfId),
        eq(bookShelves.userId, session?.user.id!)
      )
    )
    .leftJoin(comments, eq(bookShelves.id, comments.bookShelfId))
    .leftJoin(books, eq(bookShelves.id, books.bookShelfId));

  if (rows.length === 0) return {};
  const b = rows[0].bookShelf;
  const bb = rows
    .filter((r) => r.book !== null)
    .map((c) => c.book) as CompleteBook[];
  const bc = rows
    .filter((r) => r.comment !== null)
    .map((c) => c.comment) as CompleteComment[];

  return { bookShelf: b, books: bb, comments: bc };
};
