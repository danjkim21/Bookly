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
  key: string;
  title: string;
  authorName: string;
  coverImg: string;
}

export const getBookSearchResults = async (
  query: string
): Promise<BookSearchResult[]> => {
  if (query.length === 0) return [];

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", query);
  url.searchParams.set("fields", "key,title,author_name,editions");
  url.searchParams.set("language", "en");
  url.searchParams.set("limit", "6");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    next: { revalidate: 10 }
  });

  const data = await response.json();

  if (data.numFound === 0) {
    return [];
  }

  data.docs = data.docs.map((doc: any) => {
    return {
      key: doc.key.split("/").pop(),
      title: doc.title,
      authorName: doc.author_name,
      coverImg: doc.editions.docs[0].key.split("/").pop()
    };
  });

  return data.docs as BookSearchResult[];
};

export const getBookDetailsByTitle = async (title: string) => {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", title);
  url.searchParams.set(
    "fields",
    "key,title,subtitle,author_name,isbn,editions,subject,ratings_average,ratings_count,number_of_pages_median"
  );
  url.searchParams.set("language", "en");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    next: { revalidate: 10 }
  });

  const data = await response.json();

  data.docs = data.docs.map((doc: any) => {
    return {
      ...doc,
      key: doc.key.split("/").pop(),
      coverImg: doc.editions.docs[0].key.split("/").pop()
    };
  });

  return { bookDetails: data.docs[0] };
};
