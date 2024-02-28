import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type AuthorId,
  authorIdSchema,
  authors,
} from "@/lib/db/schema/authors";
import { books, type CompleteBook } from "@/lib/db/schema/books";

export const getAuthors = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(authors)
    .where(eq(authors.userId, session?.user.id!));
  const a = rows;
  return { authors: a };
};

export const getAuthorById = async (id: AuthorId) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(authors)
    .where(
      and(eq(authors.id, authorId), eq(authors.userId, session?.user.id!)),
    );
  if (row === undefined) return {};
  const a = row;
  return { author: a };
};

export const getAuthorByIdWithBooks = async (id: AuthorId) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  const rows = await db
    .select({ author: authors, book: books })
    .from(authors)
    .where(and(eq(authors.id, authorId), eq(authors.userId, session?.user.id!)))
    .leftJoin(books, eq(authors.id, books.authorId));
  if (rows.length === 0) return {};
  const a = rows[0].author;
  const ab = rows
    .filter((r) => r.book !== null)
    .map((b) => b.book) as CompleteBook[];

  return { author: a, books: ab };
};
