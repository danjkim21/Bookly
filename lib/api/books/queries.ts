import { db } from "@/lib/db/index";
import { eq, and, desc } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BookId, bookIdSchema, books } from "@/lib/db/schema/books";
import { authors } from "@/lib/db/schema/authors";
import { quotes, type CompleteQuote } from "@/lib/db/schema/quotes";
import {
  reflections,
  type CompleteReflection
} from "@/lib/db/schema/reflections";
import { CompleteReview, reviews } from "@/lib/db/schema/reviews";
import { users } from "@/lib/db/schema/auth";

export const getBooks = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ book: books, author: authors })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .where(eq(books.userId, session?.user.id!))
    // .orderBy(desc(books.createdAt));
    .orderBy(books.createdAt);
  const b = rows.map((r) => ({ ...r.book, author: r.author }));
  return { books: b };
};

export const getMostRecentBooks = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ book: books, author: authors })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .where(eq(books.userId, session?.user.id!))
    .orderBy(desc(books.createdAt))
    .limit(2);
  const b = rows.map((r) => ({ ...r.book, author: r.author }));
  return { books: b };
};

export const getBookById = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const [row] = await db
    .select({ book: books, author: authors })
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, session?.user.id!)))
    .leftJoin(authors, eq(books.authorId, authors.id));
  if (row === undefined) return {};
  const b = { ...row.book, author: row.author };
  return { book: b };
};

export const getBookByIdWithQuotesAndReflectionsAndReviews = async (
  id: BookId
) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const rows = await db
    .select({
      book: books,
      quote: quotes,
      reflection: reflections,
      review: reviews,
      users: users
    })
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, session?.user.id!)))
    .leftJoin(quotes, eq(books.id, quotes.bookId))
    .leftJoin(reflections, eq(books.id, reflections.bookId))
    .leftJoin(reviews, eq(books.id, reviews.bookId))
    .leftJoin(users, eq(books.userId, users.id));

  if (rows.length === 0) return {};
  const b = rows[0].book;
  const bq = rows
    .filter((r) => r.quote !== null)
    .map((q) => q.quote) as CompleteQuote[];
  const br = rows
    .filter((r) => r.reflection !== null)
    .map((r) => r.reflection) as CompleteReflection[];
  const brw = rows[0].review as CompleteReview;
  const u = rows[0].users;

  return { book: b, quotes: bq, reflections: br, review: brw, user: u };
};

// Book Search API - https://openlibrary.org/developers/api
export interface BookSearchResult {
  title: string;
  author_name: string;
  key: string;
}

export const getBookSearchResults = async (
  query: string
): Promise<BookSearchResult[]> => {
  if (query.length === 0) return [];

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", query);
  url.searchParams.set("fields", "title,author_name,key");
  url.searchParams.set("limit", "10");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    next: { revalidate: 10 }
  });

  const data = await response.json();
  return data.docs as BookSearchResult[];
};
